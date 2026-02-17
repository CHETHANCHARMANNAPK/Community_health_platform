"use client"

import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { EmergencySOS } from "@/components/emergency-sos"

export default function EmergencyPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">Emergency SOS & First Aid</h1>
            <p className="text-muted-foreground mt-2">
              Quick access to emergency contacts and step-by-step first aid guides.
            </p>
          </div>
          <EmergencySOS />
        </div>
      </div>
    </AuthProvider>
  )
}
