import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

export const sql = neon(process.env.DATABASE_URL)

function safeParseScreenshots(value: unknown): string[] {
  // 1. Already an array
  if (Array.isArray(value)) return value as string[]

  // 2. Null / undefined / empty
  if (value === null || value === undefined) return []

  // 3. Try JSON.parse if it looks like JSON
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed)
        return Array.isArray(parsed) ? parsed : [String(parsed)]
      } catch {
        /* fall through to wrap as single string */
      }
    }
    // 4. Plain string URL – wrap as array
    return [trimmed]
  }

  // Fallback
  return []
}

// Database helper functions
export async function createUser(data: {
  name: string
  email: string
  password: string
  username?: string
  referralCode: string
  referredBy?: string
}) {
  const result = await sql`
    INSERT INTO users (name, email, password, username, referral_code, referred_by, created_at, updated_at)
    VALUES (${data.name}, ${data.email}, ${data.password}, ${data.username || null}, ${data.referralCode}, ${data.referredBy || null}, NOW(), NOW())
    RETURNING id, name, email, username, referral_code, is_verified, is_banned, is_suspended, is_admin, created_at
  `
  return result[0]
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, name, email, password, username, referral_code, is_verified, is_banned, is_suspended, is_admin, last_login, created_at
    FROM users 
    WHERE email = ${email}
  `
  return result[0] || null
}

export async function getUserById(id: string) {
  const result = await sql`
    SELECT id, name, email, username, image, referral_code, is_verified, is_banned, is_suspended, is_admin, bio, last_login, created_at
    FROM users 
    WHERE id = ${id}
  `
  return result[0] || null
}

export async function updateUserLastLogin(id: string) {
  await sql`
    UPDATE users 
    SET last_login = NOW(), updated_at = NOW()
    WHERE id = ${id}
  `
}

export async function createWallet(userId: string) {
  await sql`
    INSERT INTO wallets (user_id, balance, created_at, updated_at)
    VALUES (${userId}, 0, NOW(), NOW())
    ON CONFLICT (user_id) DO NOTHING
  `
}

export async function getWalletByUserId(userId: string) {
  const result = await sql`
    SELECT id, user_id, balance, created_at, updated_at
    FROM wallets 
    WHERE user_id = ${userId}
  `
  return result[0] || null
}

export async function getWalletTransactions(userId: string, limit = 20) {
  const result = await sql`
    SELECT 
      id, type, amount, status, description, created_at
    FROM wallet_transactions 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return result
}

export async function createListing(data: {
  userId: string
  title: string
  description: string
  niche: string
  type: "GROUP" | "CHANNEL"
  price: number
  screenshots?: string[]
}) {
  const result = await sql`
    INSERT INTO listings (user_id, title, description, niche, type, price, screenshots, status, created_at, updated_at)
    VALUES (${data.userId}, ${data.title}, ${data.description}, ${data.niche}, ${data.type}, ${data.price}, ${JSON.stringify(data.screenshots || [])}, 'PENDING', NOW(), NOW())
    RETURNING id, user_id, title, description, niche, type, price, screenshots, status, views, created_at, updated_at
  `
  return result[0]
}

