/*
  # Final fix for RLS policies
  
  1. Changes
    - Drop all existing policies
    - Create new simplified policies without any circular dependencies
    - Use direct user ID checks instead of subqueries
    - Separate admin and regular user policies clearly
  
  2. Security
    - Maintain proper access control
    - Remove all policy recursion
    - Keep admin functionality
*/

-- First, drop all existing policies
DROP POLICY IF EXISTS "profiles_self_access" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_access" ON profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
DROP POLICY IF EXISTS "profiles_self_insert" ON profiles;
DROP POLICY IF EXISTS "assets_self_access" ON assets;
DROP POLICY IF EXISTS "assets_admin_access" ON assets;
DROP POLICY IF EXISTS "assets_self_insert" ON assets;
DROP POLICY IF EXISTS "assets_self_update" ON assets;
DROP POLICY IF EXISTS "assets_self_delete" ON assets;

-- Create a function to check admin status without recursion
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = user_id),
    false
  );
$$;

-- Create new simplified policies for profiles
CREATE POLICY "profiles_select"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR 
    is_admin(auth.uid())
  );

CREATE POLICY "profiles_update"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles_insert"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Create new simplified policies for assets
CREATE POLICY "assets_select"
  ON assets FOR SELECT
  USING (
    user_id = auth.uid() OR 
    is_admin(auth.uid())
  );

CREATE POLICY "assets_insert"
  ON assets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "assets_update"
  ON assets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "assets_delete"
  ON assets FOR DELETE
  USING (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;