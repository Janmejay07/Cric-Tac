'use client'

import Link from 'next/link'
import { Play, Zap, Users as UsersIcon, Target, Trophy, Sparkles, Globe, MonitorPlay, ArrowRight, CheckCircle2, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { user, loading, logout } = useAuth()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cric‑Tac',
    url: 'https://cric-tac.example.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cric-tac.example.com/?q={query}',
      'query-input': 'required name=query'
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center" aria-hidden>
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="sr-only">Cric‑Tac: Cricket Quiz Tic Tac Toe</span>
              <span className="text-xl font-bold text-white" aria-label="Cric‑Tac">Cric-Tac</span>
            </div>
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="px-6 py-2 rounded-lg bg-slate-700/50 text-slate-300 text-sm font-semibold">
                  Loading...
                </div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 text-white text-sm font-semibold">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {user.email || user.displayName || 'Guest User'}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await logout()
                    }}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                    <span className="sm:hidden">Out</span>
                  </button>
                </div>
              ) : (
                <Link href="/auth">
                  <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">The Ultimate Cricket Quiz Experience</span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-emerald-500 leading-tight">
              Cricket Quiz Tic Tac Toe (Cric‑Tac)
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Play Country × IPL and IPL × IPL modes using real player data
            </h2>
          </div>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Challenge your cricket knowledge in an exciting twist on the classic game. Answer questions, claim squares, and outsmart your opponent!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/offline" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 transition-all duration-300 flex items-center justify-center gap-2">
                <MonitorPlay className="w-5 h-5" />
                Play Offline
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/online" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 flex items-center justify-center gap-2">
                <Globe className="w-5 h-5" />
                Play Online
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {/* Feature 1 */}
          <div className="group relative rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-8 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">
                Jump straight into the action. No complicated setup, just pure cricket quiz gameplay.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-8 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-transparent transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Rewards</h3>
              <p className="text-slate-400 leading-relaxed">
                Answer correctly and claim your square immediately. Every correct answer gets you closer to victory!
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-8 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:to-transparent transition-all duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <UsersIcon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multiplayer Magic</h3>
              <p className="text-slate-400 leading-relaxed">
                Challenge friends locally on one device or compete online with anyone, anywhere.
              </p>
            </div>
          </div>
        </div>

        {/* Game Modes Section */}
        <div className="mt-24 grid md:grid-cols-2 gap-6">
          {/* Offline Mode */}
          <div className="relative rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 backdrop-blur-xl p-8 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <MonitorPlay className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Offline Mode</h3>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Perfect for playing with friends and family on the same device. Take turns answering questions and claiming squares.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>No internet required</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Hot-seat multiplayer</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>Instant game start</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Online Mode */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 backdrop-blur-xl p-8 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Online Mode</h3>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Create or join a room and play with friends remotely. Share a Room ID and start competing in real-time!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>Real-time multiplayer</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>Easy room creation</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span>Play from anywhere</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats/Trophy Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20 backdrop-blur-xl p-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Trophy className="w-8 h-8 text-orange-400" />
            <h3 className="text-2xl font-bold text-white">Ready to Test Your Cricket Knowledge?</h3>
            <Trophy className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            From classic cricket history to modern-day legends, our quiz questions will challenge even the biggest cricket fans. Pick your mode and start playing now!
          </p>
        </div>
      </div>
    </div>
  )
}
