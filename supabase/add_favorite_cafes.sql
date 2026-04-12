-- Migration: add favorite_cafes to users
-- Run in Supabase SQL Editor

alter table public.users
  add column if not exists favorite_cafes text[] not null default '{}';
