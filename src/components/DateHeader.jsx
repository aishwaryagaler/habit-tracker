// src/components/DateHeader.jsx
// Shows the selected date with a button to change it
import React from 'react';
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function DateHeader({ date, onChangeDate, username, onSignOut }) {
  if (!date) return null

  const label     = `${SHORT_MONTHS[date.getMonth()]} ${date.getDate()}`
  const dayName   = DAYS[date.getDay()]
  const isToday   = new Date().toDateString() === date.toDateString()

  return (
    <header className="flex items-start justify-between mb-8">
      <div>
        <p className="text-xs font-medium text-stone-400 mb-0.5 uppercase tracking-widest">
          {isToday ? 'Today' : dayName}
        </p>
        <button
          onClick={onChangeDate}
          className="font-display text-4xl text-stone-800 hover:text-stone-600 transition-colors
                     group flex items-baseline gap-2"
          title="Change date"
        >
          {label}
          <span className="text-base font-sans text-stone-300 group-hover:text-stone-400 transition-colors">
            ↓
          </span>
        </button>
      </div>

      {/* User info + logout */}
      <div className="flex flex-col items-end gap-1 pt-1">
        <span className="text-sm font-medium text-stone-500">@{username}</span>
        <button
          onClick={onSignOut}
          className="text-xs text-stone-300 hover:text-stone-500 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
