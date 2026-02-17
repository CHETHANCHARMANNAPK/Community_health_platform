"use client"

import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Leaderboard } from "@/components/leaderboard"

export default function LeaderboardPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Community Leaderboard</h1>
            <p className="text-muted-foreground mt-2">
              Recognize our top contributors and earn points for your community participation.
            </p>
          </div>
          <Leaderboard />
        </div>
      </div>
    </AuthProvider>
  )
}
