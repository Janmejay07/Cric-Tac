import { useState, useEffect } from 'react'
import Board from './components/Board'
import QuestionModal from './components/QuestionModal'
import GameHeader from './components/GameHeader'
import GameOverModal from './components/GameOverModal'
import GameFooter from './components/GameFooter'
import { playerList, teams, countries, getRandomStartOptions } from './data/questions'
import { checkWinner, initializeBoard } from './utils/gameUtils'

// Function to select random teams and countries that have available players
const selectRandomCombinations = () => {
  const { countries: selectedCountryCodes, teams: selectedTeamCodes } = getRandomStartOptions(3)
  
  const randomTeams: Record<string, string> = {}
  const randomCountries: Record<string, string> = {}
  
  selectedTeamCodes.forEach((teamCode) => {
    randomTeams[teamCode] = teams[teamCode as keyof typeof teams]
  })
  
  selectedCountryCodes.forEach((countryCode) => {
    randomCountries[countryCode] = countries[countryCode as keyof typeof countries]
  })
  
  return { randomTeams, randomCountries }
}

export default function App() {
  const [board, setBoard] = useState<Record<string, Record<string, string | null>>>({})
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [selectedCell, setSelectedCell] = useState<{ country: string; team: string } | null>(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [gameOver, setGameOver] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0 })
  const [teamOrder, setTeamOrder] = useState<string[]>([])
  const [countryOrder, setCountryOrder] = useState<string[]>([])
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>({})
  const [selectedCountries, setSelectedCountries] = useState<Record<string, string>>({})

  useEffect(() => {
    const { randomTeams, randomCountries } = selectRandomCombinations()
    setSelectedTeams(randomTeams)
    setSelectedCountries(randomCountries)
    setBoard(initializeBoard(randomCountries, randomTeams))
    setTeamOrder(Object.keys(randomTeams))
    setCountryOrder(Object.keys(randomCountries))
  }, [])

  const handleCellClick = (country: string, team: string) => {
    if (gameOver || board[country]?.[team]) return
    setSelectedCell({ country, team })
    setShowQuestion(true)
  }

  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (!selectedCell) return
    if (isCorrect) {
      const nb = { ...board, [selectedCell.country]: { ...board[selectedCell.country], [selectedCell.team]: currentPlayer } }
      setBoard(nb)
      setScores(s => ({ ...s, [currentPlayer]: s[currentPlayer as keyof typeof s] + 1 }))
      const w = checkWinner(nb, selectedTeams, selectedCountries)
      if (w) { setWinner(w); setGameOver(true) } else { setCurrentPlayer(p => (p === 'X' ? 'O' : 'X')) }
    } else {
      setCurrentPlayer(p => (p === 'X' ? 'O' : 'X'))
    }
    setSelectedCell(null)
    setShowQuestion(false)
  }

  const resetGame = () => {
    const { randomTeams, randomCountries } = selectRandomCombinations()
    setSelectedTeams(randomTeams)
    setSelectedCountries(randomCountries)
    setBoard(initializeBoard(randomCountries, randomTeams))
    setCurrentPlayer('X')
    setWinner(null)
    setGameOver(false)
    setScores({ X: 0, O: 0 })
    setSelectedCell(null)
    setShowQuestion(false)
    setTeamOrder(Object.keys(randomTeams))
    setCountryOrder(Object.keys(randomCountries))
  }

  const availablePlayers = selectedCell ? (playerList[selectedCell.country as keyof typeof playerList] as any)?.[selectedCell.team] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-fuchsia-900 to-pink-900 py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" style={{ backgroundSize: '200% 200%' }} />

      <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 right-40 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <GameHeader currentPlayer={currentPlayer} scores={scores} />
        <Board
          board={board}
          onCellClick={handleCellClick}
          selectedCell={selectedCell}
          teams={selectedTeams}
          countries={selectedCountries}
          teamOrder={teamOrder}
          countryOrder={countryOrder}
        />
        {gameOver && <GameOverModal winner={winner} onReset={resetGame} />}
        <QuestionModal
          isOpen={showQuestion}
          players={availablePlayers}
          onSubmit={handleAnswerSubmit}
          onClose={() => { handleAnswerSubmit(false) }}
          currentPlayer={currentPlayer}
          country={selectedCell?.country}
          team={selectedCell?.team}
        />
        <GameFooter onReset={resetGame} />
      </div>
    </div>
  )
}
