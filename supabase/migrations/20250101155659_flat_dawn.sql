-- Drop existing asset policies
DROP POLICY IF EXISTS "asset_select_policy_v9" ON assets;
DROP POLICY IF EXISTS "asset_insert_policy_v4" ON assets;
DROP POLICY IF EXISTS "asset_update_policy_v4" ON assets;
DROP POLICY IF EXISTS "asset_delete_policy_v4" ON assets;

-- Create new comprehensive policies
CREATE POLICY "assets_select"
    ON assets FOR SELECT
    USING (
        user_id = auth.uid() AND
        portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
    );

CREATE POLICY "assets_insert"
    ON assets FOR INSERT
    WITH CHECK (
        user_id = auth.uid() AND
        portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
    );

CREATE POLICY "assets_update"
    ON assets FOR UPDATE
    USING (
        user_id = auth.uid() AND
        portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
    );

CREATE POLICY "assets_delete"
    ON assets FOR DELETE
    USING (
        user_id = auth.uid() AND
        portfolio_id IN (SELECT id FROM portfolios WHERE user_id = auth.uid())
    );

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';