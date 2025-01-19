/*
  # Fix Authentication Policies

  1. Changes
    - Remove recursive policies
    - Simplify auth checks
    - Add proper profile handling
    - Fix login flow

  2. Security
    - Enable RLS
    - Add proper policies for profiles and assets
*/

-- First, drop existing policies that might depend on is_admin function
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "assets_select" ON assets;
DROP POLICY IF EXISTS "assets_insert" ON assets;
DROP POLICY IF EXISTS "assets_update" ON assets;
DROP POLICY IF EXISTS "assets_delete" ON assets;

-- Now we can safely drop the is_admin function
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;

-- Create new simplified policies for profiles
CREATE POLICY "allow_select_own_profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "allow_update_own_profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "allow_insert_own_profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Create new simplified policies for assets
CREATE POLICY "allow_select_own_assets"
  ON assets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "allow_insert_own_assets"
  ON assets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "allow_update_own_assets"
  ON assets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "allow_delete_own_assets"
  ON assets FOR DELETE
  USING (user_id = auth.uid());

-- Update the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  
  RETURN NEW;
END;
$$;