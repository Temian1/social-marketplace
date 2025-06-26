-- Add wallet transactions table (safe)
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'SALE', 'PURCHASE', 'REFERRAL')),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    description TEXT,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add user badges and verification levels (safe)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'badge') THEN
        ALTER TABLE users ADD COLUMN badge VARCHAR(20) DEFAULT 'Bronze';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'verification_level') THEN
        ALTER TABLE users ADD COLUMN verification_level INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create indexes for performance (safe)
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

-- Update existing users with badges based on sales (safe)
UPDATE users SET badge = 
CASE 
    WHEN (
        SELECT COALESCE(SUM(t.amount - t.commission), 0) 
        FROM transactions t 
        WHERE t.seller_id = users.id AND t.escrow_status = 'RELEASED'
    ) >= 10000 THEN 'Diamond'
    WHEN (
        SELECT COALESCE(SUM(t.amount - t.commission), 0) 
        FROM transactions t 
        WHERE t.seller_id = users.id AND t.escrow_status = 'RELEASED'
    ) >= 5000 THEN 'Gold'
    WHEN (
        SELECT COALESCE(SUM(t.amount - t.commission), 0) 
        FROM transactions t 
        WHERE t.seller_id = users.id AND t.escrow_status = 'RELEASED'
    ) >= 1000 THEN 'Silver'
    ELSE 'Bronze'
END
WHERE badge IS NULL OR badge = 'Bronze';

-- Function to create withdrawal request (safe)
CREATE OR REPLACE FUNCTION create_withdrawal_request(p_user_id UUID, p_amount DECIMAL)
RETURNS UUID AS $$
DECLARE
    withdrawal_id UUID;
BEGIN
    INSERT INTO withdrawal_requests (user_id, amount, status, created_at, updated_at)
    VALUES (p_user_id, p_amount, 'PENDING', NOW(), NOW())
    RETURNING id INTO withdrawal_id;
    
    RETURN withdrawal_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create transaction with escrow (safe)
CREATE OR REPLACE FUNCTION create_transaction_with_escrow(
    p_listing_id UUID,
    p_buyer_id UUID, 
    p_seller_id UUID,
    p_amount DECIMAL,
    p_commission DECIMAL
)
RETURNS UUID AS $$
DECLARE
    transaction_id UUID;
BEGIN
    -- Create transaction
    INSERT INTO transactions (listing_id, buyer_id, seller_id, amount, commission, escrow_status, created_at, updated_at)
    VALUES (p_listing_id, p_buyer_id, p_seller_id, p_amount, p_commission, 'HELD', NOW(), NOW())
    RETURNING id INTO transaction_id;
    
    -- Deduct from buyer's wallet
    UPDATE wallets 
    SET balance = balance - p_amount, updated_at = NOW()
    WHERE user_id = p_buyer_id;
    
    -- Add wallet transaction record
    INSERT INTO wallet_transactions (user_id, type, amount, status, description, reference_id, created_at)
    VALUES (p_buyer_id, 'PURCHASE', -p_amount, 'COMPLETED', 'Purchase of listing', p_listing_id, NOW());
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql;
