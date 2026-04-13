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
