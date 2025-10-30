import { db } from './firebase'
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

export type RoomState = {
  board: Record<string, Record<string, string | null>>
  selectedTeams: Record<string, string>
  selectedCountries: Record<string, string>
  teamOrder: string[]
  countryOrder: string[]
  currentPlayer: 'X' | 'O'
  scores: { X: number; O: number }
  gameOver: boolean
  winner: string | null
  players: { X?: string; O?: string }
  status: 'waiting' | 'active' | 'finished'
  updatedAt?: any
}

export async function createRoom(initial: RoomState) {
  try {
    const ref = await addDoc(collection(db, 'rooms'), {
      ...initial,
      updatedAt: serverTimestamp(),
    })
    return ref.id
  } catch (e: any) {
    console.error('createRoom error', e)
    throw e
  }
}

export async function joinRoom(roomId: string, uid: string): Promise<'X' | 'O' | null> {
  try {
    const ref = doc(db, 'rooms', roomId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const data = snap.data() as RoomState
    const players = { ...data.players }
    let mark: 'X' | 'O' | null = null
    if (!players.X) { players.X = uid; mark = 'X' }
    else if (!players.O) { players.O = uid; mark = 'O' }
    await updateDoc(ref, { players, status: players.X && players.O ? 'active' : 'waiting', updatedAt: serverTimestamp() })
    return mark
  } catch (e: any) {
    console.error('joinRoom error', e)
    throw e
  }
}

export function subscribeRoom(roomId: string, cb: (state: RoomState) => void) {
  const ref = doc(db, 'rooms', roomId)
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) cb(snap.data() as RoomState)
  })
}

export async function updateRoom(roomId: string, partial: Partial<RoomState>) {
  try {
    const ref = doc(db, 'rooms', roomId)
    await updateDoc(ref, { ...partial, updatedAt: serverTimestamp() })
  } catch (e: any) {
    console.error('updateRoom error', e)
    throw e
  }
}


