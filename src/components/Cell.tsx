interface CellProps {
  value: string | null
  onClick: () => void
  isSelected: boolean
  country: string
  team: string
  rowIndex: number
  colIndex: number
  isWrong?: boolean
}

export default function Cell({ value, onClick, isSelected, country, team, rowIndex, colIndex, isWrong }: CellProps) {
  const delay = (rowIndex * 3 + colIndex) * 50

  let baseClasses = 'rounded-2xl border-2 text-white cursor-pointer transition-all duration-500 p-4 text-center min-h-[100px] flex items-center justify-center relative overflow-hidden group'

  if (isWrong) {
    baseClasses += ' bg-gradient-to-br from-gray-400/40 via-gray-700/40 to-red-700/50 border-red-500 text-red-300 animate-wiggle cursor-not-allowed opacity-90'
  } else if (value) {
    if (value === 'X') {
      baseClasses += ' bg-gradient-to-br from-red-500/40 via-pink-500/40 to-fuchsia-500/40 border-red-400/60 text-white shadow-2xl shadow-red-500/50 animate-pulse-glow'
    } else {
      baseClasses += ' bg-gradient-to-br from-blue-500/40 via-cyan-500/40 to-teal-500/40 border-cyan-400/60 text-white shadow-2xl shadow-cyan-500/50 animate-pulse-glow'
    }
  } else {
    baseClasses += ' bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-violet-400/30 hover:border-violet-400/80 hover:from-violet-500/30 hover:via-purple-500/30 hover:to-fuchsia-500/30 hover:scale-110 hover:rotate-3 hover:shadow-2xl hover:shadow-violet-500/40'
  }
  if (isSelected) {
    baseClasses += ' ring-4 ring-yellow-400 ring-offset-4 ring-offset-transparent scale-110 shadow-2xl shadow-yellow-500/60 animate-wiggle'
  }

  return (
    <div
      className={baseClasses}
      onClick={isWrong ? undefined : onClick}
      title={`${country} × ${team}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />

      <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-sparkle" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-cyan-300 rounded-full opacity-0 group-hover:opacity-100 animate-sparkle" style={{ animationDelay: '0.3s' }} />
      <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-pink-300 rounded-full opacity-0 group-hover:opacity-100 animate-sparkle" style={{ animationDelay: '0.6s' }} />

      {isWrong ? (
        <span className='text-5xl font-black drop-shadow-2xl animate-popIn relative z-10 group-hover:scale-110 transition-transform duration-300'>❌</span>
      ) : value ? (
        <span className='text-5xl font-black drop-shadow-2xl animate-popIn relative z-10 group-hover:scale-110 transition-transform duration-300'>{value}</span>
      ) : (
        <div className='flex flex-col items-center gap-1 opacity-70 group-hover:opacity-100 transition-all duration-500 relative z-10 group-hover:scale-110'>
          <span className='text-xs font-bold'>{country}</span>
          <span className='text-xs font-black text-white/90'>{team}</span>
        </div>
      )}
    </div>
  )
}
