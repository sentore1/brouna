create table if not exists pages (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  content text default '',
  enabled boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default now()
);

alter table pages enable row level security;
create policy "Public can read pages" on pages for select using (true);
create policy "Authenticated can manage pages" on pages for all using (auth.role() = 'authenticated');
