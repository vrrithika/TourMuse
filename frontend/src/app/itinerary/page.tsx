"use client"

import { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ItineraryTimetable } from "@/components/itinerary-timetable"
import { PlaceDetailsModal } from "@/components/place-details-modal"
import { ConfirmPlanModal } from "@/components/confirm-plan-modal"
import { LoadingOverlay } from "@/components/loading-overlay"
import { Navbar } from "@/components/navbar"
import {
  RefreshCwIcon,
  HelpCircleIcon,
  DollarSignIcon,
  CheckCircleIcon,
  DownloadIcon,
  Building2,
} from "lucide-react"
import { mockItineraryData } from "@/lib/mock-data"
import { useAuth } from "@/components/providers/auth-provider"
import { TravelChatbot } from "@/components/travel-chatbot"
// @ts-ignore
import html2pdf from "html2pdf.js"

export default function ItineraryPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const [tripData, setTripData] = useState<any>(null)
  const [itinerary, setItinerary] = useState(mockItineraryData)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isReplanning, setIsReplanning] = useState(false)
  const [whyExplanation, setWhyExplanation] = useState("")

  // Guard: redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else {
        const stored = localStorage.getItem("currentTrip")
        if (stored) {
          setTripData(JSON.parse(stored))
        } else {
          router.push("/")
        }
      }
    }
  }, [isAuthenticated, isLoading, router])

  const handleReplan = () => {
    setIsReplanning(true)
    setTimeout(() => {
      setItinerary({ ...mockItineraryData, lastUpdated: new Date().toISOString() })
      setIsReplanning(false)
    }, 3000)
  }

  const handleWhyClick = () => {
    setWhyExplanation(
      "Our AI selected these places based on your travel style, budget, and preferences."
    )
  }

  const handleExport = () => {
    const element = document.getElementById("itinerary-content")
    if (!element) return

    const opt = {
      margin: 0.5,
      filename: `trip-plan-${tripData?.location || "itinerary"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    }

    html2pdf().from(element).set(opt).save()
  }

  if (isLoading || !tripData) {
    return <LoadingOverlay message="Loading your itinerary..." />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        {/* Remove if using npm import */}
        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script> */}
        <title>TourMuse - Your Itinerary</title>
      </Head>

      <Navbar />

      {isReplanning && <LoadingOverlay message="Generating new plan..." />}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Trip to {tripData.location}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{tripData.travelStyle}</Badge>
            <Badge variant="outline">₹{tripData.budget} budget</Badge>
            {tripData.ecoFriendly && (
              <Badge className="bg-green-100 text-green-800">🌱 Eco-friendly</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Wrap for export */}
                <div id="itinerary-content" className="p-4 bg-white rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Your Trip to {tripData.location}
                  </h2>
                  <ItineraryTimetable itinerary={itinerary} onPlaceClick={setSelectedPlace} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => router.push("/hotels")} className="w-full" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" /> View Hotels
                </Button>

                <Button onClick={() => router.push("/city-guide")} className="w-full" variant="outline">
                  <Building2 className="h-4 w-4 mr-2" /> City Guide
                </Button>

                <Button onClick={handleReplan} className="w-full" variant="outline">
                  <RefreshCwIcon className="h-4 w-4 mr-2" /> Replan Trip
                </Button>

                <Button onClick={handleWhyClick} className="w-full" variant="outline">
                  <HelpCircleIcon className="h-4 w-4 mr-2" /> Why These Places?
                </Button>

                <Button onClick={() => router.push("/budget")} className="w-full" variant="outline">
                  <DollarSignIcon className="h-4 w-4 mr-2" /> View Budget Summary
                </Button>

                <Button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" /> Confirm Plan
                </Button>

                <Button onClick={handleExport} className="w-full" variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" /> Export as PDF
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

      <TravelChatbot currentTrip={tripData} onTripUpdate={setTripData} />

      {selectedPlace && (
        <PlaceDetailsModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}

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
