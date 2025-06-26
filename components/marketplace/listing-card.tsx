import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/lib/utils"
import type { ListingWithUser } from "@/lib/types"
import { Eye, Star, Users } from "lucide-react"

interface ListingCardProps {
  listing: ListingWithUser
}

export function ListingCard({ listing }: ListingCardProps) {
  const screenshots = Array.isArray(listing.screenshots) ? listing.screenshots : []
  const mainImage = screenshots[0] || "/placeholder.svg?height=200&width=300"

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <Link href={`/listings/${listing.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt={listing.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 left-2">
            <Badge variant={listing.type === "GROUP" ? "default" : "secondary"}>
              {listing.type === "GROUP" ? (
                <>
                  <Users className="h-3 w-3 mr-1" />
                  Group
                </>
              ) : (
                <>
                  <Users className="h-3 w-3 mr-1" />
                  Channel
                </>
              )}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-background/80 backdrop-blur">
              <Eye className="h-3 w-3 mr-1" />
              {listing.views}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline">{listing.niche}</Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">4.5</span>
            <span className="text-sm text-muted-foreground">(12)</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={listing.user.image || ""} alt={listing.user.name || ""} />
            <AvatarFallback className="text-xs">{listing.user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{listing.user.username || listing.user.name}</span>
          {listing.user.isVerified && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              ✓
            </Badge>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>
        </div>
      </CardFooter>
    </Card>
  )
}
