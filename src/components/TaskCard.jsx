// src/components/TaskCard.jsx
// A single task row: circular checkbox + title + delete
import React from 'react';
import { useState } from 'react'

export default function TaskCard({ task, done, onToggle, onDelete }) {
  const [toggling, setToggling] = useState(false)

  async function handleToggle() {
    if (toggling) return
    setToggling(true)
    await onToggle(task.id)
    setToggling(false)
  }

  return (
    <div className={`habit-card animate-slide-up group ${done ? 'opacity-80' : ''}`}>

      {/* ── Circular Checkbox ── */}
      <button
        onClick={handleToggle}
        className={`habit-check ${done ? 'done animate-pop' : ''}`}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
      >
        {done && (
          <svg className="w-3 h-3 text-white animate-check" viewBox="0 0 12 10" fill="none">
            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* ── Task Title ── */}
      <span className={`flex-1 text-sm font-medium ${done ? 'line-through text-stone-400' : 'text-stone-700'} transition-colors`}>
        {task.title}
      </span>

      {/* ── Type Badge ── */}
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
        task.type === 'daily'
          ? 'bg-amber-50 text-amber-600'
          : 'bg-stone-100 text-stone-400'
      }`}>
        {task.type === 'daily' ? '∞ daily' : '1× today'}
      </span>

      {/* ── Delete (visible on hover) ── */}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 ml-1 text-stone-300 hover:text-red-400 transition-all text-lg leading-none"
        title="Delete"
      >
        ×
      </button>

    </div>
  )
}
