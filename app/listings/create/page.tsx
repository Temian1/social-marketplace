"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { Plus, X } from "lucide-react"

const niches = [
  "Business",
  "Technology",
  "Education",
  "Entertainment",
  "Health",
  "Finance",
  "Sports",
  "News",
  "Lifestyle",
  "Gaming",
  "Travel",
  "Food",
]

export default function CreateListingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    niche: "",
    type: "",
    price: "",
    screenshots: [] as string[],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addScreenshot = () => {
    const url = prompt("Enter screenshot URL:")
    if (url) {
      setFormData((prev) => ({
        ...prev,
        screenshots: [...prev.screenshots, url],
      }))
    }
  }

  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (!formData.title || !formData.description || !formData.niche || !formData.type || !formData.price) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    const price = Number.parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          niche: formData.niche,
          type: formData.type,
          price: price,
          screenshots: formData.screenshots,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create listing")
      } else {
        toast({
          title: "Listing Created",
          description: "Your listing has been submitted for review",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Listing</h1>
        <p className="text-muted-foreground">List your WhatsApp group or channel for sale</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
          <CardDescription>Provide information about your WhatsApp group or channel</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter a catchy title for your listing"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your group/channel offers, member count, activity level, etc."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GROUP">WhatsApp Group</SelectItem>
                    <SelectItem value="CHANNEL">WhatsApp Channel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Niche *</Label>
                <Select value={formData.niche} onValueChange={(value) => handleInputChange("niche", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {niches.map((niche) => (
                      <SelectItem key={niche} value={niche}>
                        {niche}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Screenshots (Optional)</Label>
              <div className="space-y-2">
                {formData.screenshots.map((screenshot, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <img
                      src={screenshot || "/placeholder.svg"}
                      alt={`Screenshot ${index + 1}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="flex-1 text-sm truncate">{screenshot}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeScreenshot(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addScreenshot} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Screenshot URL
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
