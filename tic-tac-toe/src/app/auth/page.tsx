'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, signIn, signInWithGoogle, signInAsGuest, user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if already signed in
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      // Wait a bit for auth state to update, then redirect
      setTimeout(() => {
        router.push('/')
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      // Wait a bit for auth state to update, then redirect
      setTimeout(() => {
        router.push('/')
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  const handleGuestAuth = async () => {
    setError('')
    setLoading(true)
    try {
      await signInAsGuest()
      // Wait a bit for auth state to update, then redirect
      setTimeout(() => {
        router.push('/')
      }, 100)
    } catch (err: any) {
      setError(err.message || 'Guest sign-in failed')
      setLoading(false)
    }
  }

  // Show loading if checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg sm:text-xl md:text-2xl font-black">Loading...</div>
      </div>
    )
  }

  // Redirect if already signed in (handled by useEffect, but show loading while redirecting)
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg sm:text-xl md:text-2xl font-black">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-20 border-b border-white/10 backdrop-blur-lg bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <span className="text-xl font-bold text-white">Cric-Tac</span>
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-md mx-auto relative z-10 px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* Auth Form */}
        <div className="w-full rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-8 text-white">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-500">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp
                ? 'Create an account to play online'
                : 'Sign in to your account or continue as guest'}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false)
                setError('')
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                !isSignUp
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/50'
                  : 'bg-slate-700/50 text-slate-300 border border-white/10'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true)
                setError('')
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isSignUp
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-700/50 text-slate-300 border border-white/10'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg p-3 bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800 transition-all duration-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full rounded-lg p-3 bg-slate-800/50 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:bg-slate-800 transition-all duration-300"
            />
            {error && <p className="text-sm text-red-400 font-semibold bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-lg p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 font-bold text-white shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isSignUp ? 'Signing up...' : 'Signing in...'}
                </span>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/80 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full rounded-lg p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-bold text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            Google
          </button>

          <button
            type="button"
            className="w-full rounded-lg p-3 bg-slate-800/50 border border-white/10 text-white font-semibold hover:bg-slate-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGuestAuth}
            disabled={loading}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  )
}

