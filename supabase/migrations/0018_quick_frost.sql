/*
  # Exchange Integration Fixes

  1. Changes
    - Add updated_at column to assets table
    - Add exchange_id and exchange_asset_id columns for exchange integration
    - Add indexes for better query performance
    - Update RLS policies
*/

-- Add updated_at column if it doesn't exist
ALTER TABLE public.assets 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add exchange-related columns
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS exchange_id uuid REFERENCES public.exchanges(id),
ADD COLUMN IF NOT EXISTS exchange_asset_id text;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_symbol ON assets(symbol);
CREATE INDEX IF NOT EXISTS idx_assets_exchange_id ON assets(exchange_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);

-- Update trigger function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create or replace the trigger
DROP TRIGGER IF EXISTS set_updated_at ON assets;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();