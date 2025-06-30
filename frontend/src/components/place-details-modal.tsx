"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPinIcon, ClockIcon, DollarSignIcon, CloudIcon, CalendarIcon, ExternalLinkIcon } from "lucide-react"

interface PlaceDetailsModalProps {
  place: any
  onClose: () => void
}

export function PlaceDetailsModal({ place, onClose }: PlaceDetailsModalProps) {
  if (!place) return null

  return (
    <Dialog open={!!place} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{place.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src={place.image || "/placeholder.svg?height=200&width=300"}
              alt={place.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{place.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {place.time} ({place.duration})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSignIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-green-600">${place.cost}</span>
                {place.entryFee && <Badge variant="outline">Entry: ${place.entryFee}</Badge>}
              </div>

              <div className="flex items-center gap-2">
                <CloudIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{place.weather}</span>
              </div>

              {place.transport && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{place.transport}</Badge>
                  <span className="text-sm text-gray-600">Transport cost: ${place.transportCost || 10}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {place.description ||
                `${place.name} is a wonderful destination that offers unique experiences. Perfect for your ${place.category || "cultural"} travel style, this location provides great value within your budget range.`}
            </p>
          </div>

          {place.events && place.events.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Local Events
              </h4>
              <div className="space-y-2">
                {place.events.map((event: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-sm">{event.name}</div>
                    <div className="text-xs text-gray-600">{event.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-2">Location Map</h4>
            <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm">Interactive map would be here</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="flex-1">
              <ExternalLinkIcon className="h-4 w-4 mr-2" />
              View on Maps
            </Button>
            <Button variant="outline" className="flex-1">
              Add to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
