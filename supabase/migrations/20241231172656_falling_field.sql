-- Create portfolios table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.portfolios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    description text,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on portfolios
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create portfolio policies
CREATE POLICY "portfolios_select"
    ON portfolios FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "portfolios_insert"
    ON portfolios FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "portfolios_update"
    ON portfolios FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "portfolios_delete"
    ON portfolios FOR DELETE
    USING (user_id = auth.uid());

-- Add portfolio_id to assets
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS portfolio_id uuid REFERENCES portfolios(id);

-- Create a default portfolio for each user with existing assets
INSERT INTO portfolios (id, user_id, name, is_default)
SELECT 
    gen_random_uuid(),
    user_id,
    'Default Portfolio',
    true
FROM (SELECT DISTINCT user_id FROM assets WHERE portfolio_id IS NULL) AS unique_users;

-- Update existing assets with their user's default portfolio
UPDATE assets a
SET portfolio_id = p.id
FROM portfolios p
WHERE a.portfolio_id IS NULL
AND a.user_id = p.user_id
AND p.is_default = true;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_assets_portfolio_user ON assets(portfolio_id, user_id);

-- Update RLS policies
DROP POLICY IF EXISTS "asset_select_policy_v8" ON assets;
DROP POLICY IF EXISTS "asset_insert_policy_v3" ON assets;
DROP POLICY IF EXISTS "asset_update_policy_v3" ON assets;
DROP POLICY IF EXISTS "asset_delete_policy_v3" ON assets;

CREATE POLICY "asset_select_policy_v9" ON assets
    FOR SELECT USING (
        user_id = auth.uid() AND
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "asset_insert_policy_v4" ON assets
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "asset_update_policy_v4" ON assets
    FOR UPDATE USING (
        user_id = auth.uid() AND
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "asset_delete_policy_v4" ON assets
    FOR DELETE USING (
        user_id = auth.uid() AND
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';