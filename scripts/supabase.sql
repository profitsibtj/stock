-- This configuration intentionally allows anyone with the public anon key to
-- read and modify the shared stock data. Do not use it for private data.
create table if not exists public.stockroom_state (
  id text primary key check (id = 'main'),
  data jsonb not null default '{"products":[],"sales":[],"logs":[],"farms":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.stockroom_state enable row level security;

grant select, insert, update on public.stockroom_state to anon;

drop policy if exists "Public can access shared stockroom state" on public.stockroom_state;
create policy "Public can access shared stockroom state"
  on public.stockroom_state
  for all
  to anon
  using (true)
  with check (true);
