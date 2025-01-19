/*
  # Fix Profile Policies
  
  1. Drops existing recursive policies
  2. Creates new non-recursive policies using subqueries
  3. Adds proper indexes for performance
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "profile_select_policy_v3" ON profiles;
DROP POLICY IF EXISTS "asset_select_policy_v3" ON assets;

-- Create materialized admin view for better performance
CREATE MATERIALIZED VIEW IF NOT EXISTS admin_users AS
SELECT id 
FROM profiles 
WHERE is_admin = true;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_id ON admin_users(id);

-- Create function to refresh admin users
CREATE OR REPLACE FUNCTION refresh_admin_users()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY admin_users;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh admin users view
DROP TRIGGER IF EXISTS refresh_admin_users_trigger ON profiles;
CREATE TRIGGER refresh_admin_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON profiles
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_admin_users();

-- Create new non-recursive policies for profiles
CREATE POLICY "profile_select_policy_v4"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Create new non-recursive policies for assets
CREATE POLICY "asset_select_policy_v4"
  ON assets FOR SELECT
  USING (
    user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Refresh the materialized view initially
REFRESH MATERIALIZED VIEW admin_users;

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';