/*
  # Create assets table and security policies

  1. New Tables
    - `assets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `symbol` (text)
      - `name` (text)
      - `icon_url` (text)
      - `units` (decimal)
      - `entry_price` (decimal)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `assets` table
    - Add policies for users to manage their own assets
*/

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  symbol text not null,
  name text not null,
  icon_url text,
  units decimal not null,
  entry_price decimal not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table assets enable row level security;

-- Policies
create policy "Users can view own assets"
  on assets for select
  using (auth.uid() = user_id);

create policy "Users can insert own assets"
  on assets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own assets"
  on assets for update
  using (auth.uid() = user_id);

create policy "Users can delete own assets"
  on assets for delete
  using (auth.uid() = user_id);