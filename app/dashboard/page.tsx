import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserById, getUserListings, getUserTransactions, getUserStats, getWalletByUserId } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate } from "@/lib/utils"
import Link from "next/link"
import { Plus, Eye, DollarSign, ShoppingBag, Star } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const [user, listings, transactions, stats, wallet] = await Promise.all([
    getUserById(session.user.id),
    getUserListings(session.user.id, 5),
    getUserTransactions(session.user.id, 5),
    getUserStats(session.user.id),
    getWalletByUserId(session.user.id),
  ])

  if (!user) {
    redirect("/auth/signin")
  }

  const dashboardStats = [
    {
      title: "Wallet Balance",
      value: formatPrice(wallet?.balance || 0),
      icon: DollarSign,
      description: "Available balance",
    },
    {
      title: "Active Listings",
      value: stats.activeListings.toString(),
      icon: Eye,
      description: "Currently listed",
    },
    {
      title: "Total Sales",
      value: stats.totalSales.toString(),
      icon: ShoppingBag,
      description: "Completed sales",
    },
    {
      title: "Reviews",
      value: stats.totalReviews.toString(),
      icon: Star,
      description: "Customer reviews",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name || user.username}!</p>
        </div>
        <Button asChild>
          <Link href="/listings/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
            <CardDescription>Your latest WhatsApp group listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{listing.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            listing.status === "ACTIVE"
                              ? "default"
                              : listing.status === "PENDING"
                                ? "secondary"
                                : listing.status === "SOLD"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {listing.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{formatDate(listing.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(listing.price)}</p>
                      <p className="text-sm text-muted-foreground">{listing.views} views</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No listings yet.{" "}
                  <Link href="/listings/create" className="text-primary hover:underline">
                    Create your first listing
                  </Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest purchases and sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{transaction.listing_title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={transaction.buyer_id === session.user.id ? "secondary" : "default"}>
                          {transaction.buyer_id === session.user.id ? "Purchase" : "Sale"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(transaction.amount)}</p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.escrow_status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No transactions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
