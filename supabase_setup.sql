-- ============================================================
-- Habitly — Supabase Database Setup
-- Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================


-- ── 1. TASKS TABLE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN ('daily', 'one-time')),
  date       DATE,            -- only set for one-time tasks
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast per-user lookups
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks (user_id);


-- ── 2. TASK_LOGS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  completed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each task can only have one log per day
  UNIQUE (task_id, date)
);

-- Index for fast date-based lookups
CREATE INDEX IF NOT EXISTS task_logs_task_date_idx ON task_logs (task_id, date);


-- ── 3. ROW LEVEL SECURITY ─────────────────────────────────────
-- Enable RLS on both tables
ALTER TABLE tasks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_logs ENABLE ROW LEVEL SECURITY;


-- ── Tasks policies ──

-- Users can only see their own tasks
CREATE POLICY "tasks: select own"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert tasks for themselves
CREATE POLICY "tasks: insert own"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own tasks
CREATE POLICY "tasks: update own"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own tasks
CREATE POLICY "tasks: delete own"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);


-- ── Task Logs policies ──

-- Users can only read logs for their own tasks
CREATE POLICY "task_logs: select own"
  ON task_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_logs.task_id
        AND tasks.user_id = auth.uid()
    )
  );

-- Users can only insert logs for their own tasks
CREATE POLICY "task_logs: insert own"
  ON task_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_logs.task_id
        AND tasks.user_id = auth.uid()
    )
  );

-- Users can only update logs for their own tasks
CREATE POLICY "task_logs: update own"
  ON task_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_logs.task_id
        AND tasks.user_id = auth.uid()
    )
  );

-- Users can only delete logs for their own tasks
CREATE POLICY "task_logs: delete own"
  ON task_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_logs.task_id
        AND tasks.user_id = auth.uid()
    )
  );


-- ── 4. VERIFY SETUP (optional check) ─────────────────────────
-- Uncomment to confirm tables were created:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
