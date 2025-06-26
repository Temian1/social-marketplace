-- Verify admin setup is working correctly
SELECT 
    u.id,
    u.name,
    u.email,
    u.username,
    u.is_admin,
    u.is_verified,
    w.balance as wallet_balance,
    u.created_at
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id
WHERE u.email IN ('admin@whatsappmarket.com', 'kikismedia@gmail.com')
ORDER BY u.email;

-- Show recent wallet transactions for admin users
SELECT 
    wt.user_id,
    u.email,
    wt.type,
    wt.amount,
    wt.status,
    wt.description,
    wt.created_at
FROM wallet_transactions wt
JOIN users u ON wt.user_id = u.id
WHERE u.email IN ('admin@whatsappmarket.com', 'kikismedia@gmail.com')
ORDER BY wt.created_at DESC
LIMIT 10;
