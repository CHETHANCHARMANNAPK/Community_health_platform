"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Install HealthCare+</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Install this app for quick access and offline support.
          </p>
          <Button size="sm" className="mt-2" onClick={handleInstall}>
            <Download className="h-3 w-3 mr-1" /> Install
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPrompt(false)}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
