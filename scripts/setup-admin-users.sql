-- Setup admin users with proper funding
DO $$
DECLARE
    admin_user_id UUID;
    kikis_user_id UUID;
BEGIN
    -- Insert or update admin@whatsappmarket.com
    INSERT INTO users (name, email, password, username, referral_code, is_verified, is_admin, created_at, updated_at) 
    VALUES ('Admin User', 'admin@whatsappmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'admin', 'ADMIN999', true, true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET 
        is_admin = true,
        is_verified = true,
        updated_at = NOW()
    RETURNING id INTO admin_user_id;

    -- Insert or update kikismedia@gmail.com  
    INSERT INTO users (name, email, password, username, referral_code, is_verified, is_admin, created_at, updated_at) 
    VALUES ('Kikis Media', 'kikismedia@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'kikismedia', 'KIKIS001', true, true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET 
        is_admin = true,
        is_verified = true,
        updated_at = NOW()
    RETURNING id INTO kikis_user_id;

    -- Get user IDs if they already existed
    IF admin_user_id IS NULL THEN
        SELECT id INTO admin_user_id FROM users WHERE email = 'admin@whatsappmarket.com';
    END IF;
    
    IF kikis_user_id IS NULL THEN
        SELECT id INTO kikis_user_id FROM users WHERE email = 'kikismedia@gmail.com';
    END IF;

    -- Create or update wallets with funding
    INSERT INTO wallets (user_id, balance, created_at, updated_at)
    VALUES (admin_user_id, 10000.00, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET 
        balance = GREATEST(wallets.balance, 10000.00),
        updated_at = NOW();

    INSERT INTO wallets (user_id, balance, created_at, updated_at)
    VALUES (kikis_user_id, 10000.00, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET 
        balance = GREATEST(wallets.balance, 10000.00),
        updated_at = NOW();

    -- Add wallet transaction records for the funding
    INSERT INTO wallet_transactions (user_id, type, amount, status, description, created_at)
    VALUES 
        (admin_user_id, 'DEPOSIT', 10000.00, 'COMPLETED', 'Initial admin funding', NOW()),
        (kikis_user_id, 'DEPOSIT', 10000.00, 'COMPLETED', 'Initial admin funding', NOW())
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Admin users setup completed successfully';
END $$;
