// src/lib/supabase.js
// Initializes and exports the Supabase client

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    '❌ Missing Supabase env vars.\n' +
    'Copy .env.example → .env and fill in your credentials.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Helper: convert username → fake email used with Supabase Auth ──
// e.g.  "aish"  →  "aish@habitly.app"
export function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@habitly.app`
}
