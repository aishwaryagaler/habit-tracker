// src/App.jsx
// Root: decides which page to show based on auth state + date selection
import React from 'react'
devicePixelRatio
import { useState, useEffect } from 'react'
import { useAuth }       from './hooks/useAuth'
import AuthPage          from './pages/AuthPage'
import DatePickerPage    from './pages/DatePickerPage'
import TrackerPage       from './pages/TrackerPage'

// LocalStorage key for persisting selected date per user
function dateKey(userId) { return `habitly_date_${userId}` }

function loadDate(userId) {
  try {
    const raw = localStorage.getItem(dateKey(userId))
    if (!raw) return null
    const d = new Date(raw)
    return isNaN(d.getTime()) ? null : d
  } catch { return null }
}

function saveDate(userId, date) {
  localStorage.setItem(dateKey(userId), date.toISOString())
}

export default function App() {
  const { user, username, loading, signIn, signUp, signOut } = useAuth()

  // null = not chosen yet (first login), Date = chosen
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateLoaded,   setDateLoaded]   = useState(false)

  // When user changes, load their saved date (or default to today)
  useEffect(() => {
    if (!user) { setSelectedDate(null); setDateLoaded(false); return }

    const saved = loadDate(user.id)
    if (saved) {
      // Returning user → default to today, not their old saved date
      setSelectedDate(new Date())
    }
    // If no saved date: stay null → show DatePickerPage
    setDateLoaded(true)
  }, [user])

  function handleDateSelect(date) {
    setSelectedDate(date)
    if (user) saveDate(user.id, date)
  }

  function handleChangeDate(date) {
    setSelectedDate(date)
    if (user) saveDate(user.id, date)
  }

  // ── Loading splash ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display text-3xl text-stone-300 animate-pulse">Habitly</p>
      </div>
    )
  }

  // ── Not logged in ──
  if (!user) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />
  }

  // ── Logged in but date not yet loaded ──
  if (!dateLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-300 text-sm animate-pulse">Loading…</p>
      </div>
    )
  }

  // ── First-time: pick a date ──
  if (!selectedDate) {
    return <DatePickerPage onSelect={handleDateSelect} />
  }

  // ── Main tracker ──
  return (
    <TrackerPage
      user={user}
      username={username}
      selectedDate={selectedDate}
      onChangeDate={handleChangeDate}
      onSignOut={signOut}
    />
  )
}
