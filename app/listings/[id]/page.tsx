import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getListingById, getUserReviews } from "@/lib/db"
import { ListingDetails } from "@/components/listings/listing-details"
import { PurchaseForm } from "@/components/listings/purchase-form"
import { ReviewsList } from "@/components/listings/reviews-list"
import type { Metadata } from "next"

interface ListingPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const listing = await getListingById(params.id)

  if (!listing) {
    return {
      title: "Listing Not Found - WhatsApp Market",
    }
  }

  return {
    title: `${listing.title} - WhatsApp Market`,
    description: listing.description,
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: listing.screenshots.length > 0 ? [listing.screenshots[0]] : [],
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const session = await getServerSession(authOptions)
  const listing = await getListingById(params.id)

  if (!listing) {
    notFound()
  }

  const reviews = await getUserReviews(listing.user.id, 5)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ListingDetails listing={listing} />
          <div className="mt-8">
            <ReviewsList reviews={reviews} sellerId={listing.user.id} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <PurchaseForm listing={listing} currentUserId={session?.user?.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
