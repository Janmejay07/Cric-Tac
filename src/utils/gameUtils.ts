export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  // Use proper Fisher-Yates shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function initializeBoard(countries: Record<string, string>, teams: Record<string, string>) {
  const board: Record<string, Record<string, string | null>> = {}
  Object.keys(countries).forEach(country => {
    board[country] = {}
    Object.keys(teams).forEach(team => {
      board[country][team] = null
    })
  })
  return board
}

export function checkWinner(board: Record<string, Record<string, string | null>>, teams: Record<string, string>, countries: Record<string, string>) {
  const teamKeys = Object.keys(teams)
  const countryKeys = Object.keys(countries)

  for (const country of countryKeys) {
    const row = teamKeys.map(t => board[country][t])
    if (row[0] && row.every(cell => cell === row[0])) return row[0]
  }

  for (const team of teamKeys) {
    const col = countryKeys.map(c => board[c][team])
    if (col[0] && col.every(cell => cell === col[0])) return col[0]
  }

  const diag1 = countryKeys.map((c, i) => board[c][teamKeys[i]])
  if (diag1[0] && diag1.every(cell => cell === diag1[0])) return diag1[0]

  const diag2 = countryKeys.map((c, i) => board[c][teamKeys[teamKeys.length - 1 - i]])
  if (diag2[0] && diag2.every(cell => cell === diag2[0])) return diag2[0]

  const allFilled = countryKeys.every(c => teamKeys.every(t => board[c][t]))
  if (allFilled) return 'draw'

  return null
}
