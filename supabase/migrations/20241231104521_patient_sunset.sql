/*
  # Exchange Table Setup
  
  1. Creates exchanges table for storing exchange API credentials
  2. Enables RLS and sets up security policies
  3. Adds updated_at trigger
  4. Adds unique constraint on user_id + exchange_id
*/

-- Create exchanges table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.exchanges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  exchange_id text NOT NULL,
  name text NOT NULL,
  api_key text NOT NULL,
  api_secret text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Add unique constraint to prevent duplicate exchange connections
  UNIQUE(user_id, exchange_id)
);

-- Enable RLS
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "exchange_select_policy" ON exchanges;
DROP POLICY IF EXISTS "exchange_insert_policy" ON exchanges;
DROP POLICY IF EXISTS "exchange_update_policy" ON exchanges;
DROP POLICY IF EXISTS "exchange_delete_policy" ON exchanges;

-- Create new policies with consistent naming
CREATE POLICY "exchange_select_policy"
  ON exchanges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "exchange_insert_policy"
  ON exchanges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "exchange_update_policy"
  ON exchanges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "exchange_delete_policy"
  ON exchanges FOR DELETE
  USING (auth.uid() = user_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_exchanges_updated_at ON exchanges;

-- Create trigger for updated_at
CREATE TRIGGER set_exchanges_updated_at
  BEFORE UPDATE ON exchanges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();