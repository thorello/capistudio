create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;

create policy "Service role can insert contact submissions"
  on contact_submissions
  for insert
  to service_role
  with check (true);

create policy "Service role can read contact submissions"
  on contact_submissions
  for select
  to service_role
  using (true);
