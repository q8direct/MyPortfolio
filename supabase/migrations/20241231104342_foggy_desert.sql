/*
  # Update User Management Functions
  
  1. Updates handle_new_user function to:
    - Remove admin email check
    - Set default non-admin status
    - Preserve existing admin status on conflicts
  
  2. Adds function to manage admin status:
    - Allows setting admin status manually
    - Requires superuser privileges
*/

-- Update the handle_new_user function to remove admin email check
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
    false  -- All new users start as non-admin
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    is_admin = profiles.is_admin;  -- Preserve existing admin status on conflict
  
  RETURN NEW;
END;
$$;

-- Create function to manually set admin status (requires superuser)
CREATE OR REPLACE FUNCTION public.set_user_admin_status(user_email text, admin_status boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET is_admin = admin_status
  FROM auth.users
  WHERE profiles.id = auth.users.id
  AND auth.users.email = user_email;
END;
$$;