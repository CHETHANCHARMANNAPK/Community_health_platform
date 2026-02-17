"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Users, Calendar, Heart, Trash2, BarChart3, TrendingUp, Droplets, Activity } from "lucide-react"
import { redirect } from "next/navigation"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts"

const monthlyData = [
  { month: "Jan", donors: 12, drives: 2, participants: 45 },
  { month: "Feb", donors: 19, drives: 3, participants: 67 },
  { month: "Mar", donors: 15, drives: 2, participants: 52 },
  { month: "Apr", donors: 25, drives: 4, participants: 89 },
  { month: "May", donors: 32, drives: 5, participants: 120 },
  { month: "Jun", donors: 28, drives: 3, participants: 95 },
]

const bloodTypeData = [
  { name: "O+", value: 35, color: "#ef4444" },
  { name: "A+", value: 25, color: "#f97316" },
  { name: "B+", value: 20, color: "#eab308" },
  { name: "AB+", value: 8, color: "#22c55e" },
  { name: "O-", value: 5, color: "#3b82f6" },
  { name: "A-", value: 4, color: "#8b5cf6" },
  { name: "B-", value: 2, color: "#ec4899" },
  { name: "AB-", value: 1, color: "#6366f1" },
]

const engagementData = [
  { week: "W1", visits: 320, signups: 12, donations: 5 },
  { week: "W2", visits: 450, signups: 18, donations: 8 },
  { week: "W3", visits: 380, signups: 15, donations: 6 },
  { week: "W4", visits: 520, signups: 22, donations: 11 },
]

interface CleaningDriveForm {
  title: string
  description: string
  location: string
  date: string
  time: string
  maxParticipants: number
  requirements: string
}

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreatingDrive, setIsCreatingDrive] = useState(false)
  const [driveForm, setDriveForm] = useState<CleaningDriveForm>({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    maxParticipants: 20,
    requirements: "",
  })
  const [stats, setStats] = useState({
    totalBloodDonors: 0,
    totalCleaningDrives: 0,
    totalParticipants: 0,
    upcomingDrives: 0,
  })

  useEffect(() => {
    if (!loading && !isAdmin) {
      redirect("/")
    }
  }, [isAdmin, loading])

  useEffect(() => {
    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/cleaning-drives", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...driveForm,
          requirements: driveForm.requirements
            .split(",")
            .map((req) => req.trim())
            .filter(Boolean),
          organizer: user?.displayName || user?.email,
          createdAt: new Date().toISOString(),
          status: "upcoming",
          currentParticipants: 0,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Cleaning drive created successfully.",
        })
        setIsCreatingDrive(false)
        setDriveForm({
          title: "",
          description: "",
          location: "",
          date: "",
          time: "",
          maxParticipants: 20,
          requirements: "",
        })
        fetchStats()
      } else {
        throw new Error("Failed to create drive")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create cleaning drive. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage blood donation registrations and community cleaning drives.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="blood-donors">Blood Donors</TabsTrigger>
          <TabsTrigger value="cleaning-drives">Cleaning Drives</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Blood Donors</p>
                    <p className="text-2xl font-bold">{stats.totalBloodDonors}</p>
                    <p className="text-xs text-green-500 mt-1">+12% from last month</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cleaning Drives</p>
                    <p className="text-2xl font-bold">{stats.totalCleaningDrives}</p>
                    <p className="text-xs text-green-500 mt-1">+3 this month</p>
                  </div>
                  <Trash2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                    <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                    <p className="text-xs text-green-500 mt-1">+28% growth</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Upcoming Drives</p>
                    <p className="text-2xl font-bold">{stats.upcomingDrives}</p>
                    <p className="text-xs text-blue-500 mt-1">Next: Jun 15</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Charts in Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" /> Monthly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="donors" fill="#ef4444" name="Donors" />
                    <Bar dataKey="participants" fill="#3b82f6" name="Participants" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" /> Blood Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={bloodTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {bloodTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" /> Weekly Engagement
                </CardTitle>
                <CardDescription>Site visits, sign-ups, and donations per week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="visits" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Visits" />
                    <Area type="monotone" dataKey="signups" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} name="Sign-ups" />
                    <Area type="monotone" dataKey="donations" stackId="3" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} name="Donations" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Donor Growth Trend
                </CardTitle>
                <CardDescription>Monthly new donor registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="donors" stroke="#ef4444" strokeWidth={2} name="Donors" />
                    <Line type="monotone" dataKey="drives" stroke="#22c55e" strokeWidth={2} name="Drives" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Participation Overview</CardTitle>
                <CardDescription>Comprehensive monthly breakdown of community activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="donors" fill="#ef4444" name="Blood Donors" />
                    <Bar dataKey="drives" fill="#22c55e" name="Cleaning Drives" />
                    <Bar dataKey="participants" fill="#3b82f6" name="Participants" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blood-donors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blood Donor Registrations</CardTitle>
              <CardDescription>View and manage blood donor registrations from the community.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Blood donor management interface would be implemented here with a table showing all registered donors,
                their information, and contact details.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleaning-drives" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Cleaning Drives Management</h2>
            <Button onClick={() => setIsCreatingDrive(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Drive
            </Button>
          </div>

          {isCreatingDrive && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Cleaning Drive</CardTitle>
                <CardDescription>Fill out the details for a new community cleaning drive.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDrive} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Drive Title *</Label>
                      <Input
                        id="title"
                        value={driveForm.title}
                        onChange={(e) => setDriveForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Community Park Cleanup"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={driveForm.location}
                        onChange={(e) => setDriveForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Central Park, Main Street"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={driveForm.date}
                        onChange={(e) => setDriveForm((prev) => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time *</Label>
                      <Input
                        id="time"
                        value={driveForm.time}
                        onChange={(e) => setDriveForm((prev) => ({ ...prev, time: e.target.value }))}
                        placeholder="e.g., 9:00 AM - 2:00 PM"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants">Max Participants *</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={driveForm.maxParticipants}
                        onChange={(e) =>
                          setDriveForm((prev) => ({ ...prev, maxParticipants: Number.parseInt(e.target.value) }))
                        }
                        min="1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                      <Input
                        id="requirements"
                        value={driveForm.requirements}
                        onChange={(e) => setDriveForm((prev) => ({ ...prev, requirements: e.target.value }))}
                        placeholder="e.g., Gloves, Water bottle, Comfortable shoes"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={driveForm.description}
                      onChange={(e) => setDriveForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the cleaning drive, its purpose, and what participants can expect"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Create Drive</Button>
                    <Button type="button" variant="outline" onClick={() => setIsCreatingDrive(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Existing Cleaning Drives</CardTitle>
              <CardDescription>Manage existing cleaning drives and view registrations.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Existing drives management interface would be implemented here with options to edit, delete, and view
                participant lists for each drive.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
