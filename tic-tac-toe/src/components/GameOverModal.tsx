'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { X, Circle, Trophy, Sparkles } from 'lucide-react'

interface GameOverModalProps {
  open: boolean
  winner: 'X' | 'O' | 'draw' | null
  scores: { X: number; O: number }
  onNewGame: () => void
  onClose: () => void
}

export function GameOverModal({ open, winner, scores, onNewGame, onClose }: GameOverModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 text-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 w-[calc(100vw-2rem)] sm:w-full max-w-lg text-center border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-500 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <Trophy className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-orange-400 flex-shrink-0" />
            <span className="leading-tight">Game Over!</span>
          </DialogTitle>

          {/* FIX: Use asChild to render a <div> instead of <p> */}
          <DialogDescription asChild>
            <div className="text-white text-base sm:text-lg md:text-xl font-bold mt-2 sm:mt-3">
              {winner === 'draw' ? (
                <span className="text-xl sm:text-2xl md:text-3xl leading-tight">It&apos;s a draw! 🎉</span>
              ) : (
                <div className="flex items-center justify-center gap-2 sm:gap-3 mt-2 flex-wrap">
                  {winner === 'X' ? (
                    <X className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white drop-shadow-2xl flex-shrink-0" strokeWidth={3} />
                  ) : (
                    <Circle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white drop-shadow-2xl flex-shrink-0" strokeWidth={3} />
                  )}
                  <span className="text-xl sm:text-2xl md:text-3xl font-black leading-tight">
                    Player {winner} wins! 🎊
                  </span>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 md:space-y-6 mt-4 sm:mt-5 md:mt-6 relative z-10">
          <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-slate-700/50 backdrop-blur-sm p-4 sm:p-5 md:p-6">
            <div className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-emerald-400">Final Score</div>
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-8">
              <div className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 rounded-lg sm:rounded-xl bg-slate-800/50 border border-green-500/30 shadow-md">
                <div className="text-xs sm:text-sm md:text-base font-semibold mb-1 text-green-400">Player X</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none">{scores.X}</div>
              </div>
              <div className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-4 rounded-lg sm:rounded-xl bg-slate-800/50 border border-blue-500/30 shadow-md">
                <div className="text-xs sm:text-sm md:text-base font-semibold mb-1 text-blue-400">Player O</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-none">{scores.O}</div>
              </div>
            </div>
          </div>

          <button
            onClick={onNewGame}
            className="inline-flex items-center gap-2 sm:gap-3 justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 active:scale-95 transition-all duration-300 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Play Again</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
