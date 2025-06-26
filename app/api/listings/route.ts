import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getActiveListings, createListing } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || undefined
    const type = searchParams.get("type") || undefined
    const niche = searchParams.get("niche") || undefined
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const sortBy = searchParams.get("sortBy") || "newest"

    const offset = (page - 1) * limit

    const listings = await getActiveListings({
      limit,
      offset,
      search,
      type,
      niche,
      minPrice,
      maxPrice,
      sortBy,
    })

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total: listings.length, // In a real app, you'd get the total count separately
        pages: Math.ceil(listings.length / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, niche, type, price, screenshots } = body

    // Validate required fields
    if (!title || !description || !niche || !type || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const listing = await createListing({
      userId: session.user.id,
      title,
      description,
      niche,
      type,
      price: Number.parseFloat(price),
      screenshots: screenshots || [],
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}
