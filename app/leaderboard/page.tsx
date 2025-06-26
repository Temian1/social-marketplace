import { cn } from "@/lib/utils"
import { getLeaderboardData } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatPrice } from "@/lib/utils"
import { Trophy, Medal, Award, Star, Crown } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leaderboard - WhatsApp Market",
  description: "Top sellers and performers on WhatsApp Market",
}

export default async function LeaderboardPage() {
  const leaderboard = await getLeaderboardData()

  const getBadgeIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4" />
      case 2:
        return <Trophy className="h-4 w-4" />
      case 3:
        return <Medal className="h-4 w-4" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  const getBadgeVariant = (rank: number) => {
    switch (rank) {
      case 1:
        return "default"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Top performers on WhatsApp Market</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {leaderboard.slice(0, 3).map((user, index) => (
          <Card
            key={user.id}
            className={cn(
              "text-center",
              index === 0 && "ring-2 ring-yellow-500",
              index === 1 && "ring-2 ring-gray-400",
              index === 2 && "ring-2 ring-amber-600",
            )}
          >
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className={cn("relative", index === 0 && "scale-110")}>
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -top-2 -right-2" variant={getBadgeVariant(index + 1)}>
                    {getBadgeIcon(index + 1)}#{index + 1}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{user.name || user.username}</CardTitle>
              <CardDescription>
                <div className="flex items-center justify-center gap-1">
                  {user.isVerified && (
                    <Badge variant="secondary" className="text-xs">
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {user.badge}
                  </Badge>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Sales:</span>
                  <span className="font-semibold">{formatPrice(user.totalSales)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Listings Sold:</span>
                  <span className="font-semibold">{user.listingsSold}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{user.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
          <CardDescription>All top sellers ranked by total sales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge variant={getBadgeVariant(index + 1)}>#{index + 1}</Badge>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{user.name || user.username}</h3>
                      {user.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {user.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.listingsSold} sales • {user.averageRating.toFixed(1)} ⭐
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatPrice(user.totalSales)}</p>
                  <p className="text-sm text-muted-foreground">Total earnings</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
