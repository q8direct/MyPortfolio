-- Add portfolio_id to assets if not exists
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS portfolio_id uuid REFERENCES portfolios(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_assets_portfolio ON assets(portfolio_id);

-- Update assets policies to include portfolio check
DROP POLICY IF EXISTS "asset_select_policy_v5" ON assets;
CREATE POLICY "asset_select_policy_v6" ON assets
    FOR SELECT USING (
        user_id = auth.uid() OR
        portfolio_id IN (
            SELECT p.id FROM portfolios p
            LEFT JOIN managed_profiles mp ON mp.profile_id = p.user_id
            WHERE p.user_id = auth.uid() OR mp.manager_id = auth.uid()
        )
    );