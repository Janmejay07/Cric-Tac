'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Board } from '@/components/Board'
import { GameHeader } from '@/components/GameHeader'
import { GameOverModal } from '@/components/GameOverModal'
import { QuestionModal } from '@/components/QuestionModal'
import { GameModeSelector } from '@/components/GameModeSelector'
import {
  initializeBoard,
  checkWinner,
  makeMove,
  type GameState,
  type Player,
  type GameMode,
} from '@/utils/gameUtils'
import { getGameOptionsByMode } from '@/data/questions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [showQuestionModal, setShowQuestionModal] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [turnTimer, setTurnTimer] = useState(15)
  const [gameMode, setGameMode] = useState<GameMode>('country-x-ipl')

  useEffect(() => {
    startNewGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode])

  // Timer countdown effect - only runs when dialog is NOT open
  useEffect(() => {
    if (!gameState || gameState.gameOver || showQuestionModal) {
      // Pause timer when dialog is open
      return
    }

    if (turnTimer <= 0) {
      // Time's up - switch player
      const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X'
      setGameState({
        ...gameState,
        currentPlayer: nextPlayer,
      })
      setTurnTimer(15)
      return
    }

    const timer = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          // Time's up - will trigger player switch in next render
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, turnTimer, showQuestionModal])

  // Reset timer when player changes (but not when it's already at 0)
  useEffect(() => {
    if (gameState && !gameState.gameOver && turnTimer !== 0) {
      setTurnTimer(15)
    }
  }, [gameState?.currentPlayer])

  const startNewGame = () => {
    let options = getGameOptionsByMode(gameMode, 3)
    // Retry a couple times if generator returns incomplete sets
    for (let tries = 0; tries < 2; tries++) {
      if ((options.teams?.length || 0) >= 3 && (options.countries?.length || 0) >= 3) break
      options = getGameOptionsByMode(gameMode, 3)
    }
    const { teams = [], countries = [], rowLabels, colLabels } = options
    
    // Determine row and column labels based on mode
    let finalRowLabels: string[] = []
    let finalColLabels: string[] = []
    
    if (gameMode === 'country-x-ipl') {
      finalRowLabels = countries
      finalColLabels = teams
    } else if (gameMode === 'ipl-x-ipl') {
      // Use provided row/col labels if present to allow distinct team sets
      finalRowLabels = rowLabels || teams
      finalColLabels = colLabels || teams
    } else {
      finalRowLabels = rowLabels || countries
      finalColLabels = colLabels || teams
    }
    
    const board = initializeBoard(teams, countries, gameMode, finalRowLabels, finalColLabels)
    setGameState({
      board,
      currentPlayer: 'X',
      selectedTeams: teams,
      selectedCountries: countries,
      teamOrder: finalColLabels,
      countryOrder: finalRowLabels,
      scores: { X: 0, O: 0 },
      gameOver: false,
      winner: null,
      gameMode,
    })
    setShowGameOverModal(false)
    setTurnTimer(15)
  }

  // Start a new round but keep the same teams/countries and row/col labels
  const restartSameOptions = () => {
    if (!gameState) return startNewGame()
    const { selectedTeams, selectedCountries, countryOrder, teamOrder, gameMode, scores } = gameState
    const board = initializeBoard(selectedTeams, selectedCountries, gameMode, countryOrder, teamOrder)
    setGameState({
      board,
      currentPlayer: 'X',
      selectedTeams,
      selectedCountries,
      teamOrder,
      countryOrder,
      scores,
      gameOver: false,
      winner: null,
      gameMode,
    })
    setShowGameOverModal(false)
    setTurnTimer(15)
  }

  const handleCellClick = (row: number, col: number) => {
    if (!gameState || gameState.gameOver) return

    const cell = gameState.board.cells[row][col]
    if (!cell.isLocked || cell.value) return

    setSelectedCell({ row, col })
    setShowQuestionModal(true)
    setTurnTimer(15) // Reset timer when cell is clicked
  }

  const handleAnswer = (playerName: string, isCorrect: boolean) => {
    if (!gameState || !selectedCell) return

    if (isCorrect) {
      // Correct answer - mark the cell and then switch turn
      const { row, col } = selectedCell
      const newBoard = makeMove(gameState.board, row, col, gameState.currentPlayer, playerName)
      const winner = checkWinner(newBoard)

      const newScores = { ...gameState.scores }
      if (winner && winner !== 'draw') {
        newScores[winner]++
      }

      const newGameState: GameState = {
        ...gameState,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
        scores: newScores,
        gameOver: winner !== null,
        winner,
      }

      setGameState(newGameState)
      setShowQuestionModal(false)
      setSelectedCell(null)
      setTurnTimer(15) // Reset timer after move

      if (winner !== null) {
        setTimeout(() => setShowGameOverModal(true), 500)
      }
    } else {
      // Incorrect answer - just switch turn without marking the cell
      setGameState({
        ...gameState,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      })
      setShowQuestionModal(false)
      setSelectedCell(null)
      setTurnTimer(15) // Reset timer for next player
    }
  }

  const handleCloseQuestion = () => {
    if (gameState && selectedCell) {
      // Player chose a cell but closed the modal - switch turn
      setGameState({
        ...gameState,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
      })
      setTurnTimer(15) // Reset timer for next player
    }
    setShowQuestionModal(false)
    setSelectedCell(null)
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg sm:text-xl md:text-2xl font-black">Loading...</div>
      </div>
    )
  }

  const selectedCellData = selectedCell
    ? gameState.board.cells[selectedCell.row][selectedCell.col]
    : null

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse -translate-x-1/2 -translate-y-1/2" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 border-b border-white/10 backdrop-blur-lg bg-slate-900/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-base sm:text-lg font-bold">C</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-white">Cric-Tac</span>
            </Link>
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-2 sm:py-3 md:py-4">
        <GameModeSelector onSelectMode={setGameMode} currentMode={gameMode} />
        <GameHeader
          currentPlayer={gameState.currentPlayer}
          selectedTeams={gameState.selectedTeams}
          selectedCountries={gameState.selectedCountries}
          scores={gameState.scores}
          turnTimer={turnTimer}
          gameOver={gameState.gameOver}
        />

        <div className="mt-2 sm:mt-3 md:mt-4 flex justify-center">
          <Board
            board={gameState.board}
            onCellClick={handleCellClick}
            currentPlayer={gameState.currentPlayer}
            teamOrder={gameState.teamOrder}
            countryOrder={gameState.countryOrder}
            gameMode={gameState.gameMode}
          />
        </div>

        <div className="mt-2 sm:mt-3 md:mt-4 w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-50 backdrop-blur-xl border border-emerald-200 p-2 sm:p-3 md:p-4 lg:p-5 shadow-xl flex flex-col">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={startNewGame}
              className="px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset Game</span>
            </button>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-700 text-xs sm:text-sm md:text-base font-semibold">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-center sm:text-left">Click a cell to answer a cricket quiz question!</span>
            </div>
          </div>
        </div>

        {selectedCellData && (
          <QuestionModal
            open={showQuestionModal}
            country={selectedCellData.country}
            team={selectedCellData.team}
            currentPlayer={gameState.currentPlayer}
            gameMode={gameState.gameMode || 'country-x-ipl'}
            onAnswer={handleAnswer}
            onClose={handleCloseQuestion}
            onTimeUp={() => {
              // Dialog timer expired - close dialog and switch player
              if (gameState) {
                setGameState({
                  ...gameState,
                  currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
                })
                setTurnTimer(15)
              }
              setShowQuestionModal(false)
              setSelectedCell(null)
            }}
          />
        )}

        <GameOverModal
          open={showGameOverModal}
          winner={gameState.winner}
          scores={gameState.scores}
          onNewGame={restartSameOptions}
          onClose={() => setShowGameOverModal(false)}
        />
        </div>
      </div>
    </div>
  )
}

