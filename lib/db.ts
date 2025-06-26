import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

export const sql = neon(process.env.DATABASE_URL)

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

  if (type) {
    whereClause += ` AND l.type = $${paramIndex}`
    params.push(type)
    paramIndex++
  }

  if (niche) {
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

  // run the query - Neon’s sql.query() sometimes returns { rows }
  // and in older versions it returns the rows array directly.
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
    screenshots: JSON.parse(row.screenshots || "[]"),
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
    screenshots: JSON.parse(row.screenshots || "[]"),
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
    screenshots: JSON.parse(row.screenshots || "[]"),
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

export async function createReferral(referrerId: string, referredUserId: string) {
  await sql`
    INSERT INTO referrals (referrer_id, referred_user_id, amount_earned, status, created_at, updated_at)
    VALUES (${referrerId}, ${referredUserId}, 0, 'PENDING', NOW(), NOW())
  `
}
