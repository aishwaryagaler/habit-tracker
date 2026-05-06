// src/hooks/useAuth.js
// Subscribes to Supabase auth state changes and exposes login/signup/logout

import { useState, useEffect } from 'react'
import { supabase, usernameToEmail } from '../lib/supabase'

export function useAuth() {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)   // true while checking session

  // Listen to auth state changes (login, logout, token refresh)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Sign Up ──────────────────────────────────────────────────────────────
  async function signUp(username, password) {
    const email = usernameToEmail(username)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Skip email confirmation — user is logged in immediately
        emailRedirectTo: undefined,
        data: { username },          // store original username in user metadata
      },
    })

    if (error) throw error
  }

  // ── Sign In ──────────────────────────────────────────────────────────────
  async function signIn(username, password) {
    const email = usernameToEmail(username)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  // ── Sign Out ─────────────────────────────────────────────────────────────
  async function signOut() {
    await supabase.auth.signOut()
  }

  // Extract the display username from the email (strip @habitly.app)
  const username = user?.user_metadata?.username
    || user?.email?.split('@')[0]
    || null

  return { user, username, loading, signUp, signIn, signOut }
}
