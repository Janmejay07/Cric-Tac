type Props = { onSelect: (mode: 'offline' | 'online') => void }

export default function ModeSelector({ onSelect }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center my-6">
      <button className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black" onClick={() => onSelect('offline')}>Play Offline (Local)</button>
      <button className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black" onClick={() => onSelect('online')}>Play Online with Friend</button>
    </div>
  )
}


