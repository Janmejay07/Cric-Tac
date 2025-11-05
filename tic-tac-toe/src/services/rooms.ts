import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import type { GameState, Board, BoardCell } from '@/utils/gameUtils'

// Serialized board structure for Firebase (flattened cells)
interface SerializedBoard {
  cells: Record<string, BoardCell> // Key format: "row,col"
  size: number
}

// Convert Board to SerializedBoard for Firebase
function serializeBoard(board: Board): SerializedBoard {
  const serialized: Record<string, BoardCell> = {}
  for (let i = 0; i < board.cells.length; i++) {
    for (let j = 0; j < board.cells[i].length; j++) {
      serialized[`${i},${j}`] = board.cells[i][j]
    }
  }
  return { cells: serialized, size: board.size }
}

// Convert SerializedBoard back to Board
function deserializeBoard(serialized: SerializedBoard): Board {
  // Validate serialized board structure
  if (!serialized || typeof serialized.size !== 'number' || !serialized.cells || typeof serialized.cells !== 'object') {
    throw new RoomError('Invalid board data format.', 'INVALID_BOARD_DATA')
  }

  const cells: BoardCell[][] = []
  const size = serialized.size
  
  // Validate size
  if (size <= 0 || size > 10) {
    throw new RoomError('Invalid board size.', 'INVALID_BOARD_SIZE')
  }
  
  for (let i = 0; i < size; i++) {
    cells[i] = []
    for (let j = 0; j < size; j++) {
      const key = `${i},${j}`
      const cell = serialized.cells[key]
      if (!cell) {
        // If cell is missing, create a default locked cell
        cells[i][j] = {
          value: null,
          country: '',
          team: '',
          player: null,
          isLocked: false,
        }
      } else {
        cells[i][j] = cell
      }
    }
  }
  
  return { cells, size }
}

export interface RoomState {
  board: SerializedBoard
  currentPlayer: 'X' | 'O'
  selectedTeams: string[]
  selectedCountries: string[]
  teamOrder: string[]
  countryOrder: string[]
  scores: { X: number; O: number }
  gameOver: boolean
  winner: 'X' | 'O' | 'draw' | null
  gameMode?: 'country-x-ipl' | 'ipl-x-ipl'
  players: {
    X: string | null // user ID
    O: string | null
  }
  status: 'waiting' | 'active' | 'finished' | 'opponent_left'
  leftBy?: 'X' | 'O' | null // Which player left the room
  createdAt: any
  updatedAt: any
}

export class RoomError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'RoomError'
  }
}

// Simple exponential backoff retry for transient Firestore errors
async function retryOperation<T>(fn: () => Promise<T>, retries = 2, baseDelayMs = 250): Promise<T> {
  let attempt = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn()
    } catch (error: any) {
      const code = error?.code
      const transient = code === 'unavailable' || code === 'deadline-exceeded' || code === 'aborted'
      if (attempt >= retries || !transient) throw error
      const delay = baseDelayMs * Math.pow(2, attempt)
      await new Promise(r => setTimeout(r, delay))
      attempt++
    }
  }
}

export async function createRoom(initialState: Omit<RoomState, 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const roomRef = doc(collection(db, 'rooms'))
    await retryOperation(() => setDoc(roomRef, {
      ...initialState,
      status: 'waiting',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }))
    return roomRef.id
  } catch (error: any) {
    if (error.code === 'unavailable') {
      throw new RoomError('Network unavailable. Please check your internet connection.', 'NETWORK_ERROR')
    } else if (error.code === 'deadline-exceeded') {
      throw new RoomError('Request timed out. Please try again.', 'TIMEOUT')
    } else if (error.code === 'permission-denied') {
      throw new RoomError('Permission denied. Please sign in again.', 'PERMISSION_DENIED')
    }
    throw new RoomError(error.message || 'Failed to create room. Please try again.', 'CREATE_ERROR')
  }
}

