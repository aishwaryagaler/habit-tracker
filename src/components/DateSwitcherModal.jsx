// src/components/DateSwitcherModal.jsx
// Modal overlay to pick a different date
import React from 'react';
import { useState } from 'react'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export default function DateSwitcherModal({ current, onSelect, onClose }) {
  const [year,  setYear]  = useState(current.getFullYear())
  const [month, setMonth] = useState(current.getMonth())
  const [day,   setDay]   = useState(current.getDate())

  const today  = new Date()
  const years  = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i)
  const maxDay = daysInMonth(year, month)

  function handleMonthChange(m) {
    setMonth(m)
    if (day > daysInMonth(year, m)) setDay(daysInMonth(year, m))
  }

  function handleConfirm() {
    onSelect(new Date(year, month, day))
    onClose()
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-xl p-6 pb-8 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-stone-700">Switch date</h3>
          <button onClick={onClose} className="text-stone-300 hover:text-stone-600 text-xl leading-none">×</button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {/* Month */}
          <div className="col-span-1">
            <label className="block text-xs text-stone-400 mb-1">Month</label>
            <select className="auth-input text-xs" value={month} onChange={e => handleMonthChange(Number(e.target.value))}>
              {MONTHS.map((n, i) => <option key={i} value={i}>{n.slice(0,3)}</option>)}
            </select>
          </div>
          {/* Day */}
          <div className="col-span-1">
            <label className="block text-xs text-stone-400 mb-1">Day</label>
            <select className="auth-input text-xs" value={day} onChange={e => setDay(Number(e.target.value))}>
              {Array.from({ length: maxDay }, (_, i) => i + 1).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          {/* Year */}
          <div className="col-span-1">
            <label className="block text-xs text-stone-400 mb-1">Year</label>
            <select className="auth-input text-xs" value={year} onChange={e => setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { onSelect(new Date()); onClose() }}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-500
                       hover:bg-stone-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl bg-stone-800 text-white text-sm font-medium
                       hover:bg-stone-700 transition-colors"
          >
            Go →
          </button>
        </div>
      </div>
    </div>
  )
}
