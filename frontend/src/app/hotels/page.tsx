"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import {
  StarIcon,
  WifiIcon,
  CarIcon,
  UtensilsIcon,
  DumbbellIcon,
  ShowerHeadIcon as SwimmingPoolIcon,
  LeafIcon,
  MapPinIcon,
  DollarSignIcon,
  FilterIcon,
  HeartIcon,
  ShareIcon,
} from "lucide-react"
import { mockHotelsData } from "@/lib/mock-data"

export default function HotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState(mockHotelsData)
  const [filteredHotels, setFilteredHotels] = useState(mockHotelsData)
  const [selectedTier, setSelectedTier] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("price")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])

  const amenityIcons = {
    wifi: WifiIcon,
    parking: CarIcon,
    restaurant: UtensilsIcon,
    gym: DumbbellIcon,
    pool: SwimmingPoolIcon,
    spa: LeafIcon,
  }

  useEffect(() => {
    filterHotels()
  }, [selectedTier, priceRange, selectedAmenities, sortBy, searchQuery])

  const filterHotels = () => {
    const filtered = hotels.filter((hotel) => {
      const matchesTier = selectedTier === "all" || hotel.tier === selectedTier
      const matchesPrice = hotel.pricePerNight >= priceRange[0] && hotel.pricePerNight <= priceRange[1]
      const matchesAmenities =
        selectedAmenities.length === 0 || selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      const matchesSearch =
        searchQuery === "" ||
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesTier && matchesPrice && matchesAmenities && matchesSearch
    })

    // Sort hotels
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerNight - b.pricePerNight
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredHotels(filtered)
  }

  const toggleFavorite = (hotelId: string) => {
    setFavorites((prev) => (prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities((prev) => (checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)))
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "budget":
        return "bg-green-100 text-green-800"
      case "mid-range":
        return "bg-blue-100 text-blue-800"
      case "luxury":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "budget":
        return "Budget Hostel"
      case "mid-range":
        return "Mid-Range Hotel"
      case "luxury":
        return "Luxury Hotel"
      default:
        return tier
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hotels & Accommodations</h1>
          <p className="text-gray-600">Find the perfect place to stay for your trip</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Hotel name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Hotel Tier */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Hotel Type</label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="budget">Budget Hostels</SelectItem>
                      <SelectItem value="mid-range">Mid-Range Hotels</SelectItem>
                      <SelectItem value="luxury">Luxury Hotels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]} per night
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Amenities</label>
                  <div className="space-y-2">
                    {Object.entries(amenityIcons).map(([amenity, Icon]) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                        />
                        <label htmlFor={amenity} className="text-sm flex items-center gap-2 cursor-pointer">
                          <Icon className="h-4 w-4" />
                          {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price (Low to High)</SelectItem>
                      <SelectItem value="rating">Rating (High to Low)</SelectItem>
                      <SelectItem value="name">Name (A to Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotels Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">{filteredHotels.length} hotels found</p>
              <Tabs value={selectedTier} onValueChange={setSelectedTier}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="mid-range">Mid-Range</TabsTrigger>
                  <TabsTrigger value="luxury">Luxury</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => (
                <Card key={hotel.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="relative">
                    <img
                      src={hotel.images[0] || "/placeholder.svg?height=200&width=400"}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={getTierColor(hotel.tier)}>{getTierLabel(hotel.tier)}</Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleFavorite(hotel.id)}
                      >
                        <HeartIcon
                          className={`h-4 w-4 ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <ShareIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {hotel.ecoFriendly && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-green-100 text-green-800">
                          <LeafIcon className="h-3 w-3 mr-1" />
                          Eco-Friendly
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{hotel.name}</h3>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPinIcon className="h-4 w-4" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.description}</p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity) => {
                        const Icon = amenityIcons[amenity as keyof typeof amenityIcons]
                        return Icon ? (
                          <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                            <Icon className="h-3 w-3" />
                            <span>{amenity}</span>
                          </div>
                        ) : null
                      })}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">+{hotel.amenities.length - 4} more</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <DollarSignIcon className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">${hotel.pricePerNight}</span>
                        <span className="text-sm text-gray-600">/night</span>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>

                    {hotel.specialOffers && hotel.specialOffers.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <Badge variant="outline" className="text-xs">
                          🎉 {hotel.specialOffers[0]}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No hotels found matching your criteria</p>
                <Button
                  onClick={() => {
                    setSelectedTier("all")
                    setPriceRange([0, 500])
                    setSelectedAmenities([])
                    setSearchQuery("")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
