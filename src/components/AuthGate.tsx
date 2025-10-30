import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signup, login, loginWithGoogle, continueAsGuest } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  if (loading) return <div className="min-h-screen grid place-items-center text-white">Loading...</div>
  if (user) return <>{children}</>

  const handle = async () => {
    setError('')
    try {
      if (isSignup) {
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
    } catch (e: any) {
      setError(e?.message || 'Authentication error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-fuchsia-900 to-pink-900 p-6 grid place-items-center">
      <div className="w-full max-w-md rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl p-6 text-white">
        <h1 className="text-2xl font-black mb-4">Cric-Tac</h1>
        <div className="space-y-3">
          {isSignup && (
            <input className="w-full rounded-lg p-3 bg-white/10 border-2 border-white/20" placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <input className="w-full rounded-lg p-3 bg-white/10 border-2 border-white/20" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-lg p-3 bg-white/10 border-2 border-white/20" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <div className="text-red-300 text-sm font-bold">{error}</div>}
          <button className="w-full rounded-lg p-3 bg-emerald-600 hover:bg-emerald-500 font-black" onClick={handle}>{isSignup ? 'Sign up' : 'Log in'}</button>
          <button className="w-full rounded-lg p-3 bg-sky-600 hover:bg-sky-500 font-black" onClick={() => loginWithGoogle()}>Continue with Google</button>
          <button className="w-full rounded-lg p-3 bg-gray-700 hover:bg-gray-600 font-black" onClick={() => continueAsGuest()}>Continue as Guest</button>
          <button className="w-full rounded-lg p-3 bg-white/10 border-2 border-white/20" onClick={() => setIsSignup(s => !s)}>
            {isSignup ? 'Have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}


