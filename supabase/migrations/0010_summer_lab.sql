/*
  # Fix Policy Recursion and Access Rules
  
  1. Changes
    - Drop existing problematic policies
    - Create new non-recursive policies
    - Simplify access control logic
  
  2. Security
    - Maintain RLS security
    - Prevent policy recursion
    - Ensure proper access control
*/

-- Drop existing problematic policies first
DROP POLICY IF EXISTS "Profile access policy" ON profiles;
DROP POLICY IF EXISTS "Asset access policy" ON assets;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own assets" ON assets;
DROP POLICY IF EXISTS "Users can delete own assets" ON assets;
DROP POLICY IF EXISTS "Users can insert own assets" ON assets;

-- Create new simplified profile policies
CREATE POLICY "Basic profile select"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR is_admin = true);

CREATE POLICY "Basic profile update"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Create new simplified asset policies
CREATE POLICY "Basic asset select"
  ON assets FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND is_admin = true
  ));

CREATE POLICY "Basic asset update"
  ON assets FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Basic asset delete"
  ON assets FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Basic asset insert"
  ON assets FOR INSERT
  WITH CHECK (user_id = auth.uid());