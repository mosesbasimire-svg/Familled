-- FAMILLED — ESPACE EN LIGNE SUPABASE — TOUT-EN-UN
-- Projet: qhlrbzqlivkaiydfkkqg
-- À exécuter dans Supabase > SQL Editor.
-- Le script est conçu pour pouvoir être relancé sans recréer les données existantes.

create table if not exists public.family_members (
  id bigint generated always as identity primary key,
  name text not null unique,
  profile_url text
);
alter table public.family_members add column if not exists profile_url text;

create table if not exists public.posts (
  id bigint generated always as identity primary key,
  member_id bigint references public.family_members(id) on delete cascade,
  content text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  post_id bigint references public.posts(id) on delete cascade,
  member_id bigint references public.family_members(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.reactions (
  id bigint generated always as identity primary key,
  post_id bigint references public.posts(id) on delete cascade,
  member_id bigint references public.family_members(id) on delete cascade,
  reaction text not null,
  created_at timestamptz default now(),
  unique (post_id, member_id, reaction)
);

-- Membres de la famille
insert into public.family_members (name)
values
('Déo Vumilia Buuma'),
('Sirire Masirika Francine'),
('Ameshinda Vumilia Alliance'),
('Salama Namwangasa Yvette'),
('Buuma Vumilia Benjamin'),
('ATUKUZWE Vumilia Jonathan'),
('Basimire Vumilia Moïse'),
('Barikiwa Vumilia Angélique'),
('Bwaashi Vumilia Gloire'),
('Chisiki Vumilia Bien-aimé'),
('Furaha Vumilia Noela'),
('Asifiwe Vumilia Victoire')
on conflict (name) do nothing;

-- RLS
alter table public.family_members enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;

-- Accès aux membres
 drop policy if exists "Familled members select" on public.family_members;
create policy "Familled members select" on public.family_members
for select to authenticated using (true);

 drop policy if exists "Familled members update" on public.family_members;
create policy "Familled members update" on public.family_members
for update to authenticated using (true) with check (true);

-- Publications
 drop policy if exists "Familled posts select" on public.posts;
create policy "Familled posts select" on public.posts
for select to authenticated using (true);

 drop policy if exists "Familled posts insert" on public.posts;
create policy "Familled posts insert" on public.posts
for insert to authenticated with check (true);

 drop policy if exists "Familled posts update" on public.posts;
create policy "Familled posts update" on public.posts
for update to authenticated using (true) with check (true);

 drop policy if exists "Familled posts delete" on public.posts;
create policy "Familled posts delete" on public.posts
for delete to authenticated using (true);

-- Commentaires
 drop policy if exists "Familled comments select" on public.comments;
create policy "Familled comments select" on public.comments
for select to authenticated using (true);

 drop policy if exists "Familled comments insert" on public.comments;
create policy "Familled comments insert" on public.comments
for insert to authenticated with check (true);

 drop policy if exists "Familled comments update" on public.comments;
create policy "Familled comments update" on public.comments
for update to authenticated using (true) with check (true);

 drop policy if exists "Familled comments delete" on public.comments;
create policy "Familled comments delete" on public.comments
for delete to authenticated using (true);

-- Réactions
 drop policy if exists "Familled reactions select" on public.reactions;
create policy "Familled reactions select" on public.reactions
for select to authenticated using (true);

 drop policy if exists "Familled reactions insert" on public.reactions;
create policy "Familled reactions insert" on public.reactions
for insert to authenticated with check (true);

 drop policy if exists "Familled reactions update" on public.reactions;
create policy "Familled reactions update" on public.reactions
for update to authenticated using (true) with check (true);

 drop policy if exists "Familled reactions delete" on public.reactions;
create policy "Familled reactions delete" on public.reactions
for delete to authenticated using (true);

-- Espace photos/vidéos familial
insert into storage.buckets (id, name, public)
values ('Family-media', 'Family-media', true)
on conflict (id) do update set public = true;

 drop policy if exists "Familled media upload" on storage.objects;
create policy "Familled media upload" on storage.objects
for insert to authenticated
with check (bucket_id = 'Family-media');

 drop policy if exists "Familled media view" on storage.objects;
create policy "Familled media view" on storage.objects
for select to authenticated
using (bucket_id = 'Family-media');

 drop policy if exists "Familled media update" on storage.objects;
create policy "Familled media update" on storage.objects
for update to authenticated
using (bucket_id = 'Family-media')
with check (bucket_id = 'Family-media');

 drop policy if exists "Familled media delete" on storage.objects;
create policy "Familled media delete" on storage.objects
for delete to authenticated
using (bucket_id = 'Family-media');

-- Vérifications
select id, name, profile_url from public.family_members order by id;
select count(*) as publications from public.posts;
select count(*) as commentaires from public.comments;
select count(*) as reactions from public.reactions;
