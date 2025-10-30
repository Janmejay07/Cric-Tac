import React from 'react'
import Cell from './Cell'

interface BoardProps {
  board: Record<string, Record<string, string | null>>
  onCellClick: (country: string, team: string) => void
  selectedCell: { country: string; team: string } | null
  teams: Record<string, string>
  countries: Record<string, string>
  teamOrder?: string[]
  countryOrder?: string[]
  wrongCell?: { country: string; team: string } | null
}

export default function Board({ board, onCellClick, selectedCell, teams, countries, teamOrder = Object.keys(teams), countryOrder = Object.keys(countries), wrongCell }: BoardProps) {
  const tOrder = teamOrder.slice(0, 3)
  const cOrder = countryOrder.slice(0, 3)
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 backdrop-blur-xl shadow-2xl p-4 sm:p-6 border-2 border-cyan-400/30 animate-fadeIn relative overflow-hidden max-w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/10 to-blue-400/10 animate-gradient pointer-events-none" />
      <div className="relative z-10">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
          {/* Corner label */}
          <div className="rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-500/30 via-teal-500/30 to-emerald-500/30 p-2 sm:p-4 text-center text-white min-h-[40px] sm:min-h-[80px] flex items-center justify-center font-bold tracking-wide">
            Country × Team
          </div>
          {/* Team headers */}
          {tOrder.map((abbr, idx) => (
            <div
              key={abbr}
              className="rounded-2xl border-2 border-orange-400/40 bg-gradient-to-br from-orange-500/30 via-amber-500/30 to-yellow-500/30 p-2 sm:p-4 text-center text-white font-black text-base sm:text-xl drop-shadow-md break-words"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {abbr}
              <div className="text-[10px] sm:text-xs font-semibold mt-1 opacity-90 break-words max-w-[68px] mx-auto">{teams[abbr]}</div>
            </div>
          ))}
          {/* Table rows (country headers + cells) */}
          {cOrder.map((country, rowIndex) => [
            // Row header
            <div
              key={country + '-header'}
              className="rounded-2xl border-2 border-pink-400/40 bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-red-500/20 p-2 sm:p-4 text-center text-white font-bold text-xs sm:text-lg flex items-center justify-center min-h-[40px] sm:min-h-[80px]">
              {country}
              <div className="block font-bold text-[10px] sm:text-xs opacity-80 ml-1">{countries[country]}</div>
            </div>,
            // Row cells
            ...tOrder.map((team, colIndex) => {
              const cellIsWrong = wrongCell && wrongCell.country === country && wrongCell.team === team
              return (
                <Cell
                  key={`${country}-${team}`}
                  value={board[country]?.[team]}
                  onClick={() => onCellClick(country, team)}
                  isSelected={!!(selectedCell && selectedCell.country === country && selectedCell.team === team)}
                  country={countries[country]}
                  team={team}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  isWrong={!!cellIsWrong}
                />
              )
            })
          ])}
        </div>
      </div>
    </div>
  )
}
