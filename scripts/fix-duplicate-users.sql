-- Fix any duplicate user issues and clean up data
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- Check for duplicate emails
    SELECT COUNT(*) INTO duplicate_count 
    FROM (
        SELECT email, COUNT(*) as cnt 
        FROM users 
        GROUP BY email 
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF duplicate_count > 0 THEN
        RAISE NOTICE 'Found % duplicate email(s), cleaning up...', duplicate_count;
        
        -- Keep only the first occurrence of each email, delete the rest
        DELETE FROM users 
        WHERE id NOT IN (
            SELECT DISTINCT ON (email) id 
            FROM users 
            ORDER BY email, created_at ASC
        );
        
        RAISE NOTICE 'Cleaned up duplicate users';
    ELSE
        RAISE NOTICE 'No duplicate users found';
    END IF;
    
    -- Ensure referral codes are unique
    UPDATE users SET referral_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))
    WHERE referral_code IN (
        SELECT referral_code 
        FROM users 
        GROUP BY referral_code 
        HAVING COUNT(*) > 1
    );
    
    RAISE NOTICE 'Fixed any duplicate referral codes';
    
END $$;
