/*
  # Admin User and Permissions Setup
  
  1. Changes
    - Add admin-specific columns and permissions
    - Set up admin policies for data access
    - Update profile handling for admin users
  
  2. Security
    - Enable RLS policies for admin access
    - Secure access to sensitive data
*/

-- Ensure required columns exist
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Update policies for admin access
DROP POLICY IF EXISTS "Admin view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin view all assets" ON assets;

CREATE POLICY "Admin view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

CREATE POLICY "Admin view all assets"
  ON assets FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- Function to handle admin status
CREATE OR REPLACE FUNCTION public.set_admin_status(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET is_admin = true
  WHERE id = user_id;
END;
$$;

-- Update trigger function to handle admin emails
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
  WHEN others THEN
    RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();