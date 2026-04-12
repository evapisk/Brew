-- ============================================================
-- BREW — Supabase Schema
-- Run this in the Supabase SQL Editor to bootstrap the project
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";


-- ─────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────
create table public.users (
  id              uuid primary key default gen_random_uuid(),
  auth_id         uuid unique references auth.users(id) on delete cascade,
  email           text unique not null,
  name            text not null,
  university      text not null,
  year            smallint not null check (year between 1 and 6),  -- 1-4 undergrad, 5-6 grad
  goals           text[] not null default '{}',
  skills_offer    text[] not null default '{}',
  skills_want     text[] not null default '{}',
  organizations   text[] not null default '{}',
  partner_id      uuid references public.users(id) on delete set null,
  is_active       boolean not null default true,
  onboarded       boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index for fast "find all users at my university" queries
create index users_university_idx on public.users(university);
create index users_active_idx    on public.users(is_active);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();


-- ─────────────────────────────────────────
-- MATCHES
-- ─────────────────────────────────────────
create table public.matches (
  id              uuid primary key default gen_random_uuid(),
  user_a_id       uuid not null references public.users(id) on delete cascade,
  user_b_id       uuid not null references public.users(id) on delete cascade,
  score           integer not null,
  breakdown       jsonb not null default '{}',
  match_reason    text,                -- AI-generated explanation
  agenda          text[] default '{}', -- AI-generated chat questions
  status          text not null default 'pending'
                    check (status in ('pending', 'accepted', 'declined', 'completed')),
  created_at      timestamptz not null default now(),

  -- prevent duplicate pairs regardless of order
  constraint no_self_match check (user_a_id <> user_b_id),
  constraint unique_pair unique (
    least(user_a_id, user_b_id),
    greatest(user_a_id, user_b_id)
  )
);

create index matches_user_a_idx on public.matches(user_a_id);
create index matches_user_b_idx on public.matches(user_b_id);


-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

alter table public.users   enable row level security;
alter table public.matches enable row level security;

-- Users: read any active profile, write only your own
create policy "Anyone can read active users"
  on public.users for select
  using (is_active = true);

create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = auth_id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = auth_id);

-- Matches: only see matches you're part of
create policy "Users see their own matches"
  on public.matches for select
  using (
    auth.uid() = (select auth_id from public.users where id = user_a_id)
    or
    auth.uid() = (select auth_id from public.users where id = user_b_id)
  );

-- Only the server (service role) inserts matches
-- No insert policy for anon/authenticated — use service role key server-side


-- ─────────────────────────────────────────
-- HELPER: get both sides of a user's matches
-- ─────────────────────────────────────────
create or replace function public.get_match_history(p_user_id uuid)
returns setof public.matches language sql security definer as $$
  select * from public.matches
  where user_a_id = p_user_id or user_b_id = p_user_id;
$$;
