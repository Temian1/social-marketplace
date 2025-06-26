-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON User(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON User(username);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON User(referralCode);

CREATE INDEX IF NOT EXISTS idx_listings_status ON Listing(status);
CREATE INDEX IF NOT EXISTS idx_listings_niche ON Listing(niche);
CREATE INDEX IF NOT EXISTS idx_listings_type ON Listing(type);
CREATE INDEX IF NOT EXISTS idx_listings_price ON Listing(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON Listing(createdAt);
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON Listing(userId);

CREATE INDEX IF NOT EXISTS idx_transactions_escrow_status ON Transaction(escrowStatus);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON Transaction(createdAt);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON Transaction(buyerId);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON Transaction(sellerId);

CREATE INDEX IF NOT EXISTS idx_messages_transaction_id ON Message(transactionId);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON Message(createdAt);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON Notification(userId, isRead);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON Notification(createdAt);

CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_status ON WithdrawalRequest(status);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_created_at ON WithdrawalRequest(createdAt);
