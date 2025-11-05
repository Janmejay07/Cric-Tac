import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, Firestore, initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Lazy initialization - only initialize on client side
let _app: FirebaseApp | null = null
let _auth: Auth | null = null
let _db: Firestore | null = null
let _googleProvider: GoogleAuthProvider | null = null

function getApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    return {} as FirebaseApp
  }

  if (!_app) {
    const existingApps = getApps()
    if (existingApps.length > 0) {
      _app = existingApps[0]
    } else {
      // Validate required config
      if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
        throw new Error('Missing Firebase environment variables. Please check your .env.local file.')
      }
      _app = initializeApp(firebaseConfig)
    }
  }
  return _app
}

function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    return {} as Auth
  }
  if (!_auth) {
    _auth = getAuth(getApp())
  }
  return _auth
}

function getDb(): Firestore {
  if (typeof window === 'undefined') {
    return {} as Firestore
  }
  if (!_db) {
    const appInstance = getApp()
    try {
      _db = initializeFirestore(appInstance, { experimentalForceLongPolling: true })
    } catch (error) {
      // If already initialized, get the existing instance
      _db = getFirestore(appInstance)
    }
  }
  return _db
}

function getGoogleProvider(): GoogleAuthProvider {
  if (!_googleProvider) {
    _googleProvider = new GoogleAuthProvider()
  }
  return _googleProvider
}

// Export getters that initialize on first use (lazy evaluation)
// These will only be called in client components ('use client')
export const auth = (() => {
  if (typeof window === 'undefined') return {} as Auth
  return getAuthInstance()
})()

export const db = (() => {
  if (typeof window === 'undefined') return {} as Firestore
  return getDb()
})()

export const googleProvider = getGoogleProvider()

export default (() => {
  if (typeof window === 'undefined') return {} as FirebaseApp
  return getApp()
})()

