-- Safe setup script for admin users that handles existing data
DO $$
DECLARE
    admin_user_id UUID;
    kikis_user_id UUID;
    admin_wallet_balance DECIMAL;
    kikis_wallet_balance DECIMAL;
BEGIN
    -- Handle admin@whatsappmarket.com
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@whatsappmarket.com';
    
    IF admin_user_id IS NULL THEN
        -- User doesn't exist, create new one
        INSERT INTO users (name, email, password, username, referral_code, is_verified, is_admin, created_at, updated_at) 
        VALUES ('Admin User', 'admin@whatsappmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'admin', 'ADMIN999', true, true, NOW(), NOW())
        RETURNING id INTO admin_user_id;
        RAISE NOTICE 'Created new admin user: %', admin_user_id;
    ELSE
        -- User exists, just update admin status
        UPDATE users SET 
            is_admin = true,
            is_verified = true,
            updated_at = NOW()
        WHERE id = admin_user_id;
        RAISE NOTICE 'Updated existing admin user: %', admin_user_id;
    END IF;

    -- Handle kikismedia@gmail.com
    SELECT id INTO kikis_user_id FROM users WHERE email = 'kikismedia@gmail.com';
    
    IF kikis_user_id IS NULL THEN
        -- User doesn't exist, create new one
        INSERT INTO users (name, email, password, username, referral_code, is_verified, is_admin, created_at, updated_at) 
        VALUES ('Kikis Media', 'kikismedia@gmail.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'kikismedia', 'KIKIS001', true, true, NOW(), NOW())
        RETURNING id INTO kikis_user_id;
        RAISE NOTICE 'Created new kikis user: %', kikis_user_id;
    ELSE
        -- User exists, just update admin status
        UPDATE users SET 
            is_admin = true,
            is_verified = true,
            updated_at = NOW()
        WHERE id = kikis_user_id;
        RAISE NOTICE 'Updated existing kikis user: %', kikis_user_id;
    END IF;

    -- Handle admin wallet
    SELECT balance INTO admin_wallet_balance FROM wallets WHERE user_id = admin_user_id;
    
    IF admin_wallet_balance IS NULL THEN
        -- No wallet exists, create one
        INSERT INTO wallets (user_id, balance, created_at, updated_at)
        VALUES (admin_user_id, 10000.00, NOW(), NOW());
        
        INSERT INTO wallet_transactions (user_id, type, amount, status, description, created_at)
        VALUES (admin_user_id, 'DEPOSIT', 10000.00, 'COMPLETED', 'Initial admin funding', NOW());
        
        RAISE NOTICE 'Created wallet for admin with $10,000';
    ELSE
        -- Wallet exists, ensure minimum balance
        IF admin_wallet_balance < 10000.00 THEN
            UPDATE wallets 
            SET balance = 10000.00, updated_at = NOW()
            WHERE user_id = admin_user_id;
            
            INSERT INTO wallet_transactions (user_id, type, amount, status, description, created_at)
            VALUES (admin_user_id, 'DEPOSIT', (10000.00 - admin_wallet_balance), 'COMPLETED', 'Admin balance top-up', NOW());
            
            RAISE NOTICE 'Topped up admin wallet to $10,000';
        ELSE
            RAISE NOTICE 'Admin wallet already has sufficient funds: $%', admin_wallet_balance;
        END IF;
    END IF;

    -- Handle kikis wallet
    SELECT balance INTO kikis_wallet_balance FROM wallets WHERE user_id = kikis_user_id;
    
    IF kikis_wallet_balance IS NULL THEN
        -- No wallet exists, create one
        INSERT INTO wallets (user_id, balance, created_at, updated_at)
        VALUES (kikis_user_id, 10000.00, NOW(), NOW());
        
        INSERT INTO wallet_transactions (user_id, type, amount, status, description, created_at)
        VALUES (kikis_user_id, 'DEPOSIT', 10000.00, 'COMPLETED', 'Initial admin funding', NOW());
        
        RAISE NOTICE 'Created wallet for kikis with $10,000';
    ELSE
        -- Wallet exists, ensure minimum balance
        IF kikis_wallet_balance < 10000.00 THEN
            UPDATE wallets 
            SET balance = 10000.00, updated_at = NOW()
            WHERE user_id = kikis_user_id;
            
            INSERT INTO wallet_transactions (user_id, type, amount, status, description, created_at)
            VALUES (kikis_user_id, 'DEPOSIT', (10000.00 - kikis_wallet_balance), 'COMPLETED', 'Admin balance top-up', NOW());
            
            RAISE NOTICE 'Topped up kikis wallet to $10,000';
        ELSE
            RAISE NOTICE 'Kikis wallet already has sufficient funds: $%', kikis_wallet_balance;
        END IF;
    END IF;

    RAISE NOTICE 'Admin setup completed successfully!';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error during admin setup: %', SQLERRM;
        RAISE;
END $$;
