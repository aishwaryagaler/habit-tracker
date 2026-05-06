// src/hooks/useTasks.js

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Convert Date → "YYYY-MM-DD"
export function toDateStr(date) {
  return date.toISOString().split('T')[0]
}

export function useTasks(userId, selectedDate) {
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState({})
  const [loading, setLoading] = useState(false)

  const dateStr = selectedDate ? toDateStr(selectedDate) : null

  // ── Fetch tasks + logs ─────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    if (!userId || !dateStr) return
    setLoading(true)

    // Fetch all tasks for user
    const { data: allTasks, error: taskErr } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (taskErr) {
      console.error("FETCH TASK ERROR:", taskErr)
      setLoading(false)
      return
    }

    // ✅ Correct filtering
    const visible = allTasks.filter(t =>
      t.type === 'everyday' ||
      (t.type === 'one-day' && t.created_date === dateStr)
    )

    setTasks(visible)

    // Fetch logs
    if (visible.length > 0) {
      const ids = visible.map(t => t.id)

      const { data: logData, error: logErr } = await supabase
        .from('task_logs')
        .select('task_id, completed')
        .eq('date', dateStr)
        .in('task_id', ids)

      if (logErr) {
        console.error("LOG FETCH ERROR:", logErr)
      }

      const logMap = {}
      logData?.forEach(l => {
        logMap[l.task_id] = l.completed
      })

      setLogs(logMap)
    } else {
      setLogs({})
    }

    setLoading(false)
  }, [userId, dateStr])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ── Add Task ─────────────────────────────────────────
  async function addTask(title, type) {
    if (!title.trim()) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title: title.trim(),
        type: type, // must be 'one-day' or 'everyday'
        created_date: dateStr // ✅ correct column
      })
      .select()
      .single()

    if (error) {
      console.error("ADD TASK ERROR:", error)
      return
    }

    console.log("TASK ADDED:", data)

    // Optimistic UI update
    setTasks(prev => [...prev, data])
    setLogs(prev => ({ ...prev, [data.id]: false }))
  }

  // ── Toggle completion ─────────────────────────────────
  async function toggleTask(taskId) {
    const current = logs[taskId] ?? false
    const next = !current

    // Optimistic update
    setLogs(prev => ({ ...prev, [taskId]: next }))

    const { error } = await supabase
      .from('task_logs')
      .upsert(
        {
          task_id: taskId,
          date: dateStr,
          completed: next
        },
        { onConflict: 'task_id,date' }
      )

    if (error) {
      console.error("TOGGLE ERROR:", error)
      setLogs(prev => ({ ...prev, [taskId]: current }))
    }
  }

  // ── Delete task ───────────────────────────────────────
  async function deleteTask(taskId) {
    await supabase.from('task_logs').delete().eq('task_id', taskId)
    await supabase.from('tasks').delete().eq('id', taskId)

    setTasks(prev => prev.filter(t => t.id !== taskId))
    setLogs(prev => {
      const copy = { ...prev }
      delete copy[taskId]
      return copy
    })
  }

  return {
    tasks,
    logs,
    loading,
    addTask,
    toggleTask,
    deleteTask
  }
}