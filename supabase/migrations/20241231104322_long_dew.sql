/*
  # Fix updated_at column and trigger

  This migration:
  1. Ensures updated_at column exists
  2. Creates/updates trigger for automatic updates
  3. Backfills any null values
*/

-- Ensure updated_at column exists with proper default
ALTER TABLE public.assets 
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update any existing null updated_at values
UPDATE public.assets 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON public.assets;

-- Create new trigger
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.assets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';