import { NextResponse } from "next/server"
import { getCollection } from "@/lib/firestore"

export async function GET() {
  try {
    const inventory = await getCollection("bloodBank")
    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Error fetching blood bank inventory:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
