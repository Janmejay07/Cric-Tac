'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Board } from '@/components/Board'
import { GameHeader } from '@/components/GameHeader'
import { GameOverModal } from '@/components/GameOverModal'
import { QuestionModal } from '@/components/QuestionModal'
import { OnlineRoomPanel } from '@/components/OnlineRoomPanel'
import {
  initializeBoard,
  checkWinner,
  makeMove,
  type GameState,
} from '@/utils/gameUtils'
import { getRandomStartOptions } from '@/data/questions'
import { createRoom, joinRoom, subscribeToRoom, updateRoom, roomStateToGameState, createRoomStateFromGameState, RoomError, type RoomState } from '@/services/rooms'
import { ArrowLeft, AlertCircle, Wifi, WifiOff, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function OnlinePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [roomStatus, setRoomStatus] = useState<'waiting' | 'active' | 'finished'>('waiting')
  const [myPlayer, setMyPlayer] = useState<'X' | 'O' | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('connected')
  const [opponentDisconnected, setOpponentDisconnected] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!roomId || !user) return

    setError(null)
    setConnectionStatus('connected')
    setOpponentDisconnected(false)

    const unsubscribe = subscribeToRoom(roomId, (room: RoomState | null, error?: RoomError) => {
      if (error) {
        setError(error.message)
        setConnectionStatus('error')
        
        // Handle specific error codes
        if (error.code === 'NETWORK_ERROR' || error.code === 'SUBSCRIPTION_ERROR') {
          setConnectionStatus('disconnected')
        } else if (error.code === 'ROOM_NOT_FOUND') {
          // Room was deleted, reset state
          setTimeout(() => {
            setRoomId(null)
            setGameState(null)
            setMyPlayer(null)
            setRoomStatus('waiting')
            setShowGameOverModal(false)
            setError(null)
            setOpponentDisconnected(false)
            setConnectionStatus('connected')
            setSelectedCell(null)
            setShowQuestionModal(false)
          }, 2000)
        } else if (error.code === 'PERMISSION_DENIED') {
          // Auth issue, redirect to auth
          setTimeout(() => {
            router.push('/auth')
          }, 2000)
        }
        return
      }

      if (!room) {
        setError('Room not found. Returning to lobby...')
        setTimeout(() => {
          setRoomId(null)
          setGameState(null)
          setMyPlayer(null)
          setRoomStatus('waiting')
          setShowGameOverModal(false)
          setError(null)
          setOpponentDisconnected(false)
          setConnectionStatus('connected')
          setSelectedCell(null)
          setShowQuestionModal(false)
        }, 2000)
        return
      }

      setError(null)
      setConnectionStatus('connected')

      setRoomStatus(room.status)

      // Determine my player
      if (room.players.X === user.uid) {
        setMyPlayer('X')
      } else if (room.players.O === user.uid) {
        setMyPlayer('O')
      } else {
        // User is not in the room anymore
        setError('You are no longer in this room.')
        setTimeout(() => {
          setRoomId(null)
          setGameState(null)
          setMyPlayer(null)
          setRoomStatus('waiting')
          setShowGameOverModal(false)
          setError(null)
          setOpponentDisconnected(false)
          setConnectionStatus('connected')
          setSelectedCell(null)
          setShowQuestionModal(false)
        }, 2000)
        return
      }

      // Check if opponent disconnected (only one player in active game)
      if (room.status === 'active' && (!room.players.X || !room.players.O)) {
        setOpponentDisconnected(true)
        setError('Opponent has disconnected. Waiting for them to return...')
      } else {
        setOpponentDisconnected(false)
      }

      // Convert room state to game state (deserialize board)
      try {
        const state = roomStateToGameState(room)
        setGameState(state)

        if (room.gameOver) {
          setTimeout(() => setShowGameOverModal(true), 500)
        }
      } catch (err) {
        setError('Failed to load game state. Please refresh.')
        console.error('Error deserializing game state:', err)
      }
    })

    return unsubscribe
  }, [roomId, user, router])

  const handleCreateRoom = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { teams, countries } = getRandomStartOptions(3)
      const board = initializeBoard(teams, countries)
      const gameState: GameState = {
        board,
        currentPlayer: 'X',
        selectedTeams: teams,
        selectedCountries: countries,
        teamOrder: teams,
        countryOrder: countries,
        scores: { X: 0, O: 0 },
        gameOver: false,
        winner: null,
      }

      // Create room state with serialized board
      const initialState = createRoomStateFromGameState(
        gameState,
        { X: user.uid, O: null },
        'waiting'
      )

      const newRoomId = await createRoom(initialState)
      setRoomId(newRoomId)
      setMyPlayer('X')
      setConnectionStatus('connected')
    } catch (err: any) {
      const errorMessage = err instanceof RoomError ? err.message : 'Failed to create room. Please try again.'
      setError(errorMessage)
      if (err.code === 'PERMISSION_DENIED') {
        setTimeout(() => router.push('/auth'), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleJoinRoom = async (id: string) => {
    if (!user) return

    // Validate room ID format
    if (!id || id.trim().length === 0) {
      setError('Please enter a valid room ID.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const room = await joinRoom(id.trim(), user.uid)
      setRoomId(id.trim())
      setRoomStatus(room.status)
      setConnectionStatus('connected')
    } catch (err: any) {
      const errorMessage = err instanceof RoomError ? err.message : 'Failed to join room. Please try again.'
      setError(errorMessage)
      
      // Handle specific error codes
      if (err.code === 'PERMISSION_DENIED') {
        setTimeout(() => router.push('/auth'), 2000)
      } else if (err.code === 'ALREADY_IN_ROOM') {
        // User is already in the room, set the room ID
        setRoomId(id.trim())
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (!gameState || !myPlayer || roomStatus !== 'active') {
      setError('Game is not active. Please wait for your opponent.')
      return
    }
    
    if (connectionStatus !== 'connected') {
      setError('Connection lost. Please wait for reconnection.')
      return
    }
    
    if (opponentDisconnected) {
      setError('Opponent has disconnected. Please wait for them to return.')
      return
    }

    if (gameState.currentPlayer !== myPlayer) {
      setError('It\'s not your turn. Please wait for your opponent.')
      return
    }

    if (gameState.gameOver) {
      setError('Game is over.')
      return
    }

    if (row < 0 || row >= gameState.board.cells.length || col < 0 || col >= gameState.board.cells[0].length) {
      setError('Invalid cell selection.')
      return
    }

    const cell = gameState.board.cells[row][col]
    if (!cell.isLocked || cell.value) {
      setError('This cell is already taken or not available.')
      return
    }

    setError(null)
    setSelectedCell({ row, col })
    setShowQuestionModal(true)
  }

  const handleAnswer = async (playerName: string, isCorrect: boolean) => {
    if (!gameState || !selectedCell || !roomId || !myPlayer) {
      setError('Invalid game state. Please refresh.')
      return
    }

    // Validate it's still the player's turn (prevent race conditions)
    if (gameState.currentPlayer !== myPlayer) {
      setError('It\'s no longer your turn.')
      setShowQuestionModal(false)
      setSelectedCell(null)
      return
    }

    // Validate the cell is still available
    const { row, col } = selectedCell
    if (row < 0 || row >= gameState.board.cells.length || col < 0 || col >= gameState.board.cells[0].length) {
      setError('Invalid cell selection.')
      setShowQuestionModal(false)
      setSelectedCell(null)
      return
    }

    const cell = gameState.board.cells[row][col]
    if (cell.value) {
      setError('This cell has already been taken.')
      setShowQuestionModal(false)
      setSelectedCell(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isCorrect) {
        // Correct answer - mark the cell and then switch turn
        const newBoard = makeMove(gameState.board, row, col, myPlayer, playerName)
        const winner = checkWinner(newBoard)

        const newScores = { ...gameState.scores }
        if (winner && winner !== 'draw') {
          newScores[winner]++
        }

        const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'

        const updates: Parameters<typeof updateRoom>[1] = {
          board: newBoard,
          currentPlayer: nextPlayer,
          scores: newScores,
          gameOver: winner !== null,
          winner,
          status: winner !== null ? 'finished' : 'active',
        }

        await updateRoom(roomId, updates)
      } else {
        // Incorrect answer - just switch turn without marking the cell
        const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'
        
        const updates: Partial<RoomState> = {
          currentPlayer: nextPlayer,
        }

        await updateRoom(roomId, updates)
      }

      setShowQuestionModal(false)
      setSelectedCell(null)
    } catch (err: any) {
      const errorMessage = err instanceof RoomError ? err.message : 'Failed to update game. Please try again.'
      setError(errorMessage)
      
      // Handle specific error codes
      if (err.code === 'ROOM_NOT_FOUND' || err.code === 'CONFLICT') {
        setError('Game state changed. Please wait for the update...')
      } else if (err.code === 'PERMISSION_DENIED') {
        setTimeout(() => router.push('/auth'), 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCloseQuestion = () => {
    setShowQuestionModal(false)
    setSelectedCell(null)
  }

  const handleNewGame = () => {
    setRoomId(null)
    setGameState(null)
    setMyPlayer(null)
    setRoomStatus('waiting')
    setShowGameOverModal(false)
    setError(null)
    setOpponentDisconnected(false)
    setConnectionStatus('connected')
    setSelectedCell(null)
    setShowQuestionModal(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl font-black">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const selectedCellData = selectedCell && gameState
    ? gameState.board.cells[selectedCell.row][selectedCell.col]
    : null

  const isMyTurn = gameState && myPlayer && gameState.currentPlayer === myPlayer && roomStatus === 'active'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 border-b border-white/10 backdrop-blur-lg bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <span className="text-xl font-bold text-white">Cric-Tac</span>
            </Link>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto relative z-10 px-3 sm:px-4 md:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8 pb-12 sm:pb-16 md:pb-24">
        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-xl border border-red-500/30 p-3 sm:p-4 md:p-5 flex items-start gap-3 sm:gap-4">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-red-300 font-semibold text-sm sm:text-base md:text-lg leading-relaxed">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              aria-label="Dismiss error"
            >
              <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        )}

        {/* Connection Status Indicator */}
        {roomId && (
          <div className={`mb-4 sm:mb-6 rounded-xl sm:rounded-2xl backdrop-blur-xl border p-2 sm:p-3 flex items-center gap-2 sm:gap-3 ${
            connectionStatus === 'connected'
              ? 'bg-emerald-500/20 border-emerald-500/30'
              : connectionStatus === 'disconnected'
              ? 'bg-orange-500/20 border-orange-500/30'
              : 'bg-red-500/20 border-red-500/30'
          }`}>
            {connectionStatus === 'connected' ? (
              <>
                <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold text-xs sm:text-sm">Connected</span>
              </>
            ) : connectionStatus === 'disconnected' ? (
              <>
                <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400 animate-pulse" />
                <span className="text-orange-300 font-semibold text-xs sm:text-sm">Reconnecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 animate-pulse" />
                <span className="text-red-300 font-semibold text-xs sm:text-sm">Connection Error</span>
              </>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-500/30 p-3 sm:p-4 md:p-5 flex items-center justify-center gap-3 sm:gap-4">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 animate-spin" />
            <span className="text-blue-300 font-semibold text-sm sm:text-base md:text-lg">Processing...</span>
          </div>
        )}

        {!roomId || !gameState ? (
          <OnlineRoomPanel
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
          />
        ) : (
          <>
            {roomStatus === 'waiting' && (
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-4 sm:p-5 md:p-6 text-center text-white">
                <p className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 text-emerald-400 leading-tight">Waiting for another player to join...</p>
                <OnlineRoomPanel
                  onCreateRoom={handleCreateRoom}
                  onJoinRoom={handleJoinRoom}
                  roomId={roomId}
                  status={roomStatus}
                />
              </div>
            )}

            {roomStatus === 'active' && gameState && (
              <>
                <GameHeader
                  currentPlayer={gameState.currentPlayer}
                  selectedTeams={gameState.selectedTeams}
                  selectedCountries={gameState.selectedCountries}
                  scores={gameState.scores}
                  isOnline={true}
                  roomId={roomId}
                />

                {/* Opponent Disconnect Warning */}
                {opponentDisconnected && (
                  <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-orange-500/30 p-3 sm:p-4 md:p-5 text-center text-white">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                      <WifiOff className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 animate-pulse" />
                      <p className="font-bold text-sm sm:text-base md:text-lg text-orange-300">Opponent Disconnected</p>
                    </div>
                    <p className="text-xs sm:text-sm text-orange-200">Waiting for opponent to reconnect...</p>
                  </div>
                )}

                {!isMyTurn && !opponentDisconnected && (
                  <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-3 sm:p-4 md:p-5 text-center text-white font-semibold text-sm sm:text-base md:text-lg">
                    Waiting for opponent&apos;s turn...
                  </div>
                )}

                <div className="mt-4 sm:mt-6 flex justify-center">
                  <Board
                    board={gameState.board}
                    onCellClick={handleCellClick}
                    currentPlayer={gameState.currentPlayer}
                    teamOrder={gameState.teamOrder}
                    countryOrder={gameState.countryOrder}
                  />
                </div>

                <div className="mt-4 sm:mt-6 md:mt-8 max-w-full sm:max-w-2xl mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-50 backdrop-blur-xl border border-emerald-200 p-4 sm:p-5 md:p-6 shadow-xl min-h-[140px] sm:min-h-[180px] md:min-h-[200px] flex flex-col">
                  <div className="flex justify-center items-center flex-1">
                    <button
                      onClick={handleNewGame}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white font-bold text-sm sm:text-base md:text-lg shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Leave Room
                    </button>
                  </div>
                </div>
              </>
            )}

            {selectedCellData && gameState && (
              <QuestionModal
                open={showQuestionModal}
                country={selectedCellData.country}
                team={selectedCellData.team}
                currentPlayer={gameState.currentPlayer}
                onAnswer={handleAnswer}
                onClose={handleCloseQuestion}
              />
            )}

            {gameState && (
              <GameOverModal
                open={showGameOverModal}
                winner={gameState.winner}
                scores={gameState.scores}
                onNewGame={handleNewGame}
                onClose={() => setShowGameOverModal(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

