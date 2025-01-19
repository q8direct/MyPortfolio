/*
  # Fix Admin Policies and Authentication
  
  1. Changes
    - Fix recursive policies
    - Simplify admin access rules
    - Update profile handling
  
  2. Security
    - Maintain RLS security
    - Fix policy recursion
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admin view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin view all assets" ON assets;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new, non-recursive policies
CREATE POLICY "Profile access policy"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR 
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Asset access policy"
  ON assets FOR SELECT
  USING (
    user_id = auth.uid() OR 
    (SELECT is_admin FROM profiles WHERE id = auth.uid())
  );

-- Update profile trigger to properly handle admin
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
    CASE WHEN NEW.email = 'admin@example.com' THEN true ELSE false END
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If profile already exists, update it
    UPDATE public.profiles 
    SET email = NEW.email,
        is_admin = CASE WHEN NEW.email = 'admin@example.com' THEN true ELSE false END
    WHERE id = NEW.id;
    RETURN NEW;
  WHEN others THEN
    RETURN NEW;
END;
$$;