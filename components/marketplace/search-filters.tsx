"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("ALL_TYPES")
  const [selectedNiche, setSelectedNiche] = useState("ALL_NICHES")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState("newest")

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

  const activeFilters = [
    selectedType !== "ALL_TYPES" && { key: "type", value: selectedType, label: `Type: ${selectedType}` },
    selectedNiche !== "ALL_NICHES" && { key: "niche", value: selectedNiche, label: `Niche: ${selectedNiche}` },
    (priceRange[0] > 0 || priceRange[1] < 1000) && {
      key: "price",
      value: priceRange,
      label: `Price: $${priceRange[0]} - $${priceRange[1]}`,
    },
  ].filter(Boolean)

  const handleSearch = () => {
    onFiltersChange({
      search: searchQuery,
      type: selectedType,
      niche: selectedNiche,
      priceRange,
      sortBy,
    })
  }

  const clearFilter = (filterKey: string) => {
    switch (filterKey) {
      case "type":
        setSelectedType("ALL_TYPES")
        break
      case "niche":
        setSelectedNiche("ALL_NICHES")
        break
      case "price":
        setPriceRange([0, 1000])
        break
    }
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedType("ALL_TYPES")
    setSelectedNiche("ALL_NICHES")
    setPriceRange([0, 1000])
    setSortBy("newest")
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search WhatsApp groups and channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {/* Quick Filters & Sort */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_TYPES">All Types</SelectItem>
              <SelectItem value="GROUP">Groups</SelectItem>
              <SelectItem value="CHANNEL">Channels</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedNiche} onValueChange={setSelectedNiche}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Niche" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL_NICHES">All Niches</SelectItem>
              {niches.map((niche) => (
                <SelectItem key={niche} value={niche}>
                  {niche}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your search results</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <Label>Price Range</Label>
                  <div className="mt-2">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter.key} variant="secondary" className="gap-1">
              {filter.label}
              <X className="h-3 w-3 cursor-pointer" onClick={() => clearFilter(filter.key)} />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
