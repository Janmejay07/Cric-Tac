import React from 'react'
import { Play, Users, Monitor, Zap, Sparkles, Trophy } from 'lucide-react'
import ModeSelector from './ModeSelector'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { user, logout, continueAsGuest } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-fuchsia-900 to-pink-900 py-10 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" style={{ backgroundSize: '200% 200%' }} />

      <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 right-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-slideDown">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-300 animate-bounce drop-shadow-xl" />
            <Sparkles className="w-8 h-8 text-pink-300 animate-sparkle" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl mb-4 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
            Cric‑Tac
          </h1>

          <p className="text-xl sm:text-2xl text-white font-bold mb-2 drop-shadow-lg">
            Cricket Quiz Tic Tac Toe
          </p>

          <p className="text-white/80 font-semibold text-base sm:text-lg mb-8 drop-shadow-lg">
            Test your cricket knowledge while playing the ultimate game!
          </p>
        </div>

        <div className="mb-12 animate-slideUp">
        <div className="flex flex-col gap-3 items-center mb-6">
          {user ? (
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 font-bold">
                {user.displayName || user.email || 'Player'}
              </div>
              <button className="px-4 py-2 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-white/20 font-bold" onClick={() => logout()}>Logout</button>
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap justify-center">
              <button className="px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-white/20 font-bold" onClick={() => navigate('/auth?mode=login')}>Log in</button>
              <button className="px-6 py-3 rounded-xl bg-white/10 border-2 border-white/20 hover:bg-white/20 font-bold" onClick={() => navigate('/auth?mode=signup')}>Sign up</button>
              <button className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold" onClick={() => continueAsGuest()}>Continue as Guest</button>
            </div>
          )}
        </div>
        <ModeSelector onSelect={(m) => navigate(m === 'offline' ? '/offline' : '/online')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-500/30 to-teal-500/30 border-2 border-cyan-400/40 p-6 backdrop-blur-sm hover:scale-105 transform transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/40 animate-slideDown" style={{ animationDelay: '0.2s' }}>
            <Play className="w-8 h-8 text-cyan-300 mb-3 animate-float" />
            <h3 className="text-xl font-black text-white mb-2">Quick Gameplay</h3>
            <p className="text-white/80 text-sm font-semibold">Answer quiz questions to claim cells and win the game!</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border-2 border-orange-400/40 p-6 backdrop-blur-sm hover:scale-105 transform transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/40 animate-slideDown" style={{ animationDelay: '0.4s' }}>
            <Zap className="w-8 h-8 text-yellow-300 mb-3 animate-sparkle" />
            <h3 className="text-xl font-black text-white mb-2">Instant Challenge</h3>
            <p className="text-white/80 text-sm font-semibold">Get rewarded for correct answers instantly!</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-pink-500/30 to-fuchsia-500/30 border-2 border-pink-400/40 p-6 backdrop-blur-sm hover:scale-105 transform transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/40 animate-slideDown" style={{ animationDelay: '0.6s' }}>
            <Users className="w-8 h-8 text-pink-300 mb-3 animate-bounce" />
            <h3 className="text-xl font-black text-white mb-2">Multiplayer Fun</h3>
            <p className="text-white/80 text-sm font-semibold">Play with friends locally or online!</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-3xl border-2 border-cyan-400/40 p-8 backdrop-blur-sm text-center animate-slideUp" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Monitor className="w-5 h-5 text-cyan-300 animate-pulse" />
            <span className="text-white/80 font-bold">Two Game Modes</span>
          </div>
          <p className="text-white text-sm sm:text-base font-semibold leading-relaxed">
            <span className="text-cyan-300 font-black">Offline:</span> Play on one device with instant local multiplayer
            <br />
            <span className="text-orange-300 font-black">Online:</span> Invite friends with a Room ID and play together in real-time
          </p>
        </div>
      </div>
    </div>
  )
}
