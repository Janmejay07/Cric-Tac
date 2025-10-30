import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthForm({ defaultMode = 'login' as 'login' | 'signup' }) {
  const { signup, login, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handle = async () => {
    setError('')
    try {
      if (mode === 'signup') {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
    } catch (e: any) {
      setError(e?.message || 'Authentication error')
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl p-6 text-white mx-auto">
      <div className="flex gap-2 mb-4">
        <button className={`px-4 py-2 rounded-lg font-bold ${mode==='login' ? 'bg-white/20' : 'bg-white/10 border-2 border-white/20'}`} onClick={() => setMode('login')}>Log in</button>
        <button className={`px-4 py-2 rounded-lg font-bold ${mode==='signup' ? 'bg-white/20' : 'bg-white/10 border-2 border-white/20'}`} onClick={() => setMode('signup')}>Sign up</button>
      </div>
      {mode === 'signup' && (
        <input className="w-full rounded-lg p-3 bg-white/10 border-2 border-white/20 mb-3" placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
      )}
      <input className="w-full rounded-lg p-3 bg-white/10 border-2 border-white/20 mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded-lg p-3 bg-white/10 border-2 border-white/20 mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <div className="text-red-300 text-sm font-bold mb-3">{error}</div>}
      <button className="w-full rounded-lg p-3 bg-emerald-600 hover:bg-emerald-500 font-black mb-2" onClick={handle}>{mode === 'signup' ? 'Sign up' : 'Log in'}</button>
      <button className="w-full rounded-lg p-3 bg-sky-600 hover:bg-sky-500 font-black" onClick={() => loginWithGoogle()}>Continue with Google</button>
    </div>
  )
}


