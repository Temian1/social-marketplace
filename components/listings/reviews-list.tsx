import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: Date
  reviewer_name: string | null
  reviewer_username: string | null
  reviewer_image: string | null
}

interface ReviewsListProps {
  reviews: Review[]
  sellerId: string
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No reviews yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={r.reviewer_image || ""} alt={r.reviewer_name || ""} />
              <AvatarFallback>{r.reviewer_name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                  />
                ))}
              </div>
              <p className="text-sm font-medium">{r.reviewer_name || r.reviewer_username}</p>
              {r.comment && <p className="text-sm">{r.comment}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
