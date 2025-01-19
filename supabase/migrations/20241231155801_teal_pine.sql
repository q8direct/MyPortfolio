-- Create portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    description text,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own portfolios"
    ON portfolios FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own portfolios"
    ON portfolios FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
    ON portfolios FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios"
    ON portfolios FOR DELETE
    USING (auth.uid() = user_id);

-- Add portfolio_id to assets table
ALTER TABLE public.assets
ADD COLUMN IF NOT EXISTS portfolio_id uuid REFERENCES portfolios(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_assets_portfolio_id ON assets(portfolio_id);

-- Update assets policies to include portfolio check
DROP POLICY IF EXISTS "assets_select_policy_v4" ON assets;
CREATE POLICY "assets_select_policy_v5" ON assets
    FOR SELECT USING (
        user_id = auth.uid() OR
        portfolio_id IN (
            SELECT id FROM portfolios WHERE user_id = auth.uid()
        )
    );