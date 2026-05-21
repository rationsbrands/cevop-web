-- ─────────────────────────────────────────────────────────────
-- Cevop Marketing Site — Supabase Fix Permissions
-- Run this in: Supabase dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────

-- Grant table permissions
grant all on table site_content to anon, authenticated, service_role;
grant all on table pricing_plans to anon, authenticated, service_role;
grant all on table faqs to anon, authenticated, service_role;
grant all on table testimonials to anon, authenticated, service_role;
grant all on table blog_posts to anon, authenticated, service_role;
grant all on table sponsors to anon, authenticated, service_role;
grant all on table pages to anon, authenticated, service_role;

-- Grant sequence permissions (if they were created automatically for ID, though we use uuid, so this might not be needed, but good practice)
grant usage on schema public to anon, authenticated, service_role;
