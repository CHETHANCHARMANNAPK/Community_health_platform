"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

// User interface
interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Key used to persist guest session in localStorage
const GUEST_USER_KEY = "healthcare_guest_user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)
  const [useLocalAuth, setUseLocalAuth] = useState(false)

  // Firebase instances
  const [auth, setAuth] = useState<any>(null)
  const [googleProvider, setGoogleProvider] = useState<any>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have Firebase config
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        }

        // Check if all required config values are present
        const hasValidConfig = Object.values(firebaseConfig).every(
          (value) => value && value !== "undefined" && value.trim() !== "",
        )

        if (!hasValidConfig) {
          console.log("Firebase not configured — using local guest authentication.")
          setUseLocalAuth(true)
          // Restore any previously saved guest session
          try {
            const saved = localStorage.getItem(GUEST_USER_KEY)
            if (saved) {
              const parsed = JSON.parse(saved) as User
              setUser(parsed)
              setIsAdmin(parsed.email?.includes("admin") || false)
            }
          } catch {}
          setLoading(false)
          return
        }

        // Try to initialize Firebase
        const { initializeApp, getApps, getApp } = await import("firebase/app")
        const {
          getAuth,
          GoogleAuthProvider,
          signInWithPopup,
          signOut: firebaseSignOut,
          onAuthStateChanged,
        } = await import("firebase/auth")

        // Initialize Firebase
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
        const authInstance = getAuth(app)
        const providerInstance = new GoogleAuthProvider()

        setAuth(authInstance)
        setGoogleProvider(providerInstance)
        setFirebaseInitialized(true)

        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
          if (firebaseUser) {
            const userData: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            }
            setUser(userData)
            setIsAdmin(firebaseUser.email?.includes("admin") || false)
          } else {
            setUser(null)
            setIsAdmin(false)
          }
          setLoading(false)
        })

        return unsubscribe
      } catch (err) {
        console.error("Firebase initialization failed, falling back to local auth:", err)
        setUseLocalAuth(true)
        setLoading(false)
      }
    }

    const unsubscribePromise = initializeAuth()

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe) unsubscribe()
      })
    }
  }, [])

  const signIn = async () => {
    // Local guest sign-in when Firebase is not configured
    if (useLocalAuth) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const guestUser: User = {
        uid: `guest-${Date.now()}`,
        email: "guest@healthcareplus.local",
        displayName: "Guest User",
      }

      setUser(guestUser)
      setIsAdmin(false)
      localStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser))
      setLoading(false)
      return
    }

    if (!auth || !googleProvider || !firebaseInitialized) {
      setError("Authentication is not available")
      return
    }

    try {
      setError(null)
      setLoading(true)
      const { signInWithPopup } = await import("firebase/auth")
      await signInWithPopup(auth, googleProvider)
    } catch (error: any) {
      console.error("Error signing in:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled")
      } else if (error.code === "auth/popup-blocked") {
        setError("Pop-up was blocked. Please allow pop-ups for this site.")
      } else {
        setError("Failed to sign in. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // Local guest sign-out
    if (useLocalAuth) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setUser(null)
      setIsAdmin(false)
      localStorage.removeItem(GUEST_USER_KEY)
      setLoading(false)
      return
    }

    if (!auth || !firebaseInitialized) {
      setError("Authentication is not available")
      return
    }

    try {
      setError(null)
      setLoading(true)
      const { signOut: firebaseSignOut } = await import("firebase/auth")
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
      setError("Failed to sign out")
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
