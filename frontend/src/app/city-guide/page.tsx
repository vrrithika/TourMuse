"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockCityGuideData } from "@/lib/mock-data"
import { useState } from "react"

export default function CityGuidePage() {
  const [showEco, setShowEco] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">City Guide</h1>
        <p className="text-gray-600 mb-8">Useful information to make your trip smoother</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Visa Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mockCityGuideData.visaInfo}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public Transport Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mockCityGuideData.publicTransportTips}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Customs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{mockCityGuideData.localCustoms}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {mockCityGuideData.localEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3"> Green Environment </h2>
          <Button
            onClick={() => setShowEco(!showEco)}
            variant="outline"
            className="flex items-center gap-2"
          >
            🌱 {showEco ? "Hide Eco-Friendly Suggestions" : "Show Eco-Friendly Suggestions"}
          </Button>
          
        </div>

        {showEco && (
          <Card>
            <CardHeader>
              <CardTitle>Eco-Friendly Suggestions</CardTitle>
              <Badge className="bg-green-100 text-green-800">Eco</Badge>
            </CardHeader>
            <CardContent>
              <p>{mockCityGuideData.ecoFriendlySuggestions}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
