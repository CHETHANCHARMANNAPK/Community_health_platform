"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Calendar, MapPin, Users, Clock, Trash2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CleaningDrive {
  id: string
  title: string
  description: string
  location: string
  date: string
  time: string
  maxParticipants: number
  currentParticipants: number
  organizer: string
  requirements: string[]
  status: "upcoming" | "ongoing" | "completed"
}

interface RegistrationData {
  fullName: string
  email: string
  phone: string
  experience: string
  availability: string
}

export function CleaningDriveRegistration() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [drives, setDrives] = useState<CleaningDrive[]>([])
  const [selectedDrive, setSelectedDrive] = useState<CleaningDrive | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    fullName: "",
    email: user?.email || "",
    phone: "",
    experience: "",
    availability: "",
  })

  // Fetch cleaning drives from API
  useEffect(() => {
    fetchCleaningDrives()
  }, [])

  const fetchCleaningDrives = async () => {
    try {
      const response = await fetch("/api/cleaning-drives")
      if (response.ok) {
        const data = await response.json()
        setDrives(data)
      }
    } catch (error) {
      console.error("Error fetching cleaning drives:", error)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !selectedDrive) {
      toast({
        title: "Error",
        description: "Please sign in and select a drive to register.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/cleaning-drives/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driveId: selectedDrive.id,
          userId: user.uid,
          ...registrationData,
          registeredAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: `You've been registered for ${selectedDrive.title}. Check your email for details.`,
        })
        setIsRegistering(false)
        setSelectedDrive(null)
        setRegistrationData({
          fullName: "",
          email: user?.email || "",
          phone: "",
          experience: "",
          availability: "",
        })
        fetchCleaningDrives() // Refresh drives to update participant count
      } else {
        throw new Error("Failed to register")
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Unable to register for the cleaning drive. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (drives.length === 0) {
    return (
      <div className="text-center py-12">
        <Trash2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">No Cleaning Drives Available</h3>
        <p className="text-muted-foreground">
          There are currently no cleaning drives scheduled. Check back later or contact an admin to organize one.
        </p>
      </div>
    )
  }

  if (isRegistering && selectedDrive) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Register for Cleaning Drive</CardTitle>
          <CardDescription>
            Register for: <strong>{selectedDrive.title}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData((prev) => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability *</Label>
                <Input
                  id="availability"
                  value={registrationData.availability}
                  onChange={(e) => setRegistrationData((prev) => ({ ...prev, availability: e.target.value }))}
                  placeholder="e.g., Full day, Morning only"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Previous Experience (Optional)</Label>
              <Textarea
                id="experience"
                value={registrationData.experience}
                onChange={(e) => setRegistrationData((prev) => ({ ...prev, experience: e.target.value }))}
                placeholder="Describe any previous volunteering or cleaning experience"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsRegistering(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Community Cleaning Drives</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join our community cleaning initiatives to help maintain a clean and healthy environment. Register for
          upcoming drives and make a difference in your neighborhood.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {drives.map((drive) => (
          <Card key={drive.id} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{drive.title}</CardTitle>
                  <Badge className={getStatusColor(drive.status)}>
                    {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardDescription>{drive.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{drive.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(drive.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{drive.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {drive.currentParticipants}/{drive.maxParticipants} participants
                  </span>
                </div>
              </div>

              {drive.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-1">
                    {drive.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                {drive.status === "upcoming" && drive.currentParticipants < drive.maxParticipants ? (
                  <Button
                    onClick={() => {
                      if (!user) {
                        toast({
                          title: "Sign In Required",
                          description: "Please sign in to register for cleaning drives.",
                          variant: "destructive",
                        })
                        return
                      }
                      setSelectedDrive(drive)
                      setIsRegistering(true)
                    }}
                    className="w-full"
                  >
                    Register for Drive
                  </Button>
                ) : drive.currentParticipants >= drive.maxParticipants ? (
                  <Button disabled className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Drive Full
                  </Button>
                ) : (
                  <Button disabled className="w-full">
                    Registration Closed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
