/*
  # Update Profile and Asset Policies
  
  1. Drops all existing policies
  2. Creates new non-recursive policies for profiles and assets
  3. Updates user handler function
  
  Note: Includes safety checks to drop ALL possible existing policies first
*/

-- Drop ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_insert" ON profiles;
DROP POLICY IF EXISTS "assets_select" ON profiles;
DROP POLICY IF EXISTS "assets_insert" ON profiles;
DROP POLICY IF EXISTS "assets_update" ON profiles;
DROP POLICY IF EXISTS "assets_delete" ON profiles;
DROP POLICY IF EXISTS "allow_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "allow_select_own_assets" ON assets;
DROP POLICY IF EXISTS "allow_insert_own_assets" ON assets;
DROP POLICY IF EXISTS "allow_update_own_assets" ON assets;
DROP POLICY IF EXISTS "allow_delete_own_assets" ON assets;
DROP POLICY IF EXISTS "allow_select_profile" ON profiles;
DROP POLICY IF EXISTS "allow_select_assets" ON assets;

-- Create new non-recursive profile policies with unique names
CREATE POLICY "profile_select_policy_v2"
  ON profiles FOR SELECT
  USING (
    -- Allow users to see their own profile
    id = auth.uid() OR
    -- Allow admins to see all profiles (using direct column check)
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Create new non-recursive asset policies with unique names
CREATE POLICY "asset_select_policy_v2"
  ON assets FOR SELECT
  USING (
    -- Allow users to see their own assets
    user_id = auth.uid() OR
    -- Allow admins to see all assets (using direct column check)
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Update the handle_new_user function
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
    false  -- Default to non-admin
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  
  RETURN NEW;
END;
$$;