/*
  # Fix RLS policies to remove recursion
  
  1. Changes
    - Drop existing policies that may cause recursion
    - Create new simplified policies without circular dependencies
    - Ensure proper access control for both regular users and admins
  
  2. Security
    - Maintain proper access control
    - Remove policy recursion
    - Keep admin functionality
*/

-- First, drop all existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "assets_select_policy" ON profiles;
DROP POLICY IF EXISTS "assets_insert_policy" ON profiles;
DROP POLICY IF EXISTS "assets_update_policy" ON profiles;
DROP POLICY IF EXISTS "assets_delete_policy" ON profiles;

-- Create new simplified policies for profiles
CREATE POLICY "profiles_self_access"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_admin_access"
  ON profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.id IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  ));

CREATE POLICY "profiles_self_update"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles_self_insert"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Create new simplified policies for assets
CREATE POLICY "assets_self_access"
  ON assets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "assets_admin_access"
  ON assets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.id IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  ));

CREATE POLICY "assets_self_insert"
  ON assets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "assets_self_update"
  ON assets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "assets_self_delete"
  ON assets FOR DELETE
  USING (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;