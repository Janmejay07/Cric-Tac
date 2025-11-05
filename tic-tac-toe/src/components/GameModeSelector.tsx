'use client'

import { useState } from 'react'
import type { GameMode } from '@/utils/gameUtils'
import { Globe, Users, Shuffle } from 'lucide-react'

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void
  currentMode?: GameMode
}

export function GameModeSelector({ onSelectMode, currentMode }: GameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>(currentMode || 'country-x-ipl')

  const modes: { value: GameMode; label: string; description: string; icon: typeof Globe }[] = [
    {
      value: 'country-x-ipl',
      label: 'Country × IPL',
      description: 'Rows: Countries, Columns: IPL Teams',
      icon: Globe,
    },
    {
      value: 'ipl-x-ipl',
      label: 'IPL × IPL',
      description: 'Rows: IPL Teams, Columns: IPL Teams',
      icon: Users,
    },
  ]

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode)
    onSelectMode(mode)
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 sm:mb-6">
      <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-6 shadow-2xl">
        <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center">
          Select Game Mode
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 justify-items-center">
          {modes.map((mode) => {
            const Icon = mode.icon
            const isSelected = selectedMode === mode.value
            return (
              <button
                key={mode.value}
                onClick={() => handleModeSelect(mode.value)}
                className={`
                  relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 w-full max-w-[360px]
                  flex flex-col items-center gap-2 sm:gap-3
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-emerald-400 shadow-lg shadow-emerald-500/30 scale-105'
                      : 'bg-slate-800/50 border-slate-600 hover:border-emerald-500/50 hover:bg-slate-800/70'
                  }
                `}
              >
                <Icon
                  className={`w-6 h-6 sm:w-8 sm:h-8 ${
                    isSelected ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <div className="text-center">
                  <div
                    className={`font-bold text-sm sm:text-base mb-1 ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {mode.label}
                  </div>
                  <div
                    className={`text-xs sm:text-sm ${
                      isSelected ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  >
                    {mode.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-400 rounded-full"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

