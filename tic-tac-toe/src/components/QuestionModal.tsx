'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../components/ui/dialog'
import { Search, X, Circle, Send, Target } from 'lucide-react'
import { playerList } from '../data/questions'
import { countryNames, teamNames } from '../data/mappings' // ✅ Import to convert code to name
import type { GameMode } from '../utils/gameUtils'

interface QuestionModalProps {
  open: boolean
  country: string // This is a country CODE (e.g., "IN", "AU") or team code for IPL x IPL mode
  team: string
  currentPlayer?: 'X' | 'O'
  gameMode?: GameMode
  onAnswer: (playerName: string, isCorrect: boolean) => void
  onClose: () => void
  onTimeUp?: () => void
}

export function QuestionModal({
  open,
  country,
  team,
  currentPlayer = 'X',
  gameMode = 'country-x-ipl',
  onAnswer,
  onClose,
  onTimeUp
}: QuestionModalProps) {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  // Timer countdown
  useEffect(() => {
    if (open) {
      setTimeLeft(30)
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            if (onTimeUp) onTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setTimeLeft(30)
    }
  }, [open, onTimeUp])

  // Suggestions from all players
  useEffect(() => {
    // Don't show suggestions if there's an error
    if (!answer.trim() || error) {
      setSuggestions([])
      setHighlightedIndex(-1)
      return
    }

    const allPlayers: string[] = []
    for (const t of Object.keys(playerList)) {
      for (const c of Object.keys(playerList[t])) {
        allPlayers.push(...playerList[t][c])
      }
    }

    // Remove duplicates and filter names containing the typed letters
    const uniquePlayers = Array.from(new Set(allPlayers))
    const query = answer.trim().toLowerCase()
    const filtered = uniquePlayers
      .filter((name) => name.toLowerCase().includes(query))
      .slice(0, 50) // Show up to 50 suggestions

    setSuggestions(filtered)
    setHighlightedIndex(filtered.length > 0 ? 0 : -1)
  }, [answer, error])

  const selectSuggestion = (name: string) => {
    setAnswer(name)
    setSuggestions([])
    setHighlightedIndex(-1)
    setError('')
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault()
        selectSuggestion(suggestions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setSuggestions([])
      setHighlightedIndex(-1)
    }
  }

  const renderHighlightedName = (name: string, query: string) => {
    const q = query.trim().toLowerCase()
    if (!q) return name
    
    const nameLower = name.toLowerCase()
    const index = nameLower.indexOf(q)
    
    if (index === -1) return name
    
    const before = name.slice(0, index)
    const highlighted = name.slice(index, index + q.length)
    const after = name.slice(index + q.length)
    
    return (
      <>
        {before && <span>{before}</span>}
        <span className="font-bold text-white bg-emerald-500/30">{highlighted}</span>
        {after && <span>{after}</span>}
      </>
    )
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    // Clear suggestions immediately when submitting
    setSuggestions([])
    setHighlightedIndex(-1)
    setError('')

    const raw = answer.trim()
    const safe = raw.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, 60)
    if (!safe) {
      setError('Please enter a player name')
      return
    }

    const normalizedAnswer = safe.toLowerCase()

    let isCorrect = false

    if (gameMode === 'ipl-x-ipl') {
      // For IPL x IPL: check if player exists in BOTH teams (country is row team, team is col team)
      const rowTeam = country
      const colTeam = team
      
      // Get all players from row team
      const rowTeamPlayers = new Set<string>()
      const rowTeamData = playerList[rowTeam]
      if (rowTeamData) {
        for (const countryKey of Object.keys(rowTeamData)) {
          rowTeamData[countryKey].forEach((player: string) => {
            rowTeamPlayers.add(player.toLowerCase())
          })
        }
      }
      
      // Get all players from col team
      const colTeamPlayers = new Set<string>()
      const colTeamData = playerList[colTeam]
      if (colTeamData) {
        for (const countryKey of Object.keys(colTeamData)) {
          colTeamData[countryKey].forEach((player: string) => {
            colTeamPlayers.add(player.toLowerCase())
          })
        }
      }
      
      // Check if player exists in both teams
      isCorrect = rowTeamPlayers.has(normalizedAnswer) && colTeamPlayers.has(normalizedAnswer)
    } else {
      // For country-x-ipl mode: check team → country → player
      const countryCode = country; // e.g., "IN"
      const countryName = countryNames[countryCode] || countryCode; // e.g., "India" or "IN" fallback
      const teamData = playerList[team];
      
      let targetPlayers: string[] = [];
      
      if (teamData) {
        // 1. Get players using the country NAME (e.g., 'India')
        const playersByName = teamData[countryName];
        // 2. Get players using the original country CODE (e.g., 'IN')
        const playersByCode = teamData[countryCode]; 

        // 3. Combine both lists (using spread operator and filter to handle null/undefined)
        targetPlayers = [
            ...(Array.isArray(playersByName) ? playersByName : []),
            ...(Array.isArray(playersByCode) ? playersByCode : []),
        ];
      }
      
      // 4. Remove any duplicates and perform the final check
      const uniqueTargetPlayers = Array.from(new Set(targetPlayers));

      isCorrect = uniqueTargetPlayers.some(
        (player: string) => player.toLowerCase() === normalizedAnswer
      );
    }

    if (isCorrect) {
      onAnswer(safe, true)
      setAnswer('')
      setError('')
      setSuggestions([])
    } else {
      setError('Incorrect answer!')
      setTimeout(() => {
        onAnswer(safe, false)
        setAnswer('')
        setSuggestions([])
        setError('')
      }, 1500)
    }
  }

  const handleClose = () => {
    setAnswer('')
    setError('')
    onClose()
  }

  // Get the display names
  const countryDisplayName = countryNames[country] || country
  const teamDisplayName = teamNames[team] || team
  
  // Determine what to display based on game mode
  let categoryDisplay = ''
  if (gameMode === 'ipl-x-ipl') {
    const rowTeamName = teamNames[country] || country
    const colTeamName = teamDisplayName
    categoryDisplay = `${rowTeamName} × ${colTeamName}`
  }
   else {
    categoryDisplay = `${countryDisplayName} × ${team}`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className={`bg-gradient-to-br from-slate-800/95 to-slate-900/95 text-white rounded-xl shadow-2xl border border-white/10 backdrop-blur-xl p-0 transition-all duration-300 ease-in-out ${
          suggestions.length > 0 
            ? 'w-[calc(100vw-2rem)] max-w-3xl' 
            : 'w-[calc(100vw-2rem)] max-w-2xl'
        }`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: suggestions.length > 0 ? '85vh' : '60vh',
          minHeight: suggestions.length > 0 ? '85vh' : '60vh',
          maxHeight: suggestions.length > 0 ? '90vh' : '60vh',
          width: suggestions.length > 0 ? 'calc(100vw - 2rem)' : 'calc(100vw - 2rem)',
          maxWidth: suggestions.length > 0 ? '48rem' : '42rem',
          overflow: 'hidden',
          transition: 'height 300ms ease-in-out, min-height 300ms ease-in-out, max-height 300ms ease-in-out, width 300ms ease-in-out, max-width 300ms ease-in-out',
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500/40 via-pink-500/40 to-purple-500/40 px-5 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-white text-xl font-bold">
              Player Selection
            </DialogTitle>
          </div>
        </div>

        {/* Info Bar */}
        <div className="px-5 py-3 bg-slate-700/50 border-b border-white/10 flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300 font-semibold">Player:</span>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                currentPlayer === 'X'
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}
            >
              {currentPlayer === 'X' ? <X /> : <Circle />}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300 font-semibold">Category:</span>
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm">
              {categoryDisplay}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-300 font-semibold">Time:</span>
            <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm">
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="px-5 py-5 bg-slate-800/50 flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-white font-bold text-base mb-4">
              Type letters to find players:
            </p>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value)
                  setError('')
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type player name..."
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 font-semibold text-base focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/50 transition-all"
              />

              {answer && (
                <button
                  type="button"
                  onClick={() => {
                    setAnswer('')
                    setSuggestions([])
                    setHighlightedIndex(-1)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 rounded-md hover:bg-slate-700/50"
                >
                  ×
                </button>
              )}

              <div className="absolute left-0 right-0 z-30" style={{ top: 'calc(100% + 8px)' }}>
                {suggestions.length > 0 && !error && (
                  <div className="max-h-96 overflow-auto rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl">
                    {suggestions.map((name, idx) => (
                      <button
                        key={`${name}-${idx}`}
                        type="button"
                        onClick={() => selectSuggestion(name)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        className={`w-full text-left px-4 py-3 transition-colors ${
                          highlightedIndex === idx
                            ? 'bg-slate-800/80 text-white'
                            : 'text-slate-200 hover:bg-slate-800/70 hover:text-white'
                        }`}
                      >
                        {renderHighlightedName(name, answer)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 font-semibold bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-4 relative z-40">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-700/80 to-slate-800/80 px-5 py-4 border-t border-white/10">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-6 py-3 text-base shadow-lg shadow-blue-500/50 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
            <span>Submit Player</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}