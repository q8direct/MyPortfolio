/*
  # Add close price to assets table

  1. Changes
    - Add close_price column to assets table
    - Add closed_at timestamp column
    - Add status column to track if asset is open/closed
*/

DO $$ 
BEGIN
  -- Add close_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' 
    AND column_name = 'close_price'
  ) THEN
    ALTER TABLE public.assets 
    ADD COLUMN close_price decimal;
  END IF;

  -- Add closed_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' 
    AND column_name = 'closed_at'
  ) THEN
    ALTER TABLE public.assets 
    ADD COLUMN closed_at timestamptz;
  END IF;

  -- Add status column with default 'open'
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assets' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.assets 
    ADD COLUMN status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed'));
  END IF;
END $$;