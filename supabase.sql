-- Schéma de base pour la prochaine étape de synchronisation en ligne.
-- À exécuter dans Supabase SQL Editor après création du projet.
create table if not exists family_posts (id uuid primary key default gen_random_uuid(), author text not null, member_id bigint, text_content text, image_url text, created_at timestamptz default now());
create table if not exists family_comments (id uuid primary key default gen_random_uuid(), post_id uuid references family_posts(id) on delete cascade, author text not null, text_content text not null, created_at timestamptz default now());
create table if not exists family_reactions (id uuid primary key default gen_random_uuid(), post_id uuid references family_posts(id) on delete cascade, author text not null, reaction text not null, created_at timestamptz default now());
create table if not exists family_memories (id uuid primary key default gen_random_uuid(), author text not null, caption text, image_url text not null, created_at timestamptz default now());
create table if not exists family_profiles (member_id bigint primary key, image_url text, updated_at timestamptz default now());
