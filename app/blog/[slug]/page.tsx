"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Share2, BookOpen } from "lucide-react"

interface BlogPostFull {
  id: string
  title: string
  slug: string
  content: string
  author: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
  image: string
}

function BlogPostContent() {
  const params = useParams()
  const [post, setPost] = useState<BlogPostFull | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [params.slug])

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${params.slug}`)
      if (res.ok) {
        const data = await res.json()
        setPost(data)
      }
    } catch (error) {
      console.error("Error fetching blog post:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
        <Link href="/blog">
          <Button><ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog</Button>
        </Link>
      </div>
    )
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    return content.split("\n").map((line, idx) => {
      if (line.startsWith("# ")) {
        return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>
      }
      if (line.startsWith("## ")) {
        return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>
      }
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-xl font-semibold mt-4 mb-2">{line.slice(4)}</h3>
      }
      if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.*?)\*\*:?\s*(.*)/)
        if (match) {
          return (
            <li key={idx} className="ml-4 mb-2 list-disc">
              <strong>{match[1]}</strong>{match[2] ? `: ${match[2]}` : ""}
            </li>
          )
        }
      }
      if (line.startsWith("- ")) {
        return <li key={idx} className="ml-4 mb-1 list-disc">{line.slice(2)}</li>
      }
      if (line.match(/^\d+\.\s/)) {
        return <li key={idx} className="ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>
      }
      if (line.trim() === "") {
        return <br key={idx} />
      }
      // Bold text
      const rendered = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      return <p key={idx} className="mb-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: rendered }} />
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/blog">
        <Button variant="ghost" size="sm" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
        </Button>
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-6xl">{post.image}</span>
        <div className="flex items-center justify-center gap-3 mt-4 mb-4">
          <Badge className="capitalize">{post.category.replace("-", " ")}</Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readTime} min read
          </span>
        </div>
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {post.author}
          </span>
          <span>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Content */}
      <article className="prose dark:prose-invert max-w-none">
        {renderContent(post.content)}
      </article>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>

      {/* Share */}
      <div className="flex items-center gap-3 mt-6 pt-6 border-t">
        <span className="text-sm text-muted-foreground">Share this article:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: post.title, url: window.location.href })
            } else {
              navigator.clipboard.writeText(window.location.href)
            }
          }}
        >
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
      </div>
    </div>
  )
}

export default function BlogPostPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <BlogPostContent />
      </div>
    </AuthProvider>
  )
}
