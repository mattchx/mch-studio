-- Command Center — full schema
-- Run in Supabase SQL editor (Dashboard > SQL Editor)

-- Admin check function (single-user auth)
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid()
    and email = 'matt@mchproj.com'
  );
$$;

-- Clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  business_name text not null,
  category text, -- e.g. 'chiropractic', 'massage', 'naturopath'
  website text,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Client AI profile (brand voice, content guidelines)
create table client_profiles (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null unique,
  brand_voice text,
  target_audience text,
  key_services text[] default '{}',
  location_context text,
  content_guidelines text,
  social_platforms text[] default '{instagram,facebook}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Content queue
create table content_items (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  content_type text not null check (content_type in ('social', 'blog', 'report', 'gbp_post', 'newsletter', 'site_update')),
  status text not null default 'pending_review' check (status in ('draft', 'pending_review', 'approved', 'published', 'rejected')),
  title text not null,
  body text,
  image_url text,
  image_prompt text,
  metadata jsonb default '{}',
  rejection_note text,
  due_date timestamptz,
  generated_at timestamptz default now(),
  reviewed_at timestamptz,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Generation job tracking (tracks agent-triggered jobs)
create table generation_jobs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  job_type text not null check (job_type in ('monthly_social', 'monthly_blog', 'monthly_report', 'monthly_gbp', 'single')),
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  config jsonb default '{}',
  error_message text,
  items_created integer default 0,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Indexes
create index idx_content_items_client on content_items(client_id);
create index idx_content_items_status on content_items(status);
create index idx_content_items_due on content_items(due_date);
create index idx_content_items_type on content_items(content_type);
create index idx_generation_jobs_client on generation_jobs(client_id);

-- RLS
alter table clients enable row level security;
alter table client_profiles enable row level security;
alter table content_items enable row level security;
alter table generation_jobs enable row level security;

create policy "admin_clients" on clients for all using (is_admin()) with check (is_admin());
create policy "admin_client_profiles" on client_profiles for all using (is_admin()) with check (is_admin());
create policy "admin_content_items" on content_items for all using (is_admin()) with check (is_admin());
create policy "admin_generation_jobs" on generation_jobs for all using (is_admin()) with check (is_admin());

-- Service role bypass (so the agent can write via service_role key)
-- Service role already bypasses RLS by default in Supabase, no extra policy needed.

-- Storage bucket for content images
insert into storage.buckets (id, name, public) values ('content-images', 'content-images', true);

create policy "admin_upload_images" on storage.objects
  for insert with check (bucket_id = 'content-images' and is_admin());

create policy "public_read_images" on storage.objects
  for select using (bucket_id = 'content-images');
