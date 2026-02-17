"use client"

import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { EventCalendar } from "@/components/event-calendar"

export default function CalendarPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Events Calendar</h1>
            <p className="text-muted-foreground mt-2">
              View and discover upcoming community health events, cleaning drives, and workshops.
            </p>
          </div>
          <EventCalendar />
        </div>
      </div>
    </AuthProvider>
  )
}
