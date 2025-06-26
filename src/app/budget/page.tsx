"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { ArrowLeftIcon, MaximizeIcon as OptimizeIcon } from "lucide-react"
import { mockBudgetData } from "@/lib/mock-data"

export default function BudgetPage() {
  const router = useRouter()
  const [budgetData, setBudgetData] = useState(mockBudgetData)
  const [hotelTier, setHotelTier] = useState("mid-range")

  const handleOptimizeBudget = (category: string) => {
    // Simulate budget optimization
    router.push("/itinerary?optimizing=" + category)
  }

  const updateHotelTier = (tier: string) => {
    setHotelTier(tier)
    // Update budget based on hotel tier
    const tierMultipliers = { budget: 0.7, "mid-range": 1, luxury: 1.8 }
    const multiplier = tierMultipliers[tier as keyof typeof tierMultipliers]
    setBudgetData((prev) => ({
      ...prev,
      accommodation: prev.accommodation * multiplier,
    }))
  }

  const totalBudget = Object.values(budgetData).reduce((sum, value) => sum + value, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Itinerary
          </Button>
          <h1 className="text-3xl font-bold">Budget Summary</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(budgetData).map(([category, amount]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="capitalize font-medium">{category.replace(/([A-Z])/g, " $1")}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${amount}</span>
                          <Button size="sm" variant="outline" onClick={() => handleOptimizeBudget(category)}>
                            <OptimizeIcon className="h-3 w-3 mr-1" />
                            Optimize
                          </Button>
                        </div>
                      </div>
                      <Progress value={(amount / totalBudget) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hotel Tier Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={hotelTier} onValueChange={updateHotelTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget Hotels ($50-80/night)</SelectItem>
                    <SelectItem value="mid-range">Mid-range Hotels ($80-150/night)</SelectItem>
                    <SelectItem value="luxury">Luxury Hotels ($150-300/night)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Tabs defaultValue="daily" className="w-full">
              <TabsList>
                <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
                <TabsTrigger value="activity">By Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <Card>
                  <CardHeader>
                    <CardTitle>Daily Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((day) => (
                        <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>Day {day}</span>
                          <Badge variant="secondary">${Math.round(totalBudget / 3)}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity-wise Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {["Museum Visit", "Local Restaurant", "City Tour", "Shopping"].map((activity) => (
                        <div key={activity} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span>{activity}</span>
                          <Badge variant="secondary">${Math.round(Math.random() * 100 + 20)}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">${totalBudget.toFixed(2)}</div>
                <p className="text-sm text-gray-600 mt-2">
                  Within your $
                  {budgetData.accommodation + budgetData.meals + budgetData.transport + budgetData.activities + 200}{" "}
                  budget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Optimize</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" onClick={() => handleOptimizeBudget("accommodation")}>
                  Optimize Accommodation
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleOptimizeBudget("meals")}>
                  Optimize Meals
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleOptimizeBudget("transport")}>
                  Optimize Transport
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleOptimizeBudget("activities")}>
                  Optimize Activities
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
