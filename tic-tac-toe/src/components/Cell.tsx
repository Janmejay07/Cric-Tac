'use client'

import { BoardCell, GameMode } from '@/utils/gameUtils'
import { Lock, X, Circle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { countryNames, countryPrefixes, teamNames } from '@/data/mappings'

interface CellProps {
  cell: BoardCell
  row: number
  col: number
  onClick: () => void
  currentPlayer: 'X' | 'O'
  teamOrder: string[]
  countryOrder: string[]
  gameMode?: GameMode
}

export function Cell({ cell, onClick, currentPlayer, teamOrder, countryOrder, gameMode = 'country-x-ipl' }: CellProps) {
  const isClickable = cell.isLocked && !cell.value
  const isIPLxIPL = gameMode === 'ipl-x-ipl'
  const isBoth = false
  
  // Determine display based on game mode
  let displayTop = ''
  let displayBottom = ''
  
  if (isIPLxIPL) {
    // For IPL x IPL: both are teams
    const rowTeamName = teamNames[cell.country] || cell.country
    const colTeamName = teamNames[cell.team] || cell.team
    displayTop = `${rowTeamName}`
    displayBottom = `× ${colTeamName}`
  } else {
    // For country-x-ipl: row is country, col is team
    const countryName = countryNames[cell.country] || cell.country
    const teamName = teamNames[cell.team] || cell.team
    displayTop = countryName
    displayBottom = teamName
  }

  return (
    <button
      onClick={onClick}
      disabled={!isClickable}
      aria-label={cell.isLocked && !cell.value ? `Select ${displayTop} and ${displayBottom}` : cell.value ? `Cell occupied by ${cell.value}` : 'Cell locked'}
      className={cn(
        'rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300 ease-out',
        'p-1 sm:p-1.5 md:p-2 text-center min-h-[70px] sm:min-h-[80px] md:min-h-[95px] lg:min-h-[110px] flex items-center justify-center',
        'relative overflow-hidden group font-semibold',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        // Empty cell (default - clickable)
        !cell.value && cell.isLocked && [
          'bg-gradient-to-br from-white to-gray-50 border-emerald-300 text-emerald-900',
          'hover:border-emerald-500 hover:bg-emerald-50 active:bg-emerald-100',
          'hover:shadow-lg hover:shadow-emerald-200/50',
          'hover:scale-[1.02] active:scale-[0.98]',
          'shadow-md focus:ring-emerald-500',
        ],
        // Player X (filled)
        cell.value === 'X' && [
          'bg-gradient-to-br from-green-50 to-green-100',
          'border-green-300 text-green-900 shadow-xl sm:shadow-2xl shadow-green-200/50',
          'animate-popIn focus:ring-green-500',
        ],
        // Player O (filled)
        cell.value === 'O' && [
          'bg-gradient-to-br from-blue-50 to-blue-100',
          'border-blue-300 text-blue-900 shadow-xl sm:shadow-2xl shadow-blue-200/50',
          'animate-popIn focus:ring-blue-500',
        ],
        // Wrong answer / Not locked
        !cell.isLocked && [
          'bg-gradient-to-br from-red-100 to-red-50 border-red-400 text-red-600 cursor-not-allowed opacity-60',
          'shadow-md focus:ring-red-500',
        ],
        // Disabled state
        !isClickable && cell.isLocked && 'cursor-default opacity-75'
      )}
    >
      {/* Sparkle effect for clickable cells */}
      {isClickable && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <Sparkles className="absolute top-1 right-1 sm:top-2 sm:right-2 h-3 w-3 sm:h-4 sm:w-4 text-emerald-400 animate-pulse" />
        </div>
      )}

      {cell.isLocked && !cell.value && (
        <div className="flex h-full flex-col items-center justify-center gap-1 sm:gap-1.5 md:gap-2 relative z-10 w-full px-1 group-hover:scale-105 transition-transform duration-300">
          {/* Top display (Country or Team) */}
          <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-emerald-700 font-bold text-center leading-tight whitespace-nowrap">
            {displayTop}
          </div>
          {/* Bottom display (Team) */}
          <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-emerald-600 font-semibold text-center leading-tight">
            {displayBottom}
          </div>
        </div>
      )}

      {cell.value && (
        <div className="flex h-full flex-col items-center justify-center gap-1 sm:gap-1.5 md:gap-2 relative z-10 w-full px-1">
          <div className="relative">
            {cell.value === 'X' ? (
              <X
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 text-green-700 drop-shadow-2xl animate-popIn"
                strokeWidth={3}
              />
            ) : (
              <Circle
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 text-blue-700 drop-shadow-2xl animate-popIn"
                strokeWidth={2.5}
              />
            )}
            <div className="absolute inset-0 bg-white/10 rounded-lg blur-sm -z-10"></div>
          </div>
          {cell.player && (
            <p className={cn(
              "text-[9px] sm:text-[10px] md:text-xs text-center truncate w-full font-bold drop-shadow-lg leading-tight px-0.5",
              cell.value === 'X' ? "text-green-900" : "text-blue-900"
            )}>
              {cell.player}
            </p>
          )}
          {isIPLxIPL && (
            <div className="text-[8px] sm:text-[9px] md:text-[10px] text-emerald-700 font-semibold text-center leading-tight">
              {(teamNames[cell.country] || cell.country)} × {(teamNames[cell.team] || cell.team)}
            </div>
          )}
        </div>
      )}

      {/* Locked indicator */}
      {!cell.isLocked && (
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 z-20">
          <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 text-red-600" />
        </div>
      )}
    </button>
  )
}
