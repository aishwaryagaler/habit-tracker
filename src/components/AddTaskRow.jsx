// src/components/AddTaskRow.jsx
// Expandable "+ Add a task" row with two-step flow: title → type
import React from 'react';
import { useState, useRef, useEffect } from 'react'

export default function AddTaskRow({ onAdd }) {
  const [step,  setStep]  = useState('idle')   // 'idle' | 'typing' | 'choosing'
  const [title, setTitle] = useState('')
  const [busy,  setBusy]  = useState(false)
  const inputRef = useRef(null)

  // Auto-focus input when step becomes 'typing'
  useEffect(() => {
    if (step === 'typing') inputRef.current?.focus()
  }, [step])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && title.trim()) setStep('choosing')
    if (e.key === 'Escape') reset()
  }

  async function handleChoose(type) {
    if (!title.trim() || busy) return
    setBusy(true)
    await onAdd(title, type)
    reset()
    setBusy(false)
  }

  function reset() {
    setStep('idle')
    setTitle('')
  }

  // ── Idle ──
  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('typing')}
        className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl border-2 border-dashed border-stone-200
                   text-stone-400 text-sm hover:border-stone-300 hover:text-stone-500
                   transition-all duration-150 group"
      >
        <span className="w-6 h-6 rounded-full border-2 border-stone-300 flex items-center justify-center
                         text-stone-300 group-hover:border-stone-400 group-hover:text-stone-400 transition-colors text-base leading-none">
          +
        </span>
        Add a task
      </button>
    )
  }

  // ── Typing ──
  if (step === 'typing') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 px-5 py-4 animate-slide-up">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full border-2 border-stone-300 flex-shrink-0" />
          <input
            ref={inputRef}
            className="flex-1 text-sm text-stone-700 placeholder-stone-300 outline-none bg-transparent"
            placeholder="What's the habit?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => title.trim() && setStep('choosing')}
            disabled={!title.trim()}
            className="text-xs font-medium text-stone-500 hover:text-stone-800 disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
        <p className="text-xs text-stone-300 mt-2 ml-9">Press Enter to continue · Esc to cancel</p>
      </div>
    )
  }

  // ── Choosing type ──
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 px-5 py-4 animate-slide-up">
      <p className="text-xs font-medium text-stone-400 mb-3">
        "<span className="text-stone-600">{title}</span>" — is this for:
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleChoose('everyday')}
          disabled={busy}
          className="flex-1 py-2.5 rounded-xl border-2 border-stone-200 text-sm font-medium text-stone-600
                     hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700
                     transition-all disabled:opacity-50"
        >
          ∞ Every day
        </button>
        <button
          onClick={() => handleChoose('one-day')}
          disabled={busy}
          className="flex-1 py-2.5 rounded-xl border-2 border-stone-200 text-sm font-medium text-stone-600
                     hover:border-stone-400 hover:bg-stone-50
                     transition-all disabled:opacity-50"
        >
          1× Today only
        </button>
      </div>
      <button onClick={reset} className="text-xs text-stone-300 mt-3 hover:text-stone-500 transition-colors">
        ← Cancel
      </button>
    </div>
  )
}
