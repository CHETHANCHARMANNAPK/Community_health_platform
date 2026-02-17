import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, these would be actual database queries
    const stats = {
      totalBloodDonors: 47,
      totalCleaningDrives: 8,
      totalParticipants: 156,
      upcomingDrives: 3,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
