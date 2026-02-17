"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: "cleaning-drive" | "blood-donation" | "health-workshop" | "community"
  location?: string
  time?: string
}

const eventTypeConfig = {
  "cleaning-drive": { label: "Cleaning Drive", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", dot: "bg-green-500" },
  "blood-donation": { label: "Blood Donation", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", dot: "bg-red-500" },
  "health-workshop": { label: "Workshop", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", dot: "bg-blue-500" },
  "community": { label: "Community", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", dot: "bg-purple-500" },
}

const sampleEvents: CalendarEvent[] = [
  { id: "e1", title: "Community Park Cleanup", date: "2026-03-15", type: "cleaning-drive", location: "Central Park", time: "9:00 AM - 2:00 PM" },
  { id: "e2", title: "Blood Donation Camp", date: "2026-03-18", type: "blood-donation", location: "City Hospital", time: "10:00 AM - 4:00 PM" },
  { id: "e3", title: "Beach Cleanup Drive", date: "2026-03-22", type: "cleaning-drive", location: "Sunset Beach", time: "7:00 AM - 12:00 PM" },
  { id: "e4", title: "Hygiene Workshop", date: "2026-03-25", type: "health-workshop", location: "Community Center", time: "2:00 PM - 4:00 PM" },
  { id: "e5", title: "Health Fair", date: "2026-04-01", type: "community", location: "Town Square", time: "9:00 AM - 5:00 PM" },
  { id: "e6", title: "Street Cleanup", date: "2026-04-05", type: "cleaning-drive", location: "Main Street", time: "10:00 AM - 3:00 PM" },
  { id: "e7", title: "First Aid Training", date: "2026-02-20", type: "health-workshop", location: "Fire Station", time: "1:00 PM - 3:00 PM" },
  { id: "e8", title: "Blood Drive Marathon", date: "2026-02-25", type: "blood-donation", location: "Sports Complex", time: "8:00 AM - 6:00 PM" },
  { id: "e9", title: "Nutrition Workshop", date: "2026-02-28", type: "health-workshop", location: "Library Hall", time: "3:00 PM - 5:00 PM" },
  { id: "e10", title: "River Cleanup", date: "2026-03-08", type: "cleaning-drive", location: "Riverside Park", time: "8:00 AM - 1:00 PM" },
]

export function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad the start of the calendar to align with day of week
  const startPadding = monthStart.getDay()
  const paddedDays = [...Array(startPadding).fill(null), ...days]

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return sampleEvents.filter((event) => event.date === dateStr)
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const upcomingEvents = sampleEvents
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()) }}>
                  Today
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {paddedDays.map((day, idx) => {
                if (!day) return <div key={`pad-${idx}`} className="h-12" />
                const events = getEventsForDate(day)
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isTodayDate = isToday(day)
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-12 rounded-lg text-sm relative flex flex-col items-center justify-start pt-1 transition-colors hover:bg-accent
                      ${isSelected ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
                      ${isTodayDate && !isSelected ? "bg-accent font-bold" : ""}
                      ${!isSameMonth(day, currentMonth) ? "text-muted-foreground/40" : ""}
                    `}
                  >
                    <span className="text-xs">{format(day, "d")}</span>
                    {events.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {events.slice(0, 3).map((event) => (
                          <span
                            key={event.id}
                            className={`h-1.5 w-1.5 rounded-full ${eventTypeConfig[event.type].dot} ${isSelected ? "bg-primary-foreground" : ""}`}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
              {Object.entries(eventTypeConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <span className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
                  {config.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedEvents.map((event) => (
                      <div key={event.id} className="p-3 rounded-lg border">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{event.title}</p>
                            {event.time && <p className="text-xs text-muted-foreground">{event.time}</p>}
                            {event.location && <p className="text-xs text-muted-foreground">{event.location}</p>}
                          </div>
                          <Badge className={eventTypeConfig[event.type].color}>
                            {eventTypeConfig[event.type].label}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No events on this date.</p>
                )
              ) : (
                <p className="text-sm text-muted-foreground">Click a date on the calendar to see events.</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Events</CardTitle>
              <CardDescription>Next community health events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 cursor-pointer hover:bg-accent/50 p-2 rounded-lg transition-colors"
                    onClick={() => {
                      setSelectedDate(new Date(event.date))
                      setCurrentMonth(new Date(event.date))
                    }}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${eventTypeConfig[event.type].dot}`} />
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {event.time ? ` · ${event.time}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
