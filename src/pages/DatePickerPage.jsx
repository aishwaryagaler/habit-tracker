// src/pages/DatePickerPage.jsx
// Shown only on first login — lets user pick Year / Month / Day
import React from 'react';
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export default function DatePickerPage({ onSelect }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())     // 0-indexed
  const [day,   setDay]   = useState(today.getDate())

  // Clamp day if it exceeds the new month's max days
  function handleMonthChange(m) {
    setMonth(m)
    const max = daysInMonth(year, m)
    if (day > max) setDay(max)
  }

  function handleYearChange(y) {
    setYear(y)
    const max = daysInMonth(y, month)
    if (day > max) setDay(max)
  }

  function handleConfirm() {
    // month is 0-indexed in JS Date
    onSelect(new Date(year, month, day))
  }

  const maxDay = daysInMonth(year, month)
  const years  = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm">

        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-stone-800 mb-1">Habitly</h1>
          <p className="text-stone-400 text-sm">Which date are you tracking?</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">
          <h2 className="text-base font-semibold text-stone-700 mb-6">Select a date</h2>

          {/* Year */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-400 mb-1.5 ml-1">Year</label>
            <select
              className="auth-input"
              value={year}
              onChange={e => handleYearChange(Number(e.target.value))}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Month */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-stone-400 mb-1.5 ml-1">Month</label>
            <select
              className="auth-input"
              value={month}
              onChange={e => handleMonthChange(Number(e.target.value))}
            >
              {MONTHS.map((name, i) => <option key={i} value={i}>{name}</option>)}
            </select>
          </div>

          {/* Day */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-stone-400 mb-1.5 ml-1">Day</label>
            <select
              className="auth-input"
              value={day}
              onChange={e => setDay(Number(e.target.value))}
            >
              {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={handleConfirm}>
            Start tracking →
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
