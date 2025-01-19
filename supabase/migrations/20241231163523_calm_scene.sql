-- Update all portfolios to be default
UPDATE portfolios SET is_default = true;

-- Modify the portfolios table to make is_default default to true
ALTER TABLE portfolios 
ALTER COLUMN is_default SET DEFAULT true;

-- Update the asset policies to allow operations on any portfolio
DROP POLICY IF EXISTS "asset_select_policy_v7" ON assets;
DROP POLICY IF EXISTS "asset_insert_policy_v2" ON assets;
DROP POLICY IF EXISTS "asset_update_policy_v2" ON assets;
DROP POLICY IF EXISTS "asset_delete_policy_v2" ON assets;

-- Create new simplified policies
CREATE POLICY "asset_select_policy_v8"
    ON assets FOR SELECT
    USING (
        user_id = auth.uid() OR
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "asset_insert_policy_v3"
    ON assets FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "asset_update_policy_v3"
    ON assets FOR UPDATE
    USING (
        user_id = auth.uid() AND
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "asset_delete_policy_v3"
    ON assets FOR DELETE
    USING (
        user_id = auth.uid() AND
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';