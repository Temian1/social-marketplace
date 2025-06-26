import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getListingById, createTransaction, getWalletByUserId } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { listingId } = await request.json()

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 })
    }

    const listing = await getListingById(listingId)

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (listing.status !== "ACTIVE") {
      return NextResponse.json({ error: "Listing is not available for purchase" }, { status: 400 })
    }

    if (listing.userId === session.user.id) {
      return NextResponse.json({ error: "Cannot purchase your own listing" }, { status: 400 })
    }

    const wallet = await getWalletByUserId(session.user.id)

    if (!wallet || wallet.balance < listing.price) {
      return NextResponse.json(
        {
          error: "Insufficient wallet balance. Please add funds to your wallet first.",
        },
        { status: 400 },
      )
    }

    // Calculate commission (10% default)
    const commission = listing.price * 0.1

    const transaction = await createTransaction({
      listingId: listing.id,
      buyerId: session.user.id,
      sellerId: listing.userId,
      amount: listing.price,
      commission,
    })

    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      message: "Transaction created successfully",
    })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
