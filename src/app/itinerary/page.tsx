"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ItineraryTimetable } from "@/components/itinerary-timetable"
import { PlaceDetailsModal } from "@/components/place-details-modal"
import { ConfirmPlanModal } from "@/components/confirm-plan-modal"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Navbar } from "@/components/navbar"
import { RefreshCwIcon, HelpCircleIcon, DollarSignIcon, CheckCircleIcon, DownloadIcon } from "lucide-react"
import { mockItineraryData } from "@/lib/mock-data"

export default function ItineraryPage() {
  const router = useRouter()
  const [tripData, setTripData] = useState<any>(null)
  const [itinerary, setItinerary] = useState(mockItineraryData)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isReplanning, setIsReplanning] = useState(false)
  const [whyExplanation, setWhyExplanation] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("currentTrip")
    if (stored) {
      setTripData(JSON.parse(stored))
    } else {
      router.push("/")
    }
  }, [router])

  const handleReplan = () => {
    setIsReplanning(true)
    // Simulate AI replanning
    setTimeout(() => {
      setItinerary({ ...mockItineraryData, lastUpdated: new Date().toISOString() })
      setIsReplanning(false)
    }, 3000)
  }

  const handleWhyClick = () => {
    setWhyExplanation(
      "Our AI selected these places based on your cultural travel style preference, budget constraints, and current weather conditions. The morning museum visit avoids afternoon crowds, while the evening restaurant choice offers authentic local cuisine within your budget range.",
    )
  }

  const handleExport = () => {
    // Simulate PDF export
    const element = document.createElement("a")
    const file = new Blob(["Trip Plan Export - This would be a PDF in production"], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `trip-plan-${tripData?.location}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!tripData) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {isReplanning && <LoadingOverlay message="Generating new plan based on latest conditions..." />}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Trip to {tripData.location}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{tripData.travelStyle}</Badge>
            <Badge variant="outline">${tripData.budget} budget</Badge>
            {tripData.ecoFriendly && <Badge className="bg-green-100 text-green-800">🌱 Eco-friendly</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <ItineraryTimetable itinerary={itinerary} onPlaceClick={setSelectedPlace} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleReplan} className="w-full" variant="outline">
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Replan Trip
                </Button>

                <Button onClick={handleWhyClick} className="w-full" variant="outline">
                  <HelpCircleIcon className="h-4 w-4 mr-2" />
                  Why These Places?
                </Button>

                <Button onClick={() => router.push("/budget")} className="w-full" variant="outline">
                  <DollarSignIcon className="h-4 w-4 mr-2" />
                  View Budget Summary
                </Button>

                <Button onClick={() => setShowConfirmModal(true)} className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Confirm Plan
                </Button>

                <Button onClick={handleExport} className="w-full" variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
              </CardContent>
            </Card>

            {whyExplanation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Explanation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{whyExplanation}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {selectedPlace && <PlaceDetailsModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />}

      {showConfirmModal && (
        <ConfirmPlanModal
          onConfirm={() => {
            setShowConfirmModal(false)
            router.push("/my-trips")
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  )
}
