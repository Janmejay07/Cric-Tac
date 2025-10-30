import { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle, Send, Search } from 'lucide-react'
import { suggestPlayers } from '../data/players'

interface QuestionModalProps {
  isOpen: boolean
  players: string[] | null
  onSubmit: (isCorrect: boolean) => void
  onClose: () => void
  currentPlayer: string
  country?: string
  team?: string
}

export default function QuestionModal({ isOpen, players, onSubmit, onClose, currentPlayer, country, team }: QuestionModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('')
  const [feedback, setFeedback] = useState('')
  const [remaining, setRemaining] = useState(30)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setRemaining(30)
    setSubmitted(false)
  }, [isOpen])
  
  // Timeout/auto fail
  useEffect(() => {
    if (!isOpen) return
    if (remaining <= 0 && !submitted) {
      setFeedback('⏳ Time\'s up!')
      setSubmitted(true)
      const t = setTimeout(() => {
        onSubmit(false)
        setSelected('')
        setSearch('')
        setFeedback('')
        // don't call onClose here; parent closes it
      }, 800)
      return () => clearTimeout(t)
    }
    const timer = setInterval(() => setRemaining((s) => s - 1), 1000)
    return () => clearInterval(timer)
  }, [isOpen, remaining, submitted, onSubmit])

  if (!isOpen || !players) return null

  // Use suggestPlayers to show all players starting with typed letters (from entire player list)
  const filteredPlayers = search ? suggestPlayers(search, 50) : []

  const handle = () => {
    if (submitted) return
    if (!selected) {
      setFeedback('Please select a player!')
      return
    }
    setSubmitted(true)
    const ok = players.includes(selected)
    setFeedback(ok ? '✅ Correct!' : '❌ Wrong!')
    setTimeout(() => {
      onSubmit(ok)
      setSelected('')
      setSearch('')
      setFeedback('')
      // don't call onClose here; parent closes it
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xl grid place-items-center p-2 sm:p-4 z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-gradient-to-br from-violet-500/30 via-purple-500/30 to-fuchsia-500/30 text-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden border-2 border-violet-400/40 transform animate-scaleIn relative flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 via-purple-400/20 to-fuchsia-400/20 animate-gradient pointer-events-none" />

        <div className="relative z-10 flex flex-col flex-1 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500/40 via-pink-500/40 to-purple-500/40 px-3 sm:px-6 py-3 sm:py-5 flex items-center justify-between border-b-2 border-white/20 flex-shrink-0">
            <h2 className="text-lg sm:text-2xl font-black flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl animate-bounce">🏏</span>
              <span className="hidden sm:inline">Player Selection</span>
              <span className="sm:hidden">Player</span>
            </h2>
            <button
              className="text-white hover:text-red-300 text-2xl sm:text-3xl leading-none transition-all duration-500 hover:rotate-180 transform hover:scale-125 flex-shrink-0"
              onClick={onClose}
            >
              <X className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          </div>

          <div className="px-3 sm:px-6 py-3 sm:py-5 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20 border-b-2 border-white/20 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 text-sm sm:text-base">
              <p className="font-bold flex items-center gap-2">
                <span className="text-cyan-300">Player:</span>
                <span className={`px-2 sm:px-4 py-1 sm:py-2 rounded-xl font-black text-base sm:text-lg shadow-xl ${
                  currentPlayer === 'X'
                    ? 'bg-gradient-to-br from-red-500 via-pink-500 to-fuchsia-500 border-2 border-red-300/50'
                    : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 border-2 border-cyan-300/50'
                } shadow-lg`}>
                  {currentPlayer}
                </span>
              </p>
              <p className="font-bold flex items-center gap-2">
                <span className="text-yellow-300">Category:</span>
                <span className="px-2 sm:px-4 py-1 sm:py-2 rounded-xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-300/50 font-black shadow-lg text-sm sm:text-base break-words">
                  {country} × {team}
                </span>
              </p>
              <p className="sm:ml-auto font-black flex items-center gap-2 text-base sm:text-lg">
                <span className="text-emerald-300">Time:</span>
                <span className={`px-2 sm:px-3 py-1 rounded-xl border-2 text-sm sm:text-base ${remaining <= 5 ? 'border-red-400 text-red-300 bg-red-500/20' : 'border-emerald-300 text-emerald-300 bg-emerald-500/20'}`}>
                  {remaining}s
                </span>
              </p>
            </div>
          </div>

          <div className="px-3 sm:px-6 py-4 sm:py-6 flex-1 overflow-hidden flex flex-col">
            <h3 className="text-base sm:text-xl font-bold text-white mb-3 sm:mb-4 leading-relaxed drop-shadow-lg">
              Type letters to find players:
            </h3>
            <div className="relative mb-3 sm:mb-4">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 z-10" />
              <input
                type="text"
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 border-2 border-white/30 text-white placeholder-white/50 font-bold text-base sm:text-lg focus:outline-none focus:border-yellow-400 focus:bg-white/20 transition-all duration-300"
                placeholder="Type player name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={remaining <= 0}
              />
            </div>
            
            <div className="mt-2 sm:mt-4 flex-1 overflow-y-auto min-h-0">
              {search ? (
                filteredPlayers.length > 0 ? (
                  <>
                    <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3 font-bold">
                      Found {filteredPlayers.length} player{filteredPlayers.length !== 1 ? 's' : ''}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {filteredPlayers.map((player, i) => (
                        <div
                          key={i}
                          className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                            selected === player
                              ? 'border-yellow-400 bg-gradient-to-br from-yellow-500/40 to-orange-500/40 shadow-2xl shadow-yellow-500/50'
                              : 'border-white/30 bg-gradient-to-br from-white/10 to-white/5 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30'
                          }`}
                          onClick={() => {
                            setSelected(player)
                          }}
                        >
                          <span className="text-white font-bold text-sm sm:text-base break-words">{player}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-4 sm:p-6 bg-red-500/20 backdrop-blur-xl rounded-xl sm:rounded-2xl border-2 border-red-400/40 text-red-300 font-bold text-center text-sm sm:text-base">
                    No players found matching "{search}". Try different letters.
                  </div>
                )
              ) : (
                <div className="text-white/60 font-bold text-center py-6 sm:py-8 text-sm sm:text-base">
                  Type letters to see matching players
                </div>
              )}
            </div>
            
            {selected && (
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-2 border-yellow-400/50 flex-shrink-0">
                <p className="text-white font-bold text-sm sm:text-lg">Selected: <span className="text-yellow-300 break-words">{selected}</span></p>
              </div>
            )}
          </div>

          <div className="px-3 sm:px-6 py-4 sm:py-6 border-t-2 border-white/20 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 text-center flex-shrink-0">
            <button
              className="inline-flex items-center gap-2 sm:gap-3 justify-center rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-black px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-xl shadow-2xl hover:shadow-orange-500/70 hover:scale-110 hover:rotate-3 active:scale-95 transition-all duration-500 disabled:hover:scale-100 disabled:opacity-50 border-2 border-orange-300/50 w-full sm:w-auto"
              onClick={handle}
              disabled={!selected}
            >
              <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline">Submit Player</span>
              <span className="sm:hidden">Submit</span>
            </button>

            {feedback && (
              <div className={`mt-3 sm:mt-5 font-black text-lg sm:text-2xl flex items-center justify-center gap-2 sm:gap-3 animate-popIn ${
                feedback.includes('✅') ? 'text-green-300' : 'text-red-300'
              }`}>
                {feedback.includes('✅') ? (
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-bounce" />
                ) : (
                  <XCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-wiggle" />
                )}
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
