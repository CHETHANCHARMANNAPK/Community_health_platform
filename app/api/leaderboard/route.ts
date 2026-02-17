import { NextResponse } from "next/server"
import { getCollection } from "@/lib/firestore"

export async function GET() {
  try {
    const leaderboard = await getCollection("leaderboard")
    // Sort by points descending
    leaderboard.sort((a: any, b: any) => b.points - a.points)
    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
