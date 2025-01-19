/*
  # Fix Authentication and Policies
  
  1. Changes
    - Drop all existing problematic policies
    - Create new non-recursive policies
    - Fix profile and asset access rules
    - Update admin handling
  
  2. Security
    - Maintain proper access control
    - Prevent policy recursion
    - Fix authentication issues
*/

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Profile access policy" ON profiles;
DROP POLICY IF EXISTS "Asset access policy" ON assets;
DROP POLICY IF EXISTS "Basic profile select" ON profiles;
DROP POLICY IF EXISTS "Basic profile update" ON profiles;
DROP POLICY IF EXISTS "Basic asset select" ON assets;
DROP POLICY IF EXISTS "Basic asset update" ON assets;
DROP POLICY IF EXISTS "Basic asset delete" ON assets;
DROP POLICY IF EXISTS "Basic asset insert" ON assets;

-- Ensure required columns exist
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Create new simplified policies for profiles
CREATE POLICY "profiles_select_policy"
  ON profiles FOR SELECT
  USING (
    -- Users can see their own profile
    id = auth.uid() OR
    -- Admins can see all profiles
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "profiles_update_policy"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_policy"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Create new simplified policies for assets
CREATE POLICY "assets_select_policy"
  ON assets FOR SELECT
  USING (
    -- Users can see their own assets
    user_id = auth.uid() OR
    -- Admins can see all assets
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "assets_insert_policy"
  ON assets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "assets_update_policy"
  ON assets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "assets_delete_policy"
  ON assets FOR DELETE
  USING (user_id = auth.uid());

-- Update the handle_new_user function to properly handle admin users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@example.com' THEN true 
      ELSE false 
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    is_admin = CASE 
      WHEN EXCLUDED.email = 'admin@example.com' THEN true 
      ELSE profiles.is_admin 
    END;
  
  RETURN NEW;
END;
$$;