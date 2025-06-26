"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Shield, MessageCircle } from "lucide-react"
import type { ListingWithUser } from "@/lib/types"

interface PurchaseFormProps {
  listing: ListingWithUser
  currentUserId?: string
}

export function PurchaseForm({ listing, currentUserId }: PurchaseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const isOwnListing = currentUserId === listing.userId
  const canPurchase = currentUserId && !isOwnListing && listing.status === "ACTIVE"

  const handlePurchase = async () => {
    if (!currentUserId) {
      router.push("/auth/signin")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create transaction")
      } else {
        toast({
          title: "Purchase Initiated",
          description: "Redirecting to secure payment...",
        })
        // Redirect to payment or transaction page
        router.push(`/transactions/${data.transactionId}`)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Purchase Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-2">{formatPrice(listing.price)}</div>
          <p className="text-sm text-muted-foreground">One-time payment</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!currentUserId ? (
          <Button className="w-full" onClick={() => router.push("/auth/signin")}>
            Sign In to Purchase
          </Button>
        ) : isOwnListing ? (
          <Button className="w-full" disabled>
            Your Own Listing
          </Button>
        ) : listing.status !== "ACTIVE" ? (
          <Button className="w-full" disabled>
            Not Available
          </Button>
        ) : (
          <Button className="w-full" onClick={handlePurchase} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Processing...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </>
            )}
          </Button>
        )}

        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            Secure escrow protection
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            Direct communication with seller
          </div>
        </div>

        {canPurchase && (
          <p className="text-xs text-muted-foreground text-center">
            By purchasing, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </CardContent>
    </Card>
  )
}
