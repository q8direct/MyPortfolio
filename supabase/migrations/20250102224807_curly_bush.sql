-- Drop existing asset policies
DROP POLICY IF EXISTS "assets_select" ON assets;
DROP POLICY IF EXISTS "assets_insert" ON assets;
DROP POLICY IF EXISTS "assets_update" ON assets;
DROP POLICY IF EXISTS "assets_delete" ON assets;

-- Create new comprehensive policies
CREATE POLICY "assets_select"
    ON assets FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "assets_insert"
    ON assets FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "assets_update"
    ON assets FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "assets_delete"
    ON assets FOR DELETE
    USING (user_id = auth.uid());

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';