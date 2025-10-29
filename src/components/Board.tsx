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
}

export default function Board({ board, onCellClick, selectedCell, teams, countries, teamOrder = Object.keys(teams), countryOrder = Object.keys(countries) }: BoardProps) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-blue-500/20 backdrop-blur-xl shadow-2xl p-6 border-2 border-cyan-400/30 animate-fadeIn relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-cyan-400/10 to-blue-400/10 animate-gradient pointer-events-none" />

      <div className="relative z-10">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-br from-cyan-500/30 via-teal-500/30 to-emerald-500/30 p-4 text-center text-white min-h-[80px] flex items-center justify-center transform hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-lg hover:shadow-cyan-500/50 animate-float">
            <span className="text-sm font-bold tracking-wide">Country × Team</span>
          </div>
          {teamOrder.map((abbr, idx) => (
            <div
              key={abbr}
              className="rounded-2xl border-2 border-orange-400/40 bg-gradient-to-br from-orange-500/30 via-amber-500/30 to-yellow-500/30 p-4 text-center text-white transform hover:scale-110 hover:-rotate-2 transition-all duration-500 shadow-xl hover:shadow-orange-500/60 animate-slideDown"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <span className="block font-black text-xl drop-shadow-lg">{abbr}</span>
              <span className="block text-xs font-semibold mt-1 opacity-90">{teams[abbr]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          {countryOrder.map((country, rowIndex) => (
            <React.Fragment key={country}>
              <div
                className="rounded-2xl border-2 border-pink-400/40 bg-gradient-to-br from-pink-500/30 via-rose-500/30 to-red-500/30 p-4 text-center text-white flex items-center justify-center min-h-[100px] transform hover:scale-110 hover:rotate-2 transition-all duration-500 shadow-xl hover:shadow-pink-500/60 animate-slideDown"
                style={{ animationDelay: `${rowIndex * 100}ms` }}
              >
                <span className="text-4xl font-bold drop-shadow-2xl animate-float">{countries[country]}</span>
              </div>
            {teamOrder.map((team, colIndex) => (
              <Cell
                key={`${country}-${team}`}
                value={board[country]?.[team]}
                onClick={() => onCellClick(country, team)}
                isSelected={!!(selectedCell && selectedCell.country === country && selectedCell.team === team)}
                country={countries[country]}
                team={team}
                rowIndex={rowIndex}
                colIndex={colIndex}
              />
            ))}
          </React.Fragment>
        ))}
        </div>
      </div>
    </div>
  )
}
