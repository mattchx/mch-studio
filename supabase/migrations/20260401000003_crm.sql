-- CRM: brand tagging + contacts table
-- Adds brand awareness to clients and a lightweight contacts table for leads

-- 1. Add brand to clients (default all existing to mch_projects)
alter table clients add column brand text not null default 'mch_projects'
  check (brand in ('mch_projects', 'mch_labs'));

create index idx_clients_brand on clients(brand);

-- 2. Expand pipeline_status to include MCH Labs stages
-- (only 'lead' is new — 'active' and 'churned' already exist)
alter table clients drop constraint clients_pipeline_status_check;
alter table clients add constraint clients_pipeline_status_check
  check (pipeline_status in (
    'prospect', 'meeting_booked', 'deposit_paid', 'active', 'churned',
    'lead'
  ));

-- 3. Contacts table (lightweight leads from forms, lead magnets, etc.)
create table contacts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  phone text,
  brand text not null default 'mch_labs'
    check (brand in ('mch_projects', 'mch_labs')),
  status text not null default 'new'
    check (status in ('new', 'subscribed', 'engaged', 'promoted', 'unsubscribed')),
  source text,
  notes text,
  promoted_to_client_id uuid references clients(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_contacts_brand on contacts(brand);
create index idx_contacts_status on contacts(status);
create index idx_contacts_email on contacts(email);

-- 4. RLS on contacts (admin-only, same as other tables)
alter table contacts enable row level security;
create policy "admin_contacts" on contacts
  for all using (is_admin()) with check (is_admin());
