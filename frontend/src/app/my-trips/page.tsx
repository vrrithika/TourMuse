"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { PlusIcon, SearchIcon, EyeIcon, EditIcon, TrashIcon, DownloadIcon } from "lucide-react"
import { getTrips, deleteTrip } from "@/lib/db"
import { useAuth } from "@/components/providers/auth-provider"

export default function MyTripsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [trips, setTrips] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isLoading && isAuthenticated && user) {
        const userTrips = await getTrips(user.uid)
        setTrips(userTrips)
      }
    }
    fetchTrips()
  }, [isAuthenticated, isLoading, user])

  const filteredTrips = trips.filter(
    (trip) =>
      trip.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.travelStyle?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (tripId: string) => {
    router.push(`/itinerary?tripId=${tripId}`)
  }

  const handleEdit = (tripId: string) => {
    router.push(`/?editTripId=${tripId}`)
  }

  const handleDelete = async (tripId: string) => {
    await deleteTrip(tripId)
    setTrips(trips.filter((t) => t.id !== tripId))
  }

  const handleExport = (trip: any) => {
    const element = document.createElement("a")
    const file = new Blob([`Trip to ${trip.location} - ${trip.dateRange?.from?.toDate().toDateString()} to ${trip.dateRange?.to?.toDate().toDateString()}`], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `trip-${trip.location}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <Button onClick={() => router.push("/")}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Plan New Trip
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{trip.location}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {trip.dateRange?.from?.toDate().toDateString()} - {trip.dateRange?.to?.toDate().toDateString()}
                    </p>
                  </div>
                  <Badge variant={trip.status === "confirmed" ? "default" : "secondary"}>{trip.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{trip.travelStyle}</Badge>
                    <Badge variant="outline">₹{trip.budget}</Badge>
                    {trip.ecoFriendly && <Badge className="bg-green-100 text-green-800">🌱 Eco</Badge>}
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(trip.id)}>
                        <EyeIcon className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(trip.id)}>
                        <EditIcon className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleExport(trip)}>
                        <DownloadIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(trip.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No trips found</p>
            <Button onClick={() => router.push("/")}>
              <PlusIcon className="h-4 w-4 mr-2" />
              Plan Your First Trip
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
