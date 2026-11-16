-- ============================================================
--  STEP CHALLENGE — run this once in Supabase → SQL Editor.
--  Anyone can read (for the public leaderboard);
--  only logged-in users can add, edit or delete.
-- ============================================================

create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create table public.steps (
  client_id  uuid not null references public.clients(id) on delete cascade,
  day        int  not null check (day between 1 and 30),
  steps      int  not null check (steps >= 0),
  updated_at timestamptz not null default now(),
  primary key (client_id, day)
);

alter table public.clients enable row level security;
alter table public.steps   enable row level security;

create policy "Anyone can view clients" on public.clients for select using (true);
create policy "Anyone can view steps"   on public.steps   for select using (true);

create policy "Coach manages clients" on public.clients for all to authenticated using (true) with check (true);
create policy "Coach manages steps"   on public.steps   for all to authenticated using (true) with check (true);

grant select on public.clients, public.steps to anon, authenticated;
grant insert, update, delete on public.clients, public.steps to authenticated;
