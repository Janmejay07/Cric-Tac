'use client'

import { Board as BoardType, GameMode } from '@/utils/gameUtils'
import { Cell } from './Cell'
import { teamNames, countryNames, countryPrefixes } from '@/data/mappings'

interface BoardProps {
  board: BoardType
  onCellClick: (row: number, col: number) => void
  currentPlayer: 'X' | 'O'
  teamOrder: string[]
  countryOrder: string[]
  gameMode?: GameMode
}

export function Board({ board, onCellClick, currentPlayer, teamOrder, countryOrder, gameMode = 'country-x-ipl' }: BoardProps) {
  const isIPLxIPL = gameMode === 'ipl-x-ipl'
  const isMixed = false
  
  // Determine header text
  const topLeftText = isIPLxIPL ? 'Team × Team' : isMixed ? 'Mixed' : 'Country × Team'
  return (
    <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-white via-emerald-50 to-blue-50 backdrop-blur-xl border-2 border-emerald-200 p-2 sm:p-3 md:p-4 relative overflow-hidden w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto shadow-xl flex flex-col min-h-[350px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-[550px]">
      {/* Background accents */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-b from-emerald-400 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-t from-blue-400 to-transparent rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-2 w-full relative z-10">
        {/* Top-Left Corner */}
        <div className="rounded-lg sm:rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-100 to-emerald-50 p-1 sm:p-1.5 md:p-2 text-center text-emerald-700 min-h-[70px] sm:min-h-[80px] md:min-h-[95px] lg:min-h-[110px] flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm shadow-md">
          <span className="leading-tight">{topLeftText}</span>
        </div>

        {/* Column Headers (Teams) */}
        {teamOrder.map((team, idx) => (
          <div
            key={`team-${idx}`}
            className="rounded-lg sm:rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-200 to-emerald-100 p-1 sm:p-1.5 md:p-2 text-center text-emerald-900 min-h-[70px] sm:min-h-[80px] md:min-h-[95px] lg:min-h-[110px] flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight">{team}</div>
            {teamNames[team] && (
              <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-emerald-700 mt-0.5 sm:mt-1 leading-tight text-center px-0.5 line-clamp-2">{teamNames[team]}</div>
            )}
          </div>
        ))}

        {/* Game Cells */}
        {board.cells.map((row, i) => (
          <div key={`row-${i}`} className="contents">
            {/* Row Header (Country or Team) */}
            <div className="rounded-lg sm:rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-200 to-blue-100 p-1 sm:p-1.5 md:p-2 text-center text-blue-900 min-h-[70px] sm:min-h-[80px] md:min-h-[95px] lg:min-h-[110px] flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight">{countryOrder[i]}</div>
              {isIPLxIPL ? (
                teamNames[countryOrder[i]] && (
                  <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-blue-700 mt-0.5 sm:mt-1 leading-tight text-center px-0.5 line-clamp-2">
                    {teamNames[countryOrder[i]]}
                  </div>
                )
              ) : countryNames[countryOrder[i]] && countryPrefixes[countryOrder[i]] ? (
                <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-blue-700 mt-0.5 sm:mt-1 leading-tight text-center px-0.5 line-clamp-2">
                  {countryPrefixes[countryOrder[i]]} {countryNames[countryOrder[i]]}
                </div>
              ) : teamNames[countryOrder[i]] ? (
                <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-blue-700 mt-0.5 sm:mt-1 leading-tight text-center px-0.5 line-clamp-2">
                  {teamNames[countryOrder[i]]}
                </div>
              ) : null}
            </div>

            {/* Team Cells */}
            {row.map((cell, j) => cell && (
              <Cell
                key={`${i}-${j}`}
                cell={cell}
                row={i}
                col={j}
                onClick={() => onCellClick(i, j)}
                currentPlayer={currentPlayer}
                teamOrder={teamOrder}
                countryOrder={countryOrder}
                gameMode={gameMode}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
