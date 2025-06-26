-- Safe insert mock users (using ON CONFLICT to avoid duplicates)
INSERT INTO users (id, name, email, password, username, referral_code, is_verified, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'johnsmith', 'JOHN123', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'sarahj', 'SARAH456', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Mike Chen', 'mike@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'mikechen', 'MIKE789', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Emma Wilson', 'emma@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'emmaw', 'EMMA101', false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Admin User', 'admin@whatsappmarket.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qG', 'admin', 'ADMIN999', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Update admin user (safe)
UPDATE users SET is_admin = true WHERE email = 'admin@whatsappmarket.com';

-- Insert wallets for users (safe)
INSERT INTO wallets (user_id, balance, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 250.00, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 180.50, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 420.75, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 95.25, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 1000.00, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

-- Insert mock listings (safe)
INSERT INTO listings (id, user_id, title, description, niche, type, price, screenshots, status, views, created_at, updated_at) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Premium Crypto Trading Signals', 'Join our exclusive crypto trading group with daily signals, market analysis, and expert insights. Over 5000 active members sharing profitable trades.', 'Finance', 'GROUP', 49.99, '["https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400", "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400"]', 'ACTIVE', 234, NOW() - INTERVAL '2 days', NOW()),

('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Tech Startup Founders Network', 'Connect with fellow entrepreneurs, share resources, get funding advice, and collaborate on projects. Verified founders only.', 'Business', 'GROUP', 75.00, '["https://images.unsplash.com/photo-1552664730-d307ca884978?w=400", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400"]', 'ACTIVE', 156, NOW() - INTERVAL '1 day', NOW()),

('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Digital Marketing Masterclass', 'Learn advanced digital marketing strategies from industry experts. Weekly live sessions, case studies, and networking opportunities.', 'Education', 'CHANNEL', 29.99, '["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"]', 'ACTIVE', 89, NOW() - INTERVAL '3 hours', NOW()),

('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Gaming Community Hub', 'Join thousands of gamers discussing latest releases, sharing tips, organizing tournaments, and finding gaming partners.', 'Gaming', 'GROUP', 15.99, '["https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400", "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400"]', 'ACTIVE', 445, NOW() - INTERVAL '5 days', NOW()),

('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Fitness & Nutrition Experts', 'Get personalized workout plans, nutrition advice, and motivation from certified trainers and nutritionists.', 'Health', 'GROUP', 39.99, '["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"]', 'ACTIVE', 178, NOW() - INTERVAL '1 day', NOW()),

('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Travel Deals & Tips', 'Exclusive travel deals, destination guides, and insider tips from experienced travelers and travel agents.', 'Travel', 'CHANNEL', 19.99, '["https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400"]', 'ACTIVE', 267, NOW() - INTERVAL '6 hours', NOW()),

('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'Stock Market Analysis', 'Daily stock picks, market analysis, and investment strategies from professional traders and analysts.', 'Finance', 'CHANNEL', 59.99, '["https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400"]', 'ACTIVE', 312, NOW() - INTERVAL '4 days', NOW()),

('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', 'Food & Recipe Sharing', 'Share your favorite recipes, cooking tips, and food photography with fellow food enthusiasts from around the world.', 'Food', 'GROUP', 12.99, '["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400"]', 'ACTIVE', 523, NOW() - INTERVAL '2 days', NOW()),

('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', 'Real Estate Investment', 'Learn about real estate investing, property analysis, market trends, and connect with other investors.', 'Business', 'GROUP', 89.99, '["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"]', 'ACTIVE', 145, NOW() - INTERVAL '1 day', NOW()),

('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Photography Masterclass', 'Improve your photography skills with tutorials, critiques, and challenges from professional photographers.', 'Entertainment', 'CHANNEL', 34.99, '["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400", "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400"]', 'ACTIVE', 198, NOW() - INTERVAL '3 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert some sample transactions (safe)
INSERT INTO transactions (id, listing_id, buyer_id, seller_id, amount, commission, escrow_status, created_at, updated_at) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 49.99, 4.99, 'RELEASED', NOW() - INTERVAL '1 day', NOW()),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 29.99, 2.99, 'HELD', NOW() - INTERVAL '2 hours', NOW()),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 39.99, 3.99, 'RELEASED', NOW() - INTERVAL '3 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert some reviews (safe)
INSERT INTO reviews (id, transaction_id, listing_id, reviewer_id, reviewee_id, rating, comment, created_at, updated_at) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 5, 'Excellent group with amazing trading signals! Highly recommended.', NOW() - INTERVAL '1 day', NOW()),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 4, 'Great fitness advice and supportive community. Worth every penny!', NOW() - INTERVAL '2 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- Add some wallet transactions for demo
INSERT INTO wallet_transactions (user_id, type, amount, status, description, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'SALE', 45.00, 'COMPLETED', 'Sale of Premium Crypto Trading Signals', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'PURCHASE', -49.99, 'COMPLETED', 'Purchase of Premium Crypto Trading Signals', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'SALE', 36.00, 'COMPLETED', 'Sale of Fitness & Nutrition Experts', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440003', 'PURCHASE', -39.99, 'COMPLETED', 'Purchase of Fitness & Nutrition Experts', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440001', 'DEPOSIT', 200.00, 'COMPLETED', 'Wallet deposit via payment gateway', NOW() - INTERVAL '5 days')
ON CONFLICT DO NOTHING;
