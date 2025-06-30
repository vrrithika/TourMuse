"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClockIcon, MapPinIcon, CloudIcon } from "lucide-react"

interface ItineraryTimetableProps {
  itinerary: any
  onPlaceClick: (place: any) => void
}

export function ItineraryTimetable({ itinerary, onPlaceClick }: ItineraryTimetableProps) {
  return (
    <div className="space-y-6">
      {itinerary.days.map((day: any, dayIndex: number) => (
        <div key={dayIndex}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Day {dayIndex + 1}
            <Badge variant="outline">{day.date}</Badge>
          </h3>

          <div className="space-y-3">
            {day.activities.map((activity: any, activityIndex: number) => (
              <Card
                key={activityIndex}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onPlaceClick(activity)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ClockIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{activity.time}</span>
                        <Badge variant="secondary">{activity.duration}</Badge>
                      </div>

                      <h4 className="font-semibold text-lg mb-1">{activity.name}</h4>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPinIcon className="h-3 w-3" />
                        <span>{activity.location}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{activity.description}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-green-600">${activity.cost}</span>
                        <span className="flex items-center gap-1">
                          <CloudIcon className="h-3 w-3" />
                          {activity.weather}
                        </span>
                        {activity.transport && <Badge variant="outline">{activity.transport}</Badge>}
                      </div>
                    </div>

                    <div className="ml-4">
                      <img
                        src={activity.image || "/placeholder.svg?height=80&width=80"}
                        alt={activity.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