// Helper to create room state from GameState
export function createRoomStateFromGameState(
  gameState: GameState,
  players: { X: string | null; O: string | null },
  status: 'waiting' | 'active' | 'finished' = 'waiting'
): Omit<RoomState, 'createdAt' | 'updatedAt'> {
  return {
    board: serializeBoard(gameState.board),
    currentPlayer: gameState.currentPlayer,
    selectedTeams: gameState.selectedTeams,
    selectedCountries: gameState.selectedCountries,
    teamOrder: gameState.teamOrder,
    countryOrder: gameState.countryOrder,
    scores: gameState.scores,
    gameOver: gameState.gameOver || false,
    winner: gameState.winner,
    gameMode: gameState.gameMode,
    players,
    status,
  }
}

// Helper to convert RoomState to GameState
export function roomStateToGameState(room: RoomState): GameState {
  return {
    board: deserializeBoard(room.board),
    currentPlayer: room.currentPlayer,
    selectedTeams: room.selectedTeams,
    selectedCountries: room.selectedCountries,
    teamOrder: room.teamOrder,
    countryOrder: room.countryOrder,
    scores: room.scores,
    gameOver: room.gameOver,
    winner: room.winner,
    gameMode: room.gameMode || 'country-x-ipl',
  }
}

export async function joinRoom(roomId: string, userId: string): Promise<RoomState> {
  // Validate room ID format
  if (!roomId || typeof roomId !== 'string' || roomId.trim().length === 0) {
    throw new RoomError('Invalid room ID format.', 'INVALID_ROOM_ID')
  }

  try {
    const roomRef = doc(db, 'rooms', roomId.trim())
    const roomSnap = await getDoc(roomRef)
    
    if (!roomSnap.exists()) {
      throw new RoomError('Room not found. Please check the room ID.', 'ROOM_NOT_FOUND')
    }
    
    const data = roomSnap.data() as RoomState
    
    // Validate room state
    if (!data || !data.players || !data.board) {
      throw new RoomError('Room data is invalid.', 'INVALID_ROOM_DATA')
    }
    
    // Check if room is already finished
    if (data.status === 'finished') {
      throw new RoomError('This room has already finished.', 'ROOM_FINISHED')
    }
    
    // Check if user is rejoining (was in the room before)
    let player: 'X' | 'O' | null = null
    let isRejoin = false
    
    if (data.players.X === userId) {
      player = 'X'
      isRejoin = true
    } else if (data.players.O === userId) {
      player = 'O'
      isRejoin = true
    }
    
    // If rejoining and status is opponent_left, reactivate the game
    if (isRejoin && data.status === 'opponent_left') {
      await retryOperation(() => updateDoc(roomRef, {
        status: 'active',
        leftBy: null,
        updatedAt: serverTimestamp(),
      }))
      const updatedSnap = await getDoc(roomRef)
      if (!updatedSnap.exists()) {
        throw new RoomError('Room was deleted while rejoining.', 'ROOM_DELETED')
      }
      return updatedSnap.data() as RoomState
    }
    
    // If already in room and game is active, just return
    if (isRejoin) {
      return data
    }
    
    // Assign player to empty slot
    if (data.players.X && !data.players.O) {
      player = 'O'
    } else if (!data.players.X && !data.players.O) {
      player = 'X'
    } else if (data.players.X && data.players.O) {
      throw new RoomError('Room is full. Please join another room.', 'ROOM_FULL')
    }
    
    // If we're assigning O (second player), activate the game
    const shouldActivate = player === 'O'
    
    await retryOperation(() => updateDoc(roomRef, {
      [`players.${player}`]: userId,
      status: shouldActivate ? 'active' : data.status,
      leftBy: null, // Clear leftBy when someone joins
      updatedAt: serverTimestamp(),
    }))
    
    const updatedSnap = await getDoc(roomRef)
    if (!updatedSnap.exists()) {
      throw new RoomError('Room was deleted while joining.', 'ROOM_DELETED')
    }
    
    return updatedSnap.data() as RoomState
  } catch (error: any) {
    if (error instanceof RoomError) {
      throw error
    }
    if (error.code === 'unavailable') {
      throw new RoomError('Network unavailable. Please check your internet connection.', 'NETWORK_ERROR')
    } else if (error.code === 'deadline-exceeded') {
      throw new RoomError('Request timed out. Please try again.', 'TIMEOUT')
    } else if (error.code === 'permission-denied') {
      throw new RoomError('Permission denied. Please sign in again.', 'PERMISSION_DENIED')
    }
    throw new RoomError(error.message || 'Failed to join room. Please try again.', 'JOIN_ERROR')
  }
}

