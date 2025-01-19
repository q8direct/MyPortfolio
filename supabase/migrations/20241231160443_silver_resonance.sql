/*
  # Add Profile Management

  1. New Tables
    - `managed_profiles`: Links users with their managed profiles
      - `id` (uuid, primary key)
      - `manager_id` (uuid, references auth.users)
      - `profile_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on managed_profiles table
    - Add policies for managers to manage their profiles
*/

-- Create managed_profiles table
CREATE TABLE IF NOT EXISTS public.managed_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_id uuid REFERENCES auth.users NOT NULL,
    profile_id uuid REFERENCES auth.users NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(manager_id, profile_id)
);

-- Enable RLS
ALTER TABLE managed_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their managed profiles"
    ON managed_profiles FOR SELECT
    USING (auth.uid() = manager_id);

CREATE POLICY "Users can add managed profiles"
    ON managed_profiles FOR INSERT
    WITH CHECK (auth.uid() = manager_id);

CREATE POLICY "Users can remove managed profiles"
    ON managed_profiles FOR DELETE
    USING (auth.uid() = manager_id);

-- Create index for better performance
CREATE INDEX idx_managed_profiles_manager ON managed_profiles(manager_id);
CREATE INDEX idx_managed_profiles_profile ON managed_profiles(profile_id);