import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, googleProvider } from '../services/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, updateProfile, signInAnonymously } from 'firebase/auth'

type User = {
  uid: string
  displayName: string | null
  email: string | null
  isGuest: boolean
}

type AuthContextValue = {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, displayName?: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  continueAsGuest: (name?: string) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          isGuest: false,
        })
      } else {
        const guestJson = localStorage.getItem('guest_user')
        if (guestJson) {
          const g = JSON.parse(guestJson)
          setUser(g)
        } else {
          setUser(null)
        }
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signup = async (email: string, password: string, displayName?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
  }

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const continueAsGuest = async (name?: string) => {
    const cred = await signInAnonymously(auth)
    if (cred.user && (name || !cred.user.displayName)) {
      try { await updateProfile(cred.user, { displayName: name || 'Guest' }) } catch {}
    }
    setUser({
      uid: cred.user.uid,
      displayName: cred.user.displayName || name || 'Guest',
      email: null,
      isGuest: true,
    })
  }

  const logout = async () => {
    localStorage.removeItem('guest_user')
    await signOut(auth)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(() => ({ user, loading, signup, login, loginWithGoogle, continueAsGuest, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


