"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showOfflineMessage) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-orange-100 border border-orange-200 rounded-lg p-3 z-50">
      <div className="flex items-center gap-2">
        <WifiOff className="w-5 h-5 text-orange-600" />
        <div>
          <p className="text-sm font-medium text-orange-800">You're offline</p>
          <p className="text-xs text-orange-700">
            Some features may not be available. We'll sync when you're back online.
          </p>
        </div>
      </div>
    </div>
  )
}
