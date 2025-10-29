import { RotateCcw, Info, Sparkles } from 'lucide-react'

interface GameFooterProps {
  onReset: () => void
}

export default function GameFooter({ onReset }: GameFooterProps) {
  return (
    <div className="mt-6 rounded-3xl bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 backdrop-blur-xl shadow-2xl p-6 text-sm border-2 border-emerald-400/40 animate-slideUp relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-cyan-400/20 animate-gradient pointer-events-none" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
        <button
          className="inline-flex items-center gap-2 justify-center rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-black px-8 py-4 text-lg shadow-2xl hover:shadow-orange-500/60 hover:scale-110 hover:rotate-3 active:scale-95 transition-all duration-500 border-2 border-orange-300/50 animate-pulse-glow"
          onClick={onReset}
        >
          <RotateCcw className="w-5 h-5 animate-wiggle" />
          Reset Game
          <Sparkles className="w-4 h-4 animate-sparkle" />
        </button>

        <div className="flex items-center gap-3 text-white">
          <Info className="w-6 h-6 text-cyan-300 animate-bounce" />
          <p className="font-bold text-base">Click a cell to answer a cricket quiz question!</p>
        </div>
      </div>
    </div>
  )
}
