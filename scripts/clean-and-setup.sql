-- Clean setup script that handles existing data gracefully

-- First, ensure all required tables exist
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

-- Add missing columns safely
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'badge') THEN
        ALTER TABLE users ADD COLUMN badge VARCHAR(20) DEFAULT 'Bronze';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'verification_level') THEN
        ALTER TABLE users ADD COLUMN verification_level INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create all indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_niche ON listings(niche);
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_escrow_status ON transactions(escrow_status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_transaction_id ON messages(transaction_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON withdrawal_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);

-- Update user badges
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
END;

-- Ensure admin user exists
INSERT INTO users (name, email, password, username, referral_code, is_verified, is_admin, created_at, updated_at) 
VALUES ('Admin User', 'admin@whatsappmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'admin', 'ADMIN999', true, true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET is_admin = true;

-- Ensure kikismedia admin access
INSERT INTO users (name, email, password, username, referral_code, is_verified, is_admin, created_at, updated_at) 
VALUES ('Kikis Media', 'kikismedia@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'kikismedia', 'KIKIS001', true, true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET is_admin = true;

-- Create wallets for admin users if they don't exist
INSERT INTO wallets (user_id, balance, created_at, updated_at)
SELECT id, 1000.00, NOW(), NOW()
FROM users 
WHERE email IN ('admin@whatsappmarket.com', 'kikismedia@gmail.com')
ON CONFLICT (user_id) DO NOTHING;
