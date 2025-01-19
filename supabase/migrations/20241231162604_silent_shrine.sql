-- Add portfolio_id to assets if not exists
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS portfolio_id uuid REFERENCES portfolios(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_assets_portfolio ON assets(portfolio_id);

-- Drop existing policies first
DROP POLICY IF EXISTS "asset_select_policy_v6" ON assets;
DROP POLICY IF EXISTS "asset_insert_policy" ON assets;
DROP POLICY IF EXISTS "asset_update_policy" ON assets;
DROP POLICY IF EXISTS "asset_delete_policy" ON assets;

-- Create new policies with portfolio support
CREATE POLICY "asset_select_policy_v7"
    ON assets FOR SELECT
    USING (
        user_id = auth.uid() OR
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "asset_insert_policy_v2"
    ON assets FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        (portfolio_id IS NULL OR portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "asset_update_policy_v2"
    ON assets FOR UPDATE
    USING (
        user_id = auth.uid() AND
        (portfolio_id IS NULL OR portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        ))
    );

CREATE POLICY "asset_delete_policy_v2"
    ON assets FOR DELETE
    USING (
        user_id = auth.uid() AND
        (portfolio_id IS NULL OR portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        ))
    );