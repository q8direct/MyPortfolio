/*
  # Fix Recursive Policies
  
  1. Drops existing policies that may cause recursion
  2. Creates new non-recursive policies using EXISTS clauses
  3. Adds proper indexes for performance
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "profile_select_policy_v2" ON profiles;
DROP POLICY IF EXISTS "asset_select_policy_v2" ON assets;

-- Create proper non-recursive policies for profiles
CREATE POLICY "profile_select_policy_v3"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR EXISTS (
      SELECT 1 
      FROM profiles admin_profile 
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.is_admin = true
    )
  );

CREATE POLICY "profile_update_policy"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profile_insert_policy"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Create proper non-recursive policies for assets
CREATE POLICY "asset_select_policy_v3"
  ON assets FOR SELECT
  USING (
    user_id = auth.uid() OR EXISTS (
      SELECT 1 
      FROM profiles admin_profile 
      WHERE admin_profile.id = auth.uid() 
      AND admin_profile.is_admin = true
    )
  );

CREATE POLICY "asset_insert_policy"
  ON assets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "asset_update_policy"
  ON assets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "asset_delete_policy"
  ON assets FOR DELETE
  USING (user_id = auth.uid());

-- Add indexes to improve policy performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';