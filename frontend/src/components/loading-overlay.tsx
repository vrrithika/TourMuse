"use client"

import { Loader2Icon } from "lucide-react"

interface LoadingOverlayProps {
  message: string
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
        <Loader2Icon className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
        <h3 className="text-lg font-semibold mb-2">AI Working...</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
