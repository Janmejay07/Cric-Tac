import { Trophy, User, Sparkles, Zap } from 'lucide-react'

interface GameHeaderProps {
  currentPlayer: string
  scores: { X: number; O: number }
}

export default function GameHeader({ currentPlayer, scores }: GameHeaderProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-orange-500/30 via-pink-500/30 to-purple-500/30 backdrop-blur-xl shadow-2xl p-6 mb-6 border-2 border-orange-400/40 animate-slideDown relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-pink-400/20 to-purple-400/20 animate-gradient pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-10 h-10 text-yellow-300 animate-float drop-shadow-xl" />
          <Sparkles className="w-6 h-6 text-pink-300 animate-sparkle" />
          <h1 className="text-2xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl animate-gradient" style={{ backgroundSize: '200% 200%' }}>
            IPL × Country Quiz Tic Tac Toe
          </h1>
          <Zap className="w-6 h-6 text-yellow-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm md:text-base">
          <div className="flex items-center gap-3 font-bold">
            <User className="w-6 h-6 text-cyan-300 animate-bounce" />
            <span className="text-white text-lg">Current Player:</span>
            <span
              className={`px-5 py-3 rounded-2xl font-black text-2xl shadow-2xl transform transition-all duration-500 hover:scale-125 hover:rotate-6 animate-pulse-glow ${
                currentPlayer === 'X'
                  ? 'bg-gradient-to-br from-red-500 via-pink-500 to-fuchsia-500 text-white shadow-red-500/60 border-2 border-red-300'
                  : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 text-white shadow-cyan-500/60 border-2 border-cyan-300'
              }`}
            >
              {currentPlayer}
            </span>
          </div>

          <div className="flex items-center gap-5 font-black text-xl">
            <span className="px-5 py-3 rounded-2xl bg-gradient-to-br from-red-500/40 via-pink-500/40 to-fuchsia-500/40 text-white border-2 border-red-300/50 shadow-xl shadow-red-500/40 transform hover:scale-125 hover:-rotate-6 transition-all duration-500">
              X: {scores.X}
            </span>
            <span className="text-white text-2xl">⚡</span>
            <span className="px-5 py-3 rounded-2xl bg-gradient-to-br from-blue-500/40 via-cyan-500/40 to-teal-500/40 text-white border-2 border-cyan-300/50 shadow-xl shadow-cyan-500/40 transform hover:scale-125 hover:rotate-6 transition-all duration-500">
              O: {scores.O}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
