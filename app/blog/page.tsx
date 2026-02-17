"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Clock, User, ArrowRight, BookOpen } from "lucide-react"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
  image: string
}

const categoryColors: Record<string, string> = {
  health: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  hygiene: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  environment: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "mental-health": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
}

function BlogContent() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/blog")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category)))]

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8" /> Health Blog
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Read the latest articles on health, hygiene, and community wellness.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat === "all" ? "All" : cat.replace("-", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading articles...</p>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                {/* Image/Emoji Header */}
                <div className="h-40 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center rounded-t-lg">
                  <span className="text-6xl">{post.image}</span>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={categoryColors[post.category] || "bg-gray-100 text-gray-800"}>
                      {post.category.replace("-", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {post.readTime} min read
                    </span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BlogPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <BlogContent />
      </div>
    </AuthProvider>
  )
}
