// src/pages/TrackerPage.jsx
// Main screen: header + task list + add task
import React from 'react';
import { useState } from 'react'
import DateHeader       from '../components/DateHeader'
import DateSwitcherModal from '../components/DateSwitcherModal'
import TaskCard         from '../components/TaskCard'
import AddTaskRow       from '../components/AddTaskRow'
import { useTasks }     from '../hooks/useTasks'

export default function TrackerPage({ user, username, selectedDate, onChangeDate, onSignOut }) {
  const [showSwitcher, setShowSwitcher] = useState(false)
  const { tasks, logs, loading, addTask, toggleTask, deleteTask } = useTasks(user.id, selectedDate)

  // Separate done/undone for ordering (undone first)
  const undone = tasks.filter(t => !logs[t.id])
  const done   = tasks.filter(t =>  logs[t.id])
  const ordered = [...undone, ...done]

  const doneCount  = done.length
  const totalCount = tasks.length
  const progress   = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100)

  return (
    <div className="min-h-screen px-4 py-10 max-w-lg mx-auto animate-fade-in">

      {/* ── Header ── */}
      <DateHeader
        date={selectedDate}
        onChangeDate={() => setShowSwitcher(true)}
        username={username}
        onSignOut={onSignOut}
      />

      {/* ── Progress bar ── */}
      {totalCount > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-stone-400 mb-1.5">
            <span>{doneCount} of {totalCount} done</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-700 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Task List ── */}
      <div className="space-y-2.5 mb-4">
        {loading ? (
          // Skeleton loader
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 rounded-2xl bg-stone-100 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
          ))
        ) : ordered.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-4xl mb-3">🌱</p>
            <p className="text-stone-400 text-sm">No habits yet for this day.</p>
            <p className="text-stone-300 text-xs mt-1">Add one below to get started.</p>
          </div>
        ) : (
          ordered.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              done={!!logs[task.id]}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      {/* ── Add Task ── */}
      <AddTaskRow onAdd={addTask} />

      {/* ── Date Switcher Modal ── */}
      {showSwitcher && (
        <DateSwitcherModal
          current={selectedDate}
          onSelect={onChangeDate}
          onClose={() => setShowSwitcher(false)}
        />
      )}
    </div>
  )
}
