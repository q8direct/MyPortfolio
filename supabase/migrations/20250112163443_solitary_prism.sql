/*
  # Grid Bots Schema

  1. New Tables
    - `grid_bots`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `exchange_id` (text)
      - `coin_pair` (text)
      - `type` (text) - 'long', 'short', or 'neutral'
      - `grid_count` (integer)
      - `initial_amount` (decimal)
      - `status` (text) - 'active' or 'inactive'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `grid_bots` table
    - Add policies for CRUD operations
*/

-- Create grid_bots table
CREATE TABLE IF NOT EXISTS public.grid_bots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    exchange_id text NOT NULL,
    coin_pair text NOT NULL,
    type text NOT NULL CHECK (type IN ('long', 'short', 'neutral')),
    grid_count integer NOT NULL CHECK (grid_count > 0),
    initial_amount decimal NOT NULL CHECK (initial_amount > 0),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE grid_bots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own grid bots"
    ON grid_bots FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own grid bots"
    ON grid_bots FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own grid bots"
    ON grid_bots FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own grid bots"
    ON grid_bots FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_grid_bots_user_id ON grid_bots(user_id);
CREATE INDEX idx_grid_bots_status ON grid_bots(status);

-- Create updated_at trigger
CREATE TRIGGER set_grid_bots_updated_at
    BEFORE UPDATE ON grid_bots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();