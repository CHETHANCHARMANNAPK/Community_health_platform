import { NextResponse } from "next/server"

// Mock data for demonstration
// In a real application, this would come from a database
const mockCleaningDrives = [
  {
    id: "cd_1",
    title: "Community Park Cleanup",
    description:
      "Join us for a comprehensive cleanup of our local community park. We'll be removing litter, weeding garden areas, and maintaining walking paths.",
    location: "Central Community Park, 123 Park Avenue",
    date: "2024-02-15",
    time: "9:00 AM - 2:00 PM",
    maxParticipants: 25,
    currentParticipants: 12,
    organizer: "Admin User",
    requirements: ["Gloves", "Water bottle", "Comfortable shoes", "Sun hat"],
    status: "upcoming" as const,
  },
  {
    id: "cd_2",
    title: "Beach Cleanup Drive",
    description:
      "Help us keep our beaches clean and protect marine life. We'll focus on removing plastic waste and debris from the shoreline.",
    location: "Sunset Beach, Coastal Road",
    date: "2024-02-22",
    time: "7:00 AM - 12:00 PM",
    maxParticipants: 30,
    currentParticipants: 18,
    organizer: "Environmental Team",
    requirements: ["Gloves", "Reusable bags", "Sunscreen", "Water bottle"],
    status: "upcoming" as const,
  },
  {
    id: "cd_3",
    title: "Neighborhood Street Cleanup",
    description:
      "Let's work together to clean up our neighborhood streets and make our community more beautiful and healthy.",
    location: "Main Street District",
    date: "2024-03-01",
    time: "10:00 AM - 3:00 PM",
    maxParticipants: 20,
    currentParticipants: 8,
    organizer: "Community Council",
    requirements: ["Gloves", "Trash bags", "Comfortable clothing"],
    status: "upcoming" as const,
  },
]

export async function GET() {
  try {
    // In a real application, fetch from database
    return NextResponse.json(mockCleaningDrives)
  } catch (error) {
    console.error("Error fetching cleaning drives:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
