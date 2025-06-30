"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, MapPinIcon, SparklesIcon, IndianRupee } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/providers/auth-provider"

const travelStyles = [
  { value: "relaxation", label: "🧘 Relaxation", description: "Peaceful and rejuvenating experiences" },
  { value: "cultural", label: "🎨 Cultural", description: "Museums, art, and local traditions" },
  { value: "adventure", label: "🏞 Adventure", description: "Outdoor activities and thrills" },
  { value: "foodie", label: "🍽️ Foodie", description: "Culinary experiences and local cuisine" },
  { value: "shopping", label: "🛍️ Shopping", description: "Markets, malls, and unique finds" },
  { value: "tourist", label: "📷 Tourist Hotspots", description: "Famous landmarks and attractions" },
]

export default function HomePage() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [budget, setBudget] = useState("")
  const [travelStyle, setTravelStyle] = useState("")
  const [ecoFriendly, setEcoFriendly] = useState(false)
  const [dynamicReplanning, setDynamicReplanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Handle post-login redirect if pending trip data exists
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const pendingTrip = localStorage.getItem("pendingTripData")
      const redirectPath = localStorage.getItem("postLoginRedirect")

      if (pendingTrip && redirectPath === "/itinerary") {
        localStorage.setItem("currentTrip", pendingTrip)
        localStorage.removeItem("pendingTripData")
        localStorage.removeItem("postLoginRedirect")
        router.push("/itinerary")
      }
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location || !dateRange?.from || !dateRange?.to || !budget || !travelStyle) {
      return
    }

    setIsLoading(true)

    // Simulate API call to generate trip plan
    setTimeout(() => {
      const tripData = {
        location,
        dateRange,
        budget: Number.parseInt(budget),
        travelStyle,
        ecoFriendly,
        dynamicReplanning,
        id: Date.now().toString(),
      }

      if (!isAuthenticated) {
        localStorage.setItem("pendingTripData", JSON.stringify(tripData))
        localStorage.setItem("postLoginRedirect", "/itinerary")
        router.push("/auth")
        return
      }

      localStorage.setItem("currentTrip", JSON.stringify(tripData))
      router.push("/itinerary")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50">
      <Navbar />

      {isLoading && <LoadingOverlay message="Generating your perfect trip plan..." />}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            TourMuse-AI Trip Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart travel planning with adaptive itineraries and budget optimization
          </p>
        </div>

        <Card className="max-w-2xl mx-auto shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-pink-600" />
              Plan Your Perfect Trip
            </CardTitle>
            <CardDescription>
              Tell us about your dream destination and we'll create a personalized itinerary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Destination
                </Label>
                <Input
                  id="location"
                  placeholder="Where do you want to go?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Travel Dates
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick your travel dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4" />
                  Budget (Rupees)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="Enter your budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Travel Style</Label>
                <Select value={travelStyle} onValueChange={setTravelStyle} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your travel style" />
                  </SelectTrigger>
                  <SelectContent>
                    {travelStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <div className="flex flex-col">
                          <span>{style.label}</span>
                          <span className="text-sm text-gray-500">{style.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="eco"
                    checked={ecoFriendly}
                    onCheckedChange={(checked) => setEcoFriendly(checked as boolean)}
                  />
                  <Label htmlFor="eco" className="text-sm">
                    🌱 Prefer eco-friendly options
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dynamic"
                    checked={dynamicReplanning}
                    onCheckedChange={(checked) => setDynamicReplanning(checked as boolean)}
                  />
                  <Label htmlFor="dynamic" className="text-sm">
                    🔄 Enable dynamic replanning (weather & events)
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-blue-700 hover:to-red-700"
              >
                Generate My Trip Plan
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
