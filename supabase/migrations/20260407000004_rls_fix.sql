-- Enable RLS on subscribers and nurture_log (were missing)
alter table subscribers enable row level security;
alter table nurture_log enable row level security;

-- Admin-only policies (matching existing pattern)
create policy admin_subscribers on subscribers for all using (is_admin());
create policy admin_nurture_log on nurture_log for all using (is_admin());
