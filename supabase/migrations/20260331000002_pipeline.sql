-- Pipeline, follow-ups, call logs — extends clients for prospect tracking

-- Add prospect/pipeline fields to clients
alter table clients add column pipeline_status text not null default 'active'
  check (pipeline_status in ('prospect', 'meeting_booked', 'deposit_paid', 'active', 'churned'));

alter table clients add column priority text default 'medium'
  check (priority in ('high', 'medium', 'low'));

alter table clients add column speed_score integer;          -- Lighthouse score 0-100
alter table clients add column mobile_friendly boolean;
alter table clients add column google_rating text;           -- e.g. "4.9 (1282 ratings)"
alter table clients add column lost_revenue_monthly integer; -- estimated $/month
alter table clients add column lost_revenue_yearly integer;  -- estimated $/year
alter table clients add column preview_url text;             -- Cloudflare Pages URL
alter table clients add column github_repo text;             -- e.g. "mch-complete-chiropractic"
alter table clients add column audit_notes text;             -- SEO issues, speed breakdown
alter table clients add column call_script_bullets text;     -- key talking points for cold call

create index idx_clients_pipeline on clients(pipeline_status);
create index idx_clients_priority on clients(priority);

-- Follow-ups (reminders tied to a client)
create table follow_ups (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  note text not null,
  due_date timestamptz not null,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create index idx_follow_ups_client on follow_ups(client_id);
create index idx_follow_ups_due on follow_ups(due_date);
create index idx_follow_ups_pending on follow_ups(completed, due_date) where not completed;

alter table follow_ups enable row level security;
create policy "admin_follow_ups" on follow_ups for all using (is_admin()) with check (is_admin());

-- Call logs
create table call_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade not null,
  called_at timestamptz default now(),
  outcome text not null check (outcome in ('no_answer', 'left_message', 'spoke', 'meeting_booked', 'not_interested')),
  notes text,
  created_at timestamptz default now()
);

create index idx_call_logs_client on call_logs(client_id);
create index idx_call_logs_date on call_logs(called_at);

alter table call_logs enable row level security;
create policy "admin_call_logs" on call_logs for all using (is_admin()) with check (is_admin());
