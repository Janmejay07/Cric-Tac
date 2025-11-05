export type CellValue = 'X' | 'O' | null
export type Player = 'X' | 'O'
export type GameMode = 'country-x-ipl' | 'ipl-x-ipl'

export interface BoardCell {
  value: CellValue
  country: string
  team: string
  player: string | null
  isLocked: boolean
  isRowCountry?: boolean  // true if row is country, false if row is team
  isColCountry?: boolean  // true if col is country, false if col is team
}

export interface Board {
  cells: BoardCell[][]
  size: number
}

export interface GameState {
  board: Board
  currentPlayer: Player
  selectedTeams: string[]
  selectedCountries: string[]
  teamOrder: string[]
  countryOrder: string[]
  scores: { X: number; O: number }
  gameOver: boolean
  winner: Player | 'draw' | null
  gameMode?: GameMode
}

// Initialize a 3x3 board with correct row/column mapping
export function initializeBoard(
  selectedTeams: string[],
  selectedCountries: string[],
  gameMode: GameMode = 'country-x-ipl',
  rowLabels?: string[],
  colLabels?: string[]
): Board {
  const size = 3
  const cells: BoardCell[][] = []
  
  // For different game modes:
  // - country-x-ipl: rows = countries, cols = teams
  // - ipl-x-ipl: rows = teams, cols = teams
  // - both: mix of countries and teams
  
  let rows: string[] = []
  let cols: string[] = []
  let rowTypes: boolean[] = [] // true = country, false = team
  let colTypes: boolean[] = [] // true = country, false = team
  
  if (gameMode === 'country-x-ipl') {
    rows = selectedCountries
    cols = selectedTeams
    rowTypes = new Array(size).fill(true)
    colTypes = new Array(size).fill(false)
  } else if (gameMode === 'ipl-x-ipl') {
    // Use explicit labels when provided to allow distinct row/col team sets
    rows = rowLabels || selectedTeams
    cols = colLabels || selectedTeams
    rowTypes = new Array(size).fill(false)
    colTypes = new Array(size).fill(false)
  }
  
  for (let i = 0; i < size; i++) {
    cells[i] = []
    for (let j = 0; j < size; j++) {
      const rowIsCountry = rowTypes[i] ?? true
      const colIsCountry = colTypes[j] ?? false
      
      let country: string
      let team: string
      
      if (gameMode === 'ipl-x-ipl') {
        // Both row and col are teams
        // For IPL x IPL, we need to find players who played for BOTH teams
        // Store row team as country and col team as team for QuestionModal logic
        country = rows[i]  // Row team
        team = cols[j]     // Col team
      } else if (gameMode === 'country-x-ipl') {
        // Row is country, col is team
        country = rows[i]
        team = cols[j]
      } else {
        // Both mode: mixed
        // For QuestionModal: always store country in country field, team in team field
        if (rowIsCountry) {
          // Row is country, col is team
          country = rows[i]
          team = cols[j]
        } else if (colIsCountry) {
          // Row is team, col is country - swap for QuestionModal logic
          country = cols[j]
          team = rows[i]
        } else {
          // Both row and col are teams - store row team as country, col team as team
          country = rows[i]
          team = cols[j]
        }
      }
      
      cells[i][j] = {
        value: null,
        country: country,
        team: team,
        player: null,
        isLocked: true,
        isRowCountry: rowIsCountry,
        isColCountry: colIsCountry,
      }
    }
  }
  
  return { cells, size }
}

// Check for winner
export function checkWinner(board: Board): Player | 'draw' | null {
  const { cells, size } = board
  
  // Check rows
  for (let i = 0; i < size; i++) {
    const row = cells[i]
    if (row[0].value && row[0].value === row[1].value && row[1].value === row[2].value) {
      return row[0].value
    }
  }
  
  // Check columns
  for (let j = 0; j < size; j++) {
    if (
      cells[0][j].value &&
      cells[0][j].value === cells[1][j].value &&
      cells[1][j].value === cells[2][j].value
    ) {
      return cells[0][j].value
    }
  }
  
  // Check diagonals
  if (
    cells[0][0].value &&
    cells[0][0].value === cells[1][1].value &&
    cells[1][1].value === cells[2][2].value
  ) {
    return cells[0][0].value
  }
  
  if (
    cells[0][2].value &&
    cells[0][2].value === cells[1][1].value &&
    cells[1][1].value === cells[2][0].value
  ) {
    return cells[0][2].value
  }
  
  // Check for draw
  let isFull = true
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!cells[i][j].value) {
        isFull = false
        break
      }
    }
    if (!isFull) break
  }
  
  return isFull ? 'draw' : null
}

// Make a move
export function makeMove(
  board: Board,
  row: number,
  col: number,
  player: Player,
  playerName: string
): Board {
  const newCells = board.cells.map((rowCells, i) =>
    rowCells.map((cell, j) => {
      if (i === row && j === col) {
        return {
          ...cell,
          value: player,
          player: playerName,
          isLocked: false,
        }
      }
      return cell
    })
  )
  
  return {
    ...board,
    cells: newCells,
  }
}

