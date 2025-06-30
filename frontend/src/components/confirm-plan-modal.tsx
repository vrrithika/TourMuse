"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, XIcon } from "lucide-react"

interface ConfirmPlanModalProps {
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmPlanModal({ onConfirm, onCancel }: ConfirmPlanModalProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            Confirm Your Trip Plan
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Are you satisfied with your current itinerary? Once confirmed, your trip will be saved and you can access it
            anytime from "My Trips".
          </p>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your trip will be saved to your account</li>
              <li>• You'll receive email confirmations</li>
              <li>• Dynamic replanning will remain active (if enabled)</li>
              <li>• You can still make changes later</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-green-600 hover:bg-green-700">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Confirm Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
