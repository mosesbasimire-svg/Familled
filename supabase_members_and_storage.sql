-- CORRECTIF FINAL pour le projet Familled
-- À exécuter dans Supabase > SQL Editor, après la création des tables existantes.

-- 1) Ajouter les membres de la famille s'ils n'existent pas encore.
insert into family_members (name)
select v.name
from (values
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
) as v(name)
where not exists (select 1 from family_members f where f.name=v.name);

-- 2) Le site utilise getPublicUrl() pour les photos de publications.
-- Cette ligne rend le bucket Family-media public afin que les photos soient visibles dans le site.
update storage.buckets set public = true where name = 'Family-media';

-- 3) Les réactions doivent pouvoir être modifiées ou retirées.
drop policy if exists "family members can update reactions" on reactions;
create policy "family members can update reactions"
on reactions for update to authenticated using (true) with check (true);

drop policy if exists "family members can delete reactions" on reactions;
create policy "family members can delete reactions"
on reactions for delete to authenticated using (true);