export async function getActiveListings(
  options: {
    limit?: number
    offset?: number
    search?: string
    type?: string
    niche?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
  } = {},
) {
  const { limit = 20, offset = 0, search, type, niche, minPrice, maxPrice, sortBy = "newest" } = options

  let whereClause = "WHERE l.status = 'ACTIVE'"
  const params: any[] = []
  let paramIndex = 1

  if (search) {
    whereClause += ` AND (l.title ILIKE $${paramIndex} OR l.description ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }

  if (type && type !== "ALL_TYPES") {
    whereClause += ` AND l.type = $${paramIndex}`
    params.push(type)
    paramIndex++
  }

  if (niche && niche !== "ALL_NICHES") {
    whereClause += ` AND l.niche = $${paramIndex}`
    params.push(niche)
    paramIndex++
  }

  if (minPrice !== undefined) {
    whereClause += ` AND l.price >= $${paramIndex}`
    params.push(minPrice)
    paramIndex++
  }

  if (maxPrice !== undefined) {
    whereClause += ` AND l.price <= $${paramIndex}`
    params.push(maxPrice)
    paramIndex++
  }

  let orderClause = "ORDER BY l.created_at DESC"
  switch (sortBy) {
    case "oldest":
      orderClause = "ORDER BY l.created_at ASC"
      break
    case "price-low":
      orderClause = "ORDER BY l.price ASC"
      break
    case "price-high":
      orderClause = "ORDER BY l.price DESC"
      break
    case "popular":
      orderClause = "ORDER BY l.views DESC"
      break
  }

  const query = `
    SELECT 
      l.id, l.user_id, l.title, l.description, l.niche, l.type, l.price, l.screenshots, l.status, l.views, l.created_at, l.updated_at,
      u.id as user_id, u.name as user_name, u.username as user_username, u.image as user_image, u.is_verified as user_is_verified
    FROM listings l
    JOIN users u ON l.user_id = u.id
    ${whereClause}
    ${orderClause}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `

  params.push(limit, offset)

  const queryResult = await sql.query(query, params as unknown[])
  const rows: any[] = Array.isArray(queryResult) ? queryResult : (queryResult as { rows: any[] }).rows

  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    niche: row.niche,
    type: row.type,
    price: Number.parseFloat(row.price),
    screenshots: safeParseScreenshots(row.screenshots),
    status: row.status,
    views: row.views,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    user: {
      id: row.user_id,
      name: row.user_name,
      username: row.user_username,
      image: row.user_image,
      isVerified: row.user_is_verified,
    },
  }))
}

export async function getListingById(id: string) {
  const result = await sql`
    SELECT 
      l.id, l.user_id, l.title, l.description, l.niche, l.type, l.price, l.screenshots, l.status, l.views, l.created_at, l.updated_at,
      u.id as user_id, u.name as user_name, u.username as user_username, u.image as user_image, u.is_verified as user_is_verified
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.id = ${id}
  `

  if (result.length === 0) return null

  const row = result[0]
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    niche: row.niche,
    type: row.type,
    price: Number.parseFloat(row.price),
    screenshots: safeParseScreenshots(row.screenshots),
    status: row.status,
    views: row.views,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    user: {
      id: row.user_id,
      name: row.user_name,
      username: row.user_username,
      image: row.user_image,
      isVerified: row.user_is_verified,
    },
  }
}

export async function getUserListings(userId: string, limit = 10) {
  const result = await sql`
    SELECT id, user_id, title, description, niche, type, price, screenshots, status, views, created_at, updated_at
    FROM listings 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `

  return result.map((row: any) => ({
    ...row,
    price: Number.parseFloat(row.price),
    screenshots: safeParseScreenshots(row.screenshots),
  }))
}

export async function getUserTransactions(userId: string, limit = 10) {
  const result = await sql`
    SELECT 
      t.id, t.listing_id, t.buyer_id, t.seller_id, t.amount, t.commission, t.escrow_status, t.created_at,
      l.title as listing_title,
      CASE 
        WHEN t.buyer_id = ${userId} THEN u_seller.name
        ELSE u_buyer.name
      END as other_user_name,
      CASE 
        WHEN t.buyer_id = ${userId} THEN u_seller.username
        ELSE u_buyer.username
      END as other_user_username
    FROM transactions t
    JOIN listings l ON t.listing_id = l.id
    LEFT JOIN users u_buyer ON t.buyer_id = u_buyer.id
    LEFT JOIN users u_seller ON t.seller_id = u_seller.id
    WHERE t.buyer_id = ${userId} OR t.seller_id = ${userId}
    ORDER BY t.created_at DESC
    LIMIT ${limit}
  `

  return result.map((row: any) => ({
    ...row,
    amount: Number.parseFloat(row.amount),
    commission: Number.parseFloat(row.commission),
  }))
}

export async function getUserStats(userId: string) {
  const [listingsResult, transactionsResult, reviewsResult] = await Promise.all([
    sql`
      SELECT 
        COUNT(*) as total_listings,
        COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_listings
      FROM listings 
      WHERE user_id = ${userId}
    `,
    sql`
      SELECT 
        COUNT(CASE WHEN seller_id = ${userId} THEN 1 END) as total_sales,
        COUNT(CASE WHEN buyer_id = ${userId} THEN 1 END) as total_purchases
      FROM transactions 
      WHERE seller_id = ${userId} OR buyer_id = ${userId}
    `,
    sql`
      SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 0) as average_rating
      FROM reviews 
      WHERE reviewee_id = ${userId}
    `,
  ])

  return {
    totalListings: Number.parseInt(listingsResult[0]?.total_listings || "0"),
    activeListings: Number.parseInt(listingsResult[0]?.active_listings || "0"),
    totalSales: Number.parseInt(transactionsResult[0]?.total_sales || "0"),
    totalPurchases: Number.parseInt(transactionsResult[0]?.total_purchases || "0"),
    totalReviews: Number.parseInt(reviewsResult[0]?.total_reviews || "0"),
    averageRating: Number.parseFloat(reviewsResult[0]?.average_rating || "0"),
  }
}

export async function getUserReviews(userId: string, limit = 10) {
  const result = await sql`
    SELECT 
      r.id, r.rating, r.comment, r.created_at,
      u.name as reviewer_name, u.username as reviewer_username, u.image as reviewer_image
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewee_id = ${userId}
    ORDER BY r.created_at DESC
    LIMIT ${limit}
  `
  return result
}

export async function getLeaderboardData() {
  const result = await sql`
    SELECT 
      u.id, u.name, u.username, u.image, u.is_verified,
      COALESCE(SUM(t.amount - t.commission), 0) as total_sales,
      COUNT(t.id) as listings_sold,
      COALESCE(AVG(r.rating), 0) as average_rating,
      CASE 
        WHEN COALESCE(SUM(t.amount - t.commission), 0) >= 10000 THEN 'Diamond'
        WHEN COALESCE(SUM(t.amount - t.commission), 0) >= 5000 THEN 'Gold'
        WHEN COALESCE(SUM(t.amount - t.commission), 0) >= 1000 THEN 'Silver'
        ELSE 'Bronze'
      END as badge
    FROM users u
    LEFT JOIN transactions t ON u.id = t.seller_id AND t.escrow_status = 'RELEASED'
    LEFT JOIN reviews r ON u.id = r.reviewee_id
    WHERE u.is_banned = false
    GROUP BY u.id, u.name, u.username, u.image, u.is_verified
    HAVING COUNT(t.id) > 0
    ORDER BY total_sales DESC
    LIMIT 50
  `

  return result.map((row: any) => ({
    ...row,
    totalSales: Number.parseFloat(row.total_sales),
    averageRating: Number.parseFloat(row.average_rating),
  }))
}

export async function getAdminStats() {
  const [usersResult, listingsResult, transactionsResult, revenueResult] = await Promise.all([
    sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN last_login > NOW() - INTERVAL '30 days' THEN 1 END) as active_users
      FROM users
    `,
    sql`
      SELECT 
        COUNT(*) as total_listings,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_listings
      FROM listings
    `,
    sql`
      SELECT 
        COUNT(*) as total_transactions,
        COUNT(*)::float / NULLIF(COUNT(DISTINCT listing_id), 0) * 100 as conversion_rate
      FROM transactions
    `,
    sql`
      SELECT 
        COALESCE(SUM(commission), 0) as total_revenue
      FROM transactions 
      WHERE escrow_status = 'RELEASED'
    `,
  ])

  const pendingWithdrawals = await sql`
    SELECT COUNT(*) as pending_withdrawals
    FROM withdrawal_requests 
    WHERE status = 'PENDING'
  `

  return {
    totalUsers: Number.parseInt(usersResult[0]?.total_users || "0"),
    activeUsers: Number.parseInt(usersResult[0]?.active_users || "0"),
    totalListings: Number.parseInt(listingsResult[0]?.total_listings || "0"),
    pendingListings: Number.parseInt(listingsResult[0]?.pending_listings || "0"),
    totalTransactions: Number.parseInt(transactionsResult[0]?.total_transactions || "0"),
    conversionRate: Number.parseFloat(transactionsResult[0]?.conversion_rate || "0"),
    totalRevenue: Number.parseFloat(revenueResult[0]?.total_revenue || "0"),
    pendingWithdrawals: Number.parseInt(pendingWithdrawals[0]?.pending_withdrawals || "0"),
  }
}

