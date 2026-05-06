// src/pages/AuthPage.jsx
// Minimal login / sign-up screen
import React from 'react';
import { useState } from 'react'

export default function AuthPage({ onSignIn, onSignUp }) {
  const [mode,     setMode]     = useState('login')    // 'login' | 'signup'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [busy,     setBusy]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Please fill in both fields.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'login') {
        await onSignIn(username, password)
      } else {
        await onSignUp(username, password)
      }
    } catch (err) {
      // Make Supabase errors beginner-friendly
      const msg = err.message || 'Something went wrong.'
      if (msg.includes('Invalid login')) setError('Wrong username or password.')
      else if (msg.includes('already registered')) setError('Username already taken. Try logging in.')
      else setError(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-stone-800 mb-1">Habitly</h1>
          <p className="text-stone-400 text-sm">Build habits that stick.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">

          <h2 className="text-lg font-semibold text-stone-700 mb-6">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5 ml-1">
                Username
              </label>
              <input
                className="auth-input"
                type="text"
                placeholder="e.g. aish, user123"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5 ml-1">
                Password
              </label>
              <input
                className="auth-input"
                type="password"
                placeholder="any password works"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button className="btn-primary mt-2" type="submit" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <div className="mt-5 text-center">
            {mode === 'login' ? (
              <p className="text-stone-400 text-sm">
                No account?{' '}
                <button className="btn-ghost" onClick={() => { setMode('signup'); setError('') }}>
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-stone-400 text-sm">
                Already have one?{' '}
                <button className="btn-ghost" onClick={() => { setMode('login'); setError('') }}>
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-stone-300 text-xs mt-6">
          No email needed · No verification
        </p>
      </div>
    </div>
  )
}
