'use client'

import { X, Circle, User, Zap, Flame, Award, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameHeaderProps {
  currentPlayer: 'X' | 'O'
  selectedTeams: string[]
  selectedCountries: string[]
  scores: { X: number; O: number }
  isOnline?: boolean
  roomId?: string
  turnTimer?: number
  gameOver?: boolean
}

export function GameHeader({
  currentPlayer,
  selectedTeams,
  selectedCountries,
  scores,
  isOnline = false,
  roomId,
  turnTimer,
  gameOver = false,
}: GameHeaderProps) {
  return (
    <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-blue-50 to-emerald-50 backdrop-blur-xl border border-emerald-200 mb-2 sm:mb-3 md:mb-4 relative overflow-hidden shadow-lg sm:shadow-xl w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto flex flex-col">
      {/* Animated background accents */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-emerald-300/30 to-transparent rounded-full blur-2xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-tr from-blue-300/30 to-transparent rounded-full blur-2xl -z-0"></div>

      <div className="relative z-10 space-y-2 sm:space-y-3 md:space-y-4 flex-1 flex flex-col justify-center p-2 sm:p-3 md:p-4">
        {/* Title */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
          <div className="p-1 sm:p-1.5 rounded-md bg-gradient-to-br from-emerald-500 to-blue-600 shadow-md flex-shrink-0">
            <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
          </div>
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 leading-tight text-center">
            IPL <span className="text-emerald-700">×</span> Country Quiz Tic Tac Toe
          </h2>
        </div>

        {/* Current Player and Score Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2 md:gap-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-emerald-200/50">
          {/* Current Player */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial">
            <div className="p-1 sm:p-1.5 rounded-md bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300 flex-shrink-0">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-emerald-700 block leading-tight">Current Player</span>
              <span className="text-[9px] sm:text-[10px] md:text-xs text-emerald-600 leading-tight">Make your move</span>
            </div>
            {turnTimer !== undefined && !gameOver && (
              <div className={cn(
                'flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm md:text-base',
                turnTimer <= 5
                  ? 'bg-red-100 border-2 border-red-400 text-red-700'
                  : turnTimer <= 10
                  ? 'bg-orange-100 border-2 border-orange-400 text-orange-700'
                  : 'bg-emerald-100 border-2 border-emerald-400 text-emerald-700'
              )}>
                <Clock className={cn(
                  'h-3 w-3 sm:h-4 sm:w-4',
                  turnTimer <= 5 && 'animate-pulse'
                )} />
                <span>{turnTimer}s</span>
              </div>
            )}
            <div
              className={cn(
                'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                currentPlayer === 'X'
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/50 border border-green-400 focus:ring-green-500'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/50 border border-blue-400 focus:ring-blue-500'
              )}
            >
              {currentPlayer === 'X' ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 animate-bounce" strokeWidth={3} />
              ) : (
                <Circle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 animate-bounce" strokeWidth={3} />
              )}
            </div>
          </div>

          {/* Scores */}
          <div className="flex items-center gap-2 sm:gap-2 md:gap-3 flex-shrink-0">
            <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 rounded-lg bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-400 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-green-700 leading-tight">Player X</span>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-green-700 leading-none">{scores.X}</div>
            </div>
            <div className="p-1 sm:p-1.5 rounded-md bg-gradient-to-r from-emerald-400 to-blue-500 flex-shrink-0">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white animate-pulse" />
            </div>
            <div className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-1 mb-0.5 sm:mb-1">
                <Award className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-blue-700 leading-tight">Player O</span>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-blue-700 leading-none">{scores.O}</div>
            </div>
          </div>
        </div>

        {isOnline && roomId && (
          <div className="rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 backdrop-blur-sm p-2 sm:p-3 md:p-4 text-center shadow-md">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base font-bold text-blue-700">Room ID</span>
            </div>
            <code className="text-xs sm:text-sm md:text-base lg:text-lg font-mono text-blue-600 font-bold bg-white/50 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg inline-block break-all">{roomId}</code>
          </div>
        )}
      </div>
    </div>
  )
}