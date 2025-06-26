import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice, formatDate } from "@/lib/utils"
import { Eye, Users, Calendar, Shield } from "lucide-react"
import type { ListingWithUser } from "@/lib/types"

interface ListingDetailsProps {
  listing: ListingWithUser
}

export function ListingDetails({ listing }: ListingDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Images */}
      {listing.screenshots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listing.screenshots.map((screenshot, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={screenshot || "/placeholder.svg"}
                alt={`${listing.title} screenshot ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Title and Basic Info */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={listing.type === "GROUP" ? "default" : "secondary"}>
            <Users className="h-3 w-3 mr-1" />
            {listing.type}
          </Badge>
          <Badge variant="outline">{listing.niche}</Badge>
          <Badge variant="outline" className="ml-auto">
            <Eye className="h-3 w-3 mr-1" />
            {listing.views} views
          </Badge>
        </div>

        <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="text-4xl font-bold text-primary">{formatPrice(listing.price)}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Listed {formatDate(listing.createdAt)}
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{listing.description}</p>
        </CardContent>
      </Card>

      {/* Seller Info */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={listing.user.image || ""} alt={listing.user.name || ""} />
              <AvatarFallback>{listing.user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{listing.user.name || listing.user.username}</h3>
                {listing.user.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{listing.user.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
