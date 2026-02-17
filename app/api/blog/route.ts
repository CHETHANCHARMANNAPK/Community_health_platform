import { NextResponse } from "next/server"
import { getCollection } from "@/lib/firestore"

export async function GET() {
  try {
    const posts = await getCollection("blogPosts")
    // Sort by publish date descending, return list without full content
    const list = posts
      .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map(({ content, ...rest }: any) => rest)
    return NextResponse.json(list)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
