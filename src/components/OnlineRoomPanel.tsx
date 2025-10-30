import { useEffect, useState } from 'react'
import { createRoom, joinRoom, subscribeRoom, updateRoom, RoomState } from '../services/rooms'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

type Props = {
  onReady: (roomId: string, myMark: 'X' | 'O') => void
  buildInitialState: () => RoomState
}

export default function OnlineRoomPanel({ onReady, buildInitialState }: Props) {
  const { user } = useAuth()
  const [roomId, setRoomId] = useState('')
  const [status, setStatus] = useState<'idle' | 'creating' | 'joining' | 'waiting' | 'active'>('idle')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    return () => {}
  }, [])

  const handleCreate = async () => {
    if (!user) { setError('Sign in or continue as guest first.'); return }
    setError('')
    setStatus('creating')
    try {
      const init = buildInitialState()
      const id = await createRoom({ ...init, players: { X: user.uid }, status: 'waiting' })
    setRoomId(id)
    setStatus('waiting')
    const unsub = subscribeRoom(id, (state) => {
      if (state.status === 'active' && state.players.X && state.players.O) {
        onReady(id, 'X')
        unsub()
      }
    })
    } catch (e: any) {
      setStatus('idle')
      setError(e?.message || 'Failed to create room. Check Firestore config and rules.')
    }
  }

  const handleJoin = async () => {
    if (!roomId) { setError('Enter a Room ID'); return }
    if (!user) { setError('Sign in or continue as guest first.'); return }
    setError('')
    setStatus('joining')
    try {
      const mark = await joinRoom(roomId, user.uid)
      if (!mark) { setError('Room not found'); setStatus('idle'); return }
      setStatus('active')
      onReady(roomId, mark)
    } catch (e: any) {
      setStatus('idle')
      setError(e?.message || 'Failed to join room. Check Firestore config and rules.')
    }
  }

  return (
    <div className="rounded-xl border-2 border-white/20 bg-white/10 text-white p-4 mb-4">
      <div className="flex flex-col gap-3">
        <div className="font-black">Play Online with a Friend</div>
        {!user && (
          <div className="text-sm text-white/80">
            Sign in or continue as guest to play online.
            <button className="ml-2 underline font-bold" onClick={() => navigate('/auth?mode=login')}>Log in</button>
          </div>
        )}
        <div className="flex gap-2 flex-wrap items-center">
          <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold" onClick={handleCreate} disabled={status==='creating' || status==='waiting'}>Create Room</button>
          <span className="opacity-80">or</span>
          <input className="px-3 py-2 rounded-lg bg-white/10 border-2 border-white/20" placeholder="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value.trim())} />
          <button className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold" onClick={handleJoin} disabled={!roomId || status==='joining'}>Join</button>
        </div>
        {status==='waiting' && (
          <div className="text-sm">Share Room ID: <span className="font-mono font-bold">{roomId}</span>. Waiting for your friend to join…</div>
        )}
        {error && <div className="text-red-300 text-sm font-bold">{error}</div>}
      </div>
    </div>
  )
}