export async function updateRoom(
  roomId: string,
  updates: Omit<Partial<RoomState>, 'board'> & { board?: Board | SerializedBoard }
): Promise<void> {
  if (!roomId || typeof roomId !== 'string' || roomId.trim().length === 0) {
    throw new RoomError('Invalid room ID.', 'INVALID_ROOM_ID')
  }

  try {
    const roomRef = doc(db, 'rooms', roomId.trim())
    
    // Verify room exists before updating
    const roomSnap = await retryOperation(() => getDoc(roomRef))
    if (!roomSnap.exists()) {
      throw new RoomError('Room not found. It may have been deleted.', 'ROOM_NOT_FOUND')
    }
    
    // If board is being updated, serialize it if it's a Board type (nested arrays)
    const serializedUpdates: any = { ...updates }
    if (updates.board && 'cells' in updates.board) {
      // Check if cells is an array (Board type) or object (SerializedBoard type)
      if (Array.isArray(updates.board.cells)) {
        // If it's a Board type (with nested array), serialize it
        serializedUpdates.board = serializeBoard(updates.board as Board)
      }
      // If it's already a SerializedBoard, use it as-is
    }
    
    await retryOperation(() => updateDoc(roomRef, {
      ...serializedUpdates,
      updatedAt: serverTimestamp(),
    }))
  } catch (error: any) {
    if (error instanceof RoomError) {
      throw error
    }
    if (error.code === 'unavailable') {
      throw new RoomError('Network unavailable. Please check your internet connection.', 'NETWORK_ERROR')
    } else if (error.code === 'deadline-exceeded') {
      throw new RoomError('Request timed out. Please try again.', 'TIMEOUT')
    } else if (error.code === 'permission-denied') {
      throw new RoomError('Permission denied. Please sign in again.', 'PERMISSION_DENIED')
    } else if (error.code === 'failed-precondition') {
      throw new RoomError('Room state changed. Please refresh.', 'CONFLICT')
    }
    throw new RoomError(error.message || 'Failed to update room. Please try again.', 'UPDATE_ERROR')
  }
}

export function subscribeToRoom(
  roomId: string,
  callback: (room: RoomState | null, error?: RoomError) => void
): () => void {
  if (!roomId || typeof roomId !== 'string' || roomId.trim().length === 0) {
    callback(null, new RoomError('Invalid room ID.', 'INVALID_ROOM_ID'))
    return () => {}
  }

  const roomRef = doc(db, 'rooms', roomId.trim())
  return onSnapshot(
    roomRef,
    (snap) => {
      if (snap.exists()) {
        try {
          const data = snap.data() as RoomState
          // Validate room data before deserializing
          if (!data || !data.board || !data.players) {
            callback(null, new RoomError('Invalid room data.', 'INVALID_ROOM_DATA'))
            return
          }
          // Try to deserialize board to validate it
          try {
            deserializeBoard(data.board)
            callback(data)
          } catch (error) {
            callback(null, error instanceof RoomError ? error : new RoomError('Invalid board data.', 'INVALID_BOARD_DATA'))
          }
        } catch (error) {
          callback(null, error instanceof RoomError ? error : new RoomError('Error processing room data.', 'PROCESSING_ERROR'))
        }
      } else {
        callback(null, new RoomError('Room not found.', 'ROOM_NOT_FOUND'))
      }
    },
    (error) => {
      if (error.code === 'unavailable') {
        callback(null, new RoomError('Network unavailable. Please check your internet connection.', 'NETWORK_ERROR'))
      } else if (error.code === 'permission-denied') {
        callback(null, new RoomError('Permission denied. Please sign in again.', 'PERMISSION_DENIED'))
      } else {
        callback(null, new RoomError(error.message || 'Connection error occurred.', 'SUBSCRIPTION_ERROR'))
      }
    }
  )
}

