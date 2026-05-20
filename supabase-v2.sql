-- ─────────────────────────────────────────────────────────────
-- Cevop Marketing Site — Supabase Schema Update V2
-- Run this in: Supabase dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────

-- 1. Sponsors (Social Proof)
create table if not exists sponsors (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  logo_url     text not null default '',
  font_weight  text not null default 'font-bold',
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- 2. Static Pages (About, Privacy, Terms, etc)
create table if not exists pages (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  content      text not null,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Row Level Security
alter table sponsors enable row level security;
alter table pages enable row level security;

create policy "Public read sponsors" on sponsors for select using (is_active = true);
create policy "Public read pages"    on pages    for select using (is_published = true);

-- Insert Default Pages if they don't exist
insert into pages (slug, title, content) values
('about', 'About Us', 'Built for the modern restaurant.\n\nCevop was founded with a simple mission: to give restaurant owners the same powerful tools that global chains use, without the complexity or high costs.'),
('privacy', 'Privacy Policy', '# Privacy Policy\n\nYour privacy is important to us. This policy explains how we handle your data.'),
('terms', 'Terms of Service', '# Terms of Service\n\nBy using Cevop, you agree to these terms.')
on conflict (slug) do nothing;
