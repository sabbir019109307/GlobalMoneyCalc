-- Keep each user's saved calculator results private and available across devices.
create table if not exists public.saved_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  local_id text not null,
  calculation_type text not null check (calculation_type in ('currency','salary','budget','savings')),
  result text not null,
  input_values jsonb not null default '{}'::jsonb,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, local_id)
);

alter table public.saved_calculations enable row level security;

drop policy if exists "Users manage own saved calculations" on public.saved_calculations;
create policy "Users manage own saved calculations"
on public.saved_calculations
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.saved_calculations to authenticated;
