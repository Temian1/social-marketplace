import { Suspense } from "react"
import { getActiveListings } from "@/lib/db"
import { ListingCard } from "@/components/marketplace/listing-card"
import { SearchFilters } from "@/components/marketplace/search-filters"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Marketplace - WhatsApp Market",
  description: "Browse and discover premium WhatsApp groups and channels across all niches",
  openGraph: {
    title: "Marketplace - WhatsApp Market",
    description: "Browse and discover premium WhatsApp groups and channels across all niches",
  },
}

export default async function MarketplacePage() {
  const listings = await getActiveListings({ limit: 20 })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">WhatsApp Marketplace</h1>
        <p className="text-muted-foreground">Discover premium WhatsApp groups and channels across all niches</p>
      </div>

      <div className="mb-8">
        <SearchFilters />
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </Suspense>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No listings found</p>
        </div>
      )}
    </div>
  )
}