export async function createReferral(referrerId: string, referredUserId: string) {
  await sql`
    INSERT INTO referrals (referrer_id, referred_user_id, amount_earned, status, created_at, updated_at)
    VALUES (${referrerId}, ${referredUserId}, 0, 'PENDING', NOW(), NOW())
  `
}

// --- Transactions & withdrawals ---

export async function createTransaction(data: {
  listingId: string
  buyerId: string
  sellerId: string
  amount: number
  commission: number
}) {
  const [row] = await sql`
    INSERT INTO transactions (listing_id, buyer_id, seller_id, amount, commission, escrow_status, created_at, updated_at)
    VALUES (
      ${data.listingId},
      ${data.buyerId},
      ${data.sellerId},
      ${data.amount},
      ${data.commission},
      'HELD',
      NOW(),
      NOW()
    )
    RETURNING id, listing_id, buyer_id, seller_id, amount, commission, escrow_status, created_at
  `

  // Deduct from buyer's wallet
  await sql`
    UPDATE wallets
    SET balance = balance - ${data.amount}, updated_at = NOW()
    WHERE user_id = ${data.buyerId}
  `

  // Record wallet movement for buyer
  await sql`
    INSERT INTO wallet_transactions (user_id, type, amount, status, description, reference_id, created_at)
    VALUES (${data.buyerId}, 'PURCHASE', -${data.amount}, 'COMPLETED', 'Purchase of listing', ${row.id}, NOW())
  `

  return row
}

export async function createWithdrawalRequest(userId: string, amount: number) {
  const [row] = await sql`
    INSERT INTO withdrawal_requests (user_id, amount, status, created_at, updated_at)
    VALUES (${userId}, ${amount}, 'PENDING', NOW(), NOW())
    RETURNING id, amount, status, created_at
  `
  // lock funds in wallet
  await sql`
    UPDATE wallets
    SET balance = balance - ${amount}, updated_at = NOW()
    WHERE user_id = ${userId}
  `
  await sql`
    INSERT INTO wallet_transactions (user_id, type, amount, status, description, reference_id, created_at)
    VALUES (${userId}, 'WITHDRAWAL', -${amount}, 'PENDING', 'Withdrawal request', ${row.id}, NOW())
  `
  return row
}
