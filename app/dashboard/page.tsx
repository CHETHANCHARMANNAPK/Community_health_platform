"use client"

import { AuthProvider, useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { HealthTracker } from "@/components/health-tracker"
import { CertificateGenerator } from "@/components/certificate-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Trash2, Award, TrendingUp, Calendar, Trophy } from "lucide-react"

function DashboardContent() {
  const { user } = useAuth()

  // Mock user stats
  const userStats = {
    totalDonations: 3,
    totalDrives: 5,
    totalPoints: 450,
    memberSince: "2025-06-15",
    upcomingEvents: 2,
    badges: ["First Donor", "Regular Volunteer", "Rising Star"],
    recentActivity: [
      { type: "donation", description: "Blood donation at City Hospital", date: "2026-02-10" },
      { type: "drive", description: "Joined Beach Cleanup Drive", date: "2026-02-05" },
      { type: "drive", description: "Joined Park Cleanup", date: "2026-01-20" },
      { type: "donation", description: "Blood donation at Red Cross Center", date: "2026-01-05" },
      { type: "forum", description: "Posted in Community Forum", date: "2025-12-15" },
    ],
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <p className="text-muted-foreground">Sign in to access your personal dashboard.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.displayName || "User"}!</h1>
        <p className="text-muted-foreground mt-1">Track your contributions and health goals.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="h-6 w-6 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userStats.totalDonations}</p>
            <p className="text-xs text-muted-foreground">Donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Trash2 className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userStats.totalDrives}</p>
            <p className="text-xs text-muted-foreground">Drives Joined</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userStats.totalPoints}</p>
            <p className="text-xs text-muted-foreground">Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="h-6 w-6 text-purple-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userStats.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{userStats.upcomingEvents}</p>
            <p className="text-xs text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="health">Health Tracker</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <HealthTracker />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Recent Activity
              </CardTitle>
              <CardDescription>Your latest contributions and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === "donation"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : activity.type === "drive"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-blue-100 dark:bg-blue-900/30"
                    }`}>
                      {activity.type === "donation" ? (
                        <Heart className="h-4 w-4 text-red-500" />
                      ) : activity.type === "drive" ? (
                        <Trash2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type === "donation"
                        ? "+100 pts"
                        : activity.type === "drive"
                          ? "+50 pts"
                          : "+10 pts"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" /> Your Badges
              </CardTitle>
              <CardDescription>Earned through your community contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: "First Donor", icon: "🩸", description: "Completed your first blood donation", earned: true },
                  { name: "Regular Volunteer", icon: "🤝", description: "Participated in 5+ cleaning drives", earned: true },
                  { name: "Rising Star", icon: "🌟", description: "Earned 300+ community points", earned: true },
                  { name: "Super Volunteer", icon: "⭐", description: "Participated in 10+ events", earned: false },
                  { name: "Community Hero", icon: "🦸", description: "Earned 1000+ community points", earned: false },
                  { name: "Blood Champion", icon: "🏆", description: "Donated blood 10+ times", earned: false },
                ].map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-4 rounded-lg border text-center ${
                      badge.earned ? "" : "opacity-40 grayscale"
                    }`}
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <p className="font-semibold mt-2">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    {badge.earned && (
                      <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Earned ✓
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CertificateGenerator
              type="blood-donation"
              name={user.displayName || "Community Member"}
              date="2026-02-10"
              details="Blood Type: A+ | Location: City Hospital"
            />
            <CertificateGenerator
              type="volunteer"
              name={user.displayName || "Community Member"}
              date="2026-02-05"
              details="Beach Cleanup Drive | 5 hours of service"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <DashboardContent />
      </div>
    </AuthProvider>
  )
}
