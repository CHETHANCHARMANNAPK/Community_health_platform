import { type NextRequest, NextResponse } from "next/server"
import { getCollection, addDocument } from "@/lib/firestore"

export async function GET() {
  try {
    const posts = await getCollection("forumPosts")
    // Sort by creation date descending
    posts.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.title || !data.content || !data.author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const post = await addDocument("forumPosts", {
      title: data.title,
      content: data.content,
      author: data.author,
      authorId: data.authorId || "anonymous",
      category: data.category || "general",
      likes: 0,
      replies: [],
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating forum post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
