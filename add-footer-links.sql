create table if not exists footer_links (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  url text not null,
  sort_order integer default 0,
  enabled boolean default true,
  created_at timestamp with time zone default now()
);

-- Allow public read
alter table footer_links enable row level security;
create policy "Public can read footer_links" on footer_links for select using (true);
create policy "Authenticated can manage footer_links" on footer_links for all using (auth.role() = 'authenticated');
