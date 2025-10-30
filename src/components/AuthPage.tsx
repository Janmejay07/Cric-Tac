import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AuthForm from './AuthForm'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>(params.get('mode') === 'signup' ? 'signup' : 'login')
  const { user, loading } = useAuth()

  useEffect(() => {
    const m = params.get('mode')
    setMode(m === 'signup' ? 'signup' : 'login')
  }, [params])

  // Redirect to landing after successful login/signup
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true })
    }
  }, [loading, user, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-fuchsia-900 to-pink-900 py-8 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
      <div className="max-w-3xl mx-auto relative z-10 text-center text-white">
        <button className="px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 font-bold mb-6" onClick={() => navigate('/')}>← Back to Home</button>
        <AuthForm defaultMode={mode} />
      </div>
    </div>
  )
}


