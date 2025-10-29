import { Trophy, Users, RotateCcw, Sparkles, Star, Zap } from 'lucide-react'

interface GameOverModalProps {
  winner: string | null
  onReset: () => void
}

export default function GameOverModal({ winner, onReset }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl grid place-items-center p-4 z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-yellow-500/30 via-orange-500/30 to-pink-500/30 text-white rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center border-4 border-yellow-300/50 transform animate-scaleIn relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-pink-400/20 animate-gradient pointer-events-none" />

        <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-300 rounded-full animate-sparkle" />
        <div className="absolute top-8 right-8 w-4 h-4 bg-pink-300 rounded-full animate-sparkle" style={{ animationDelay: '0.3s' }} />
        <div className="absolute bottom-8 left-12 w-3 h-3 bg-cyan-300 rounded-full animate-sparkle" style={{ animationDelay: '0.6s' }} />
        <div className="absolute bottom-12 right-6 w-2 h-2 bg-orange-300 rounded-full animate-sparkle" style={{ animationDelay: '0.9s' }} />

        <div className="relative z-10">
          {winner === 'draw' ? (
            <>
              <div className="mb-6 flex justify-center items-center gap-3">
                <Users className="w-24 h-24 text-yellow-300 animate-float drop-shadow-2xl" />
                <Star className="w-12 h-12 text-pink-300 animate-sparkle" />
              </div>
              <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                It's a Draw!
              </h2>
              <p className="text-white mb-8 text-xl font-bold">Both players played exceptionally well!</p>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-center items-center gap-3">
                <Trophy className="w-24 h-24 text-yellow-300 animate-float drop-shadow-2xl" />
                <Sparkles className="w-12 h-12 text-pink-300 animate-sparkle" />
                <Zap className="w-12 h-12 text-cyan-300 animate-sparkle" style={{ animationDelay: '0.5s' }} />
              </div>
              <h2 className="text-5xl font-black mb-4">
                <span className={`bg-gradient-to-r ${
                  winner === 'X'
                    ? 'from-red-300 via-pink-300 to-fuchsia-300'
                    : 'from-blue-300 via-cyan-300 to-teal-300'
                } bg-clip-text text-transparent drop-shadow-2xl animate-gradient`} style={{ backgroundSize: '200% 200%' }}>
                  Player {winner} Wins!
                </span>
              </h2>
              <p className="text-white mb-8 text-xl font-bold">Congratulations on your victory!</p>
            </>
          )}

          <button
            className="inline-flex items-center gap-3 justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-black px-10 py-5 text-xl shadow-2xl hover:shadow-orange-500/70 hover:scale-110 hover:rotate-3 active:scale-95 transition-all duration-500 border-2 border-orange-300/50 animate-pulse-glow"
            onClick={onReset}
          >
            <RotateCcw className="w-6 h-6 animate-wiggle" />
            Play Again
            <Sparkles className="w-5 h-5 animate-sparkle" />
          </button>
        </div>
      </div>
    </div>
  )
}
