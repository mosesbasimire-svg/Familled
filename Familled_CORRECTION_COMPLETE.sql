-- CORRECTION COMPLETE FAMILLED / SUPABASE
-- À exécuter une seule fois dans Supabase > SQL Editor.

alter table public.family_members
add column if not exists profile_url text;

drop policy if exists "family members can update own profile photo" on public.family_members;
create policy "family members can update own profile photo"
on public.family_members
for update
to authenticated
using (true)
with check (true);

drop policy if exists "family members can update reactions" on public.reactions;
create policy "family members can update reactions"
on public.reactions
for update
to authenticated
using (true)
with check (true);

drop policy if exists "family members can delete reactions" on public.reactions;
create policy "family members can delete reactions"
on public.reactions
for delete
to authenticated
using (true);

update storage.buckets
set public = true
where id = 'Family-media';

drop policy if exists "Family media - upload" on storage.objects;
create policy "Family media - upload"
on storage.objects for insert to authenticated
with check (bucket_id = 'Family-media');

drop policy if exists "Family media - view" on storage.objects;
create policy "Family media - view"
on storage.objects for select to authenticated
using (bucket_id = 'Family-media');

drop policy if exists "Family media - update" on storage.objects;
create policy "Family media - update"
on storage.objects for update to authenticated
using (bucket_id = 'Family-media')
with check (bucket_id = 'Family-media');

-- Vérification finale
select id, name, profile_url
from public.family_members
order by id;
