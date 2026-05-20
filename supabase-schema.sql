-- ─────────────────────────────────────────────────────────────
-- Cevop Marketing Site — Supabase Schema
-- Run this once in: Supabase dashboard → SQL Editor → New Query
-- These tables are for the marketing site only, separate from the app
-- ─────────────────────────────────────────────────────────────

-- 1. Key-value content (hero text, social links, nav URLs)
create table if not exists site_content (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- 2. Pricing plans
create table if not exists pricing_plans (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  tagline        text not null default '',
  price_ngn      text not null default '',
  price_gbp      text not null default '',
  price_suffix   text not null default '',
  features       jsonb not null default '[]',
  cta_text       text not null default 'Get Started',
  cta_variant    text not null default 'secondary',
  is_popular     boolean not null default false,
  is_highlighted boolean not null default false,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);

-- 3. FAQs
create table if not exists faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. Testimonials
create table if not exists testimonials (
  id              uuid primary key default gen_random_uuid(),
  quote           text not null,
  author_name     text not null,
  author_title    text not null default '',
  author_location text not null default '',
  is_active       boolean not null default true,
  is_featured     boolean not null default false,
  created_at      timestamptz not null default now()
);

-- 5. Blog posts
create table if not exists blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text not null default '',
  content      text not null default '',
  is_published boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx       on blog_posts(slug);
create index if not exists blog_posts_published_idx  on blog_posts(is_published, published_at desc);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- Anon key (public site): read-only, only published/active rows
-- Service role (admin panel): bypasses RLS automatically
-- ─────────────────────────────────────────────────────────────
alter table site_content  enable row level security;
alter table pricing_plans enable row level security;
alter table faqs          enable row level security;
alter table testimonials  enable row level security;
alter table blog_posts    enable row level security;

create policy "Public read site_content"  on site_content  for select using (true);
create policy "Public read pricing_plans" on pricing_plans for select using (true);
create policy "Public read faqs"          on faqs          for select using (is_active = true);
create policy "Public read testimonials"  on testimonials  for select using (is_active = true);
create policy "Public read blog_posts"    on blog_posts    for select using (is_published = true);
