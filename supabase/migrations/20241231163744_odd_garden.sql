-- Create function to handle portfolio default status
CREATE OR REPLACE FUNCTION handle_portfolio_default()
RETURNS TRIGGER AS $$
BEGIN
    -- If the new portfolio is being set as default
    IF NEW.is_default = true THEN
        -- Remove default status from other portfolios of the same user
        UPDATE portfolios
        SET is_default = false
        WHERE user_id = NEW.user_id
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to manage default portfolio
DROP TRIGGER IF EXISTS manage_portfolio_default ON portfolios;
CREATE TRIGGER manage_portfolio_default
    BEFORE INSERT OR UPDATE OF is_default ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION handle_portfolio_default();

-- Ensure only one default portfolio per user
UPDATE portfolios p1
SET is_default = false
WHERE is_default = true
AND EXISTS (
    SELECT 1 FROM portfolios p2
    WHERE p2.user_id = p1.user_id
    AND p2.is_default = true
    AND p2.created_at < p1.created_at
);

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';