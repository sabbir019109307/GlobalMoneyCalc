-- Support owner-scoped recent saved-calculation queries.
create index if not exists saved_calculations_user_saved_at_idx
on public.saved_calculations (user_id, saved_at desc);
