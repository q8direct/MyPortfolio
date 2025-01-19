/*
  # Manual Trades Schema

  1. New Tables
    - `manual_trades`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `symbol` (text)
      - `entry_price` (decimal)
      - `exit_price` (decimal, nullable)
      - `units` (decimal)
      - `status` (text: 'open' or 'closed')
      - `profit_loss` (decimal)
      - `created_at` (timestamp)
      - `closed_at` (timestamp, nullable)

  2. Security
    - Enable RLS
    - Add policies for user access control
*/

create table if not exists public.manual_trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  symbol text not null,
  entry_price decimal not null,
  exit_price decimal,
  units decimal not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  profit_loss decimal default 0,
  created_at timestamptz default now(),
  closed_at timestamptz
);

-- Enable RLS
alter table manual_trades enable row level security;

-- Policies
create policy "Users can view own trades"
  on manual_trades for select
  using (auth.uid() = user_id);

create policy "Users can insert own trades"
  on manual_trades for insert
  with check (auth.uid() = user_id);

create policy "Users can update own trades"
  on manual_trades for update
  using (auth.uid() = user_id);