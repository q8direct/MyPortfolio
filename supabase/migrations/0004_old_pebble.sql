/*
  # Add current price to assets table

  1. Changes
    - Add current_price column to assets table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' 
    AND column_name = 'current_price'
  ) THEN
    ALTER TABLE public.assets 
    ADD COLUMN current_price decimal;
  END IF;
END $$;