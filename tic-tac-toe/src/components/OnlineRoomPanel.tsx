'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface OnlineRoomPanelProps {
  onCreateRoom: () => void
  onJoinRoom: (roomId: string) => void
  roomId?: string
  status?: 'waiting' | 'active' | 'finished'
}

export function OnlineRoomPanel({
  onCreateRoom,
  onJoinRoom,
  roomId,
  status,
}: OnlineRoomPanelProps) {
  const [joinRoomId, setJoinRoomId] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (roomId) {
    return (
      <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 text-white p-4 sm:p-5 md:p-6 mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-emerald-400">Room Created</h3>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">Share this room ID with your friend</p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-3 sm:mb-4">
          <code className="flex-1 rounded-lg sm:rounded-xl border border-white/10 bg-slate-800/50 p-2.5 sm:p-3 font-mono text-sm sm:text-base md:text-lg text-emerald-400 font-bold break-all text-center sm:text-left">
            {roomId}
          </code>
          <button
            onClick={handleCopy}
            aria-label="Copy room ID"
            className="px-4 py-2.5 sm:py-3 rounded-lg bg-slate-700/50 border border-white/10 hover:bg-slate-700 active:bg-slate-600 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {copied ? (
              <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            )}
          </button>
        </div>
        {status && (
          <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${
            status === 'active' 
              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' 
              : 'bg-slate-700/50 border border-white/10 text-slate-300'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
      <div className="group relative rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-4 sm:p-5 md:p-6 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-white">Create Room</h3>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">Start a new game room</p>
        <button
          onClick={onCreateRoom}
          className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 font-bold text-sm sm:text-base text-white shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Create Room
        </button>
      </div>

      <div className="group relative rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-4 sm:p-5 md:p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-white">Join Room</h3>
        <p className="text-slate-400 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">Enter a room ID to join</p>
        <div className="space-y-2 sm:space-y-3">
          <input
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            placeholder="Enter room ID..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && joinRoomId.trim()) {
                onJoinRoom(joinRoomId.trim())
              }
            }}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
          />
          <button
            onClick={() => onJoinRoom(joinRoomId.trim())}
            disabled={!joinRoomId.trim()}
            className="w-full px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 font-bold text-sm sm:text-base text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  )
}

