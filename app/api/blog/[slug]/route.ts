import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/firestore"

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const posts = await getCollection("blogPosts")
    const post = posts.find((p: any) => p.slug === params.slug)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
