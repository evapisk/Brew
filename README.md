# Brew ☕

> Tinder for coffee chats. Match with peers who have what you need — and need what you have.

Built for the **Claude Code × Columbia/NYU Hackathon**.

---

## What it is

Brew is a mobile-first web app that matches college students for skill-swap coffee chats. You paste your resume and describe your goals — Claude parses it, tags your skills, and finds peers whose strengths complement yours. Swipe to connect, then chat and plan a meetup.

---

## Features

- **AI-powered onboarding** — paste your resume and goals, Claude extracts your skill tags, goal tags, year, university, and orgs automatically
- **Scoring engine** — ranks every candidate by shared goals, complementary skills (what you offer ↔ what they want), year proximity, and weak-tie bonuses
- **Claude-generated match cards** — personalized explanation of why you'd vibe + a 3-question coffee chat agenda for every pair
- **Swipe UI** — accept or pass on recommendations; only accepted matches proceed
- **Real-time chat** — messaging between connected users via Supabase Realtime
- **Linkup integration** — each conversation surfaces nearby coffee shops and campus events to help you actually meet up
- **Match history & reset** — view all your connections, reset and rediscover anytime

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Auth & DB | Supabase (Postgres, RLS, Realtime) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Local recs | Linkup API |
| Deployment | Vercel |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/evapisk/Brew.git
cd Brew
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
LINKUP_API_KEY=your_linkup_api_key
```

### 3. Set up the database

Run the following in your Supabase SQL editor:

```sql
-- Users table (extends Supabase auth)
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id) on delete cascade,
  name text, email text, university text,
  year int, goals text[], skills_offer text[], skills_want text[],
  organizations text[], onboarded boolean default false,
  partner_id uuid references public.users(id),
  created_at timestamptz default now()
);

-- Matches table
create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid references public.users(id) on delete cascade,
  user_b_id uuid references public.users(id) on delete cascade,
  score int, breakdown jsonb, match_reason text, agenda text[],
  status text default 'pending',
  created_at timestamptz default now(),
  unique(user_a_id, user_b_id)
);

-- Messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references public.matches(id) on delete cascade,
  sender_id uuid references public.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.matches enable row level security;
alter table public.messages enable row level security;
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How matching works

Matches are scored on several dimensions:

| Signal | Points |
|---|---|
| Shared goal tag | +30 each |
| Shared goal category | +15 each |
| A offers a skill B wants | +35 each |
| Mutual skill exchange | +80 bonus |
| Same year | +15 |
| Same school | +10 |
| One shared org (weak tie) | +10 |
| 2+ shared orgs (friend group) | filtered out |
| Already accepted/declined | filtered out |

Scores are normalized to a percentage for display.

---

## Project structure

```
app/
  (pages)/          — discover, matches, messages, profile, onboarding
  api/
    match/          — find matches, update status, history, reset
    messages/       — send & fetch chat messages
    onboard/        — AI resume parser, profile save
    linkup/         — coffee shop & event recommendations
    auth/           — sign up, sign in, profile creation
components/
  PhoneShell.tsx    — phone frame wrapper + bottom nav
  BottomNav.tsx     — tab bar
  MatchStrengthBadge.tsx
lib/
  matching.js       — scoring engine + Claude match explanation
  tags.js           — goal and skill taxonomy
  supabase.js       — client helpers
```

---

## Built with Claude Code

This project was built end-to-end using [Claude Code](https://claude.ai/code) — Anthropic's agentic CLI tool — as the primary development environment.
