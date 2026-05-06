# 🌱 Habitly — Habit Tracker App

A minimal, beautiful habit tracker built with **React + Vite + Tailwind CSS + Supabase**.

---

## 📁 Folder Structure

```
habit-tracker-supabase/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example              ← copy to .env with your Supabase keys
├── supabase_setup.sql        ← run this in Supabase SQL editor
└── src/
    ├── main.jsx
    ├── App.jsx               ← root: routing between pages
    ├── index.css             ← Tailwind + custom component classes
    ├── lib/
    │   └── supabase.js       ← Supabase client + username→email helper
    ├── hooks/
    │   ├── useAuth.js        ← auth state, login, signup, logout
    │   └── useTasks.js       ← tasks + logs CRUD with Supabase
    ├── pages/
    │   ├── AuthPage.jsx      ← login / signup screen
    │   ├── DatePickerPage.jsx← first-login date picker
    │   └── TrackerPage.jsx   ← main habit tracker screen
    └── components/
        ├── DateHeader.jsx    ← top header showing date + user
        ├── DateSwitcherModal.jsx ← date change overlay
        ├── TaskCard.jsx      ← individual habit row
        └── AddTaskRow.jsx    ← expandable add-task input
```

---

## 🚀 Setup: Step by Step

### Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up (free)
2. Click **New project**
3. Fill in name and database password → **Create project**
4. Wait ~2 minutes for it to be ready

### Step 2 — Disable Email Verification

This lets users log in instantly without confirming their email.

1. In Supabase: go to **Authentication → Settings**
2. Under **Email Auth**, find **"Confirm email"**
3. Toggle it **OFF**
4. Click **Save**

### Step 3 — Run the SQL (create tables + security)

1. In Supabase: go to **SQL Editor → New Query**
2. Open `supabase_setup.sql` from this project
3. Paste the entire contents
4. Click **Run**
5. You should see "Success. No rows returned."

### Step 4 — Get your API Keys

1. In Supabase: go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **anon / public** key (long string starting with `eyJ...`)

### Step 5 — Configure the app

```bash
# In the project folder:
cp .env.example .env
```

Open `.env` and fill in your keys:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

### Step 6 — Install and run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Open in browser:
# http://localhost:5173
```

---

## 🎯 How the App Works

| Screen | When shown |
|--------|-----------|
| **Auth (login/signup)** | Not logged in |
| **Date Picker** | First login — no date saved yet |
| **Tracker** | Logged in + date selected |

**Username system:** You type `aish` → stored internally as `aish@habitly.app` in Supabase. Users never see this email. Passwords have no strength requirements.

**Task types:**
- **Daily** — appears on every date you view
- **One-time** — only appears on the date it was created

**Completion:** Stored in `task_logs` table. Each task × date pair has one row. Clicking the checkbox upserts this row.

---

## 🔒 Security

- Row Level Security (RLS) ensures users can only see/edit their own data
- Even if someone gets the anon key, they can't read other users' habits
- Passwords are handled entirely by Supabase Auth (bcrypt hashed)
