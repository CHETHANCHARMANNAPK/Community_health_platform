"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, Heart, Trash2, Award, TrendingUp } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  points: number
  donations: number
  drives: number
  badges: string[]
}

const badgeIcons: Record<string, { icon: string; color: string }> = {
  "First Donor": { icon: "🩸", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  "Super Volunteer": { icon: "⭐", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  "Community Hero": { icon: "🦸", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  "Regular Volunteer": { icon: "🤝", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  "Eco Warrior": { icon: "🌱", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  "Blood Champion": { icon: "🏆", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  "Mentor": { icon: "📚", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  "Rising Star": { icon: "🌟", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
}

const rankIcons = [
  <Trophy key="1" className="h-6 w-6 text-yellow-500" />,
  <Medal key="2" className="h-6 w-6 text-gray-400" />,
  <Medal key="3" className="h-6 w-6 text-amber-600" />,
]

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard")
      if (res.ok) {
        const data = await res.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const maxPoints = leaderboard[0]?.points || 1

  return (
    <div className="space-y-6">
      {/* Points System Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" /> How Points Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
              <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <p className="font-semibold">Blood Donation</p>
              <p className="text-muted-foreground">+100 points</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <Trash2 className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="font-semibold">Cleaning Drive</p>
              <p className="text-muted-foreground">+50 points</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="font-semibold">Forum Post</p>
              <p className="text-muted-foreground">+10 points</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
              <Award className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <p className="font-semibold">Referral</p>
              <p className="text-muted-foreground">+25 points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {[1, 0, 2].map((idx) => {
            const entry = leaderboard[idx]
            if (!entry) return null
            const isFirst = idx === 0
            return (
              <Card
                key={entry.id}
                className={`text-center ${isFirst ? "ring-2 ring-yellow-400 dark:ring-yellow-600 md:-mt-4" : ""}`}
              >
                <CardContent className="pt-6">
                  <div className="mb-2">{rankIcons[idx] || <span className="text-lg font-bold">#{idx + 1}</span>}</div>
                  <p className={`font-bold ${isFirst ? "text-lg" : "text-base"}`}>{entry.name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{entry.points}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {entry.badges.slice(0, 2).map((badge) => (
                      <span key={badge} className="text-xs">
                        {badgeIcons[badge]?.icon || "🏅"}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
          <CardDescription>Community contributors ranked by total points</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading leaderboard...</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="w-8 text-center font-bold text-lg text-muted-foreground">
                    {idx < 3 ? rankIcons[idx] : `#${idx + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{entry.name}</p>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" /> {entry.donations} donations
                      </span>
                      <span className="flex items-center gap-1">
                        <Trash2 className="h-3 w-3 text-green-500" /> {entry.drives} drives
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 ${badgeIcons[badge]?.color || ""}`}
                        >
                          {badgeIcons[badge]?.icon || "🏅"} {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold">{entry.points}</p>
                    <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(entry.points / maxPoints) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
