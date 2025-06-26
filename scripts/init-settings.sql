-- Initialize default settings for the marketplace
INSERT INTO settings (key, value, created_at, updated_at) VALUES
('commission_percent', '10', NOW(), NOW()),
('min_withdrawal_amount', '50', NOW(), NOW()),
('escrow_enabled', 'true', NOW(), NOW()),
('referrals_enabled', 'true', NOW(), NOW()),
('referral_commission_percent', '5', NOW(), NOW()),
('auto_release_days', '7', NOW(), NOW()),
('max_file_size_mb', '10', NOW(), NOW()),
('maintenance_mode', 'false', NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET
value = EXCLUDED.value,
updated_at = NOW();
