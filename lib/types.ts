export interface User {
  id: string
  name: string | null
  email: string
  username: string | null
  image: string | null
  isVerified: boolean
  isBanned: boolean
  isSuspended: boolean
  isAdmin: boolean
  referralCode: string
  referredBy: string | null
  bio: string | null
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface Listing {
  id: string
  userId: string
  title: string
  description: string
  niche: string
  type: "GROUP" | "CHANNEL"
  price: number
  screenshots: string[]
  status: "DRAFT" | "PENDING" | "ACTIVE" | "SOLD" | "DEACTIVATED" | "REJECTED"
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface ListingWithUser extends Listing {
  user: Pick<User, "id" | "name" | "username" | "image" | "isVerified">
}

export interface Transaction {
  id: string
  listingId: string
  buyerId: string
  sellerId: string
  amount: number
  commission: number
  escrowStatus: "PENDING" | "HELD" | "RELEASED" | "REFUNDED" | "DISPUTED"
  paymentId: string | null
  releaseDate: Date | null
  disputeReason: string | null
  deliveryProof: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface UserStats {
  totalListings: number
  activeListings: number
  totalSales: number
  totalPurchases: number
  averageRating: number
  totalReviews: number
}
