/*
  # Add updated_at column to assets table

  1. Changes
    - Add updated_at column to assets table with default value of now()
    - Add trigger to automatically update updated_at on row updates
*/

-- Add updated_at column
ALTER TABLE public.assets 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();