"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, ThumbsUp, Send, Search, Plus, Clock, Filter } from "lucide-react"

interface Reply {
  id: string
  author: string
  content: string
  createdAt: string
}

interface ForumPost {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  category: string
  likes: number
  replies: Reply[]
  createdAt: string
}

const categoryConfig: Record<string, { label: string; color: string }> = {
  "blood-donation": { label: "Blood Donation", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  hygiene: { label: "Hygiene", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  "cleaning-drives": { label: "Cleaning Drives", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  "mental-health": { label: "Mental Health", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  general: { label: "General", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
}

function ForumContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showNewPost, setShowNewPost] = useState(false)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general" })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/forum")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Error fetching forum posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!user) {
      toast({ title: "Please sign in", description: "You need to sign in to create a post.", variant: "destructive" })
      return
    }
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ title: "Missing fields", description: "Please fill in both title and content.", variant: "destructive" })
      return
    }

    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPost,
          author: user.displayName || user.email,
          authorId: user.uid,
        }),
      })
      if (res.ok) {
        const post = await res.json()
        setPosts((prev) => [post, ...prev])
        setNewPost({ title: "", content: "", category: "general" })
        setShowNewPost(false)
        toast({ title: "Post created!", description: "Your post has been published." })
      }
    } catch {
      toast({ title: "Error", description: "Failed to create post.", variant: "destructive" })
    }
  }

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    )
  }

  const handleReply = (postId: string) => {
    if (!user || !replyContent.trim()) return
    const newReply: Reply = {
      id: `r_${Date.now()}`,
      author: user.displayName || user.email || "Anonymous",
      content: replyContent,
      createdAt: new Date().toISOString(),
    }
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p))
    )
    setReplyContent("")
    toast({ title: "Reply posted!", description: "Your reply has been added." })
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || post.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Connect, share, and learn from your community.</p>
        </div>
        <Button onClick={() => setShowNewPost(!showNewPost)}>
          <Plus className="h-4 w-4 mr-2" /> New Post
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              placeholder="Write your post..."
              rows={4}
              value={newPost.content}
              onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
            />
            <div className="flex gap-4 items-center">
              <Select value={newPost.category} onValueChange={(v) => setNewPost((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, cfg]) => (
                    <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreatePost}>
                <Send className="h-4 w-4 mr-2" /> Publish
              </Button>
              <Button variant="outline" onClick={() => setShowNewPost(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryConfig).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts */}
      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No posts found.</p>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const isExpanded = expandedPost === post.id
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge className={categoryConfig[post.category]?.color || categoryConfig.general.color}>
                          {categoryConfig[post.category]?.label || post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3
                        className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                      >
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        by <span className="font-medium">{post.author}</span>
                      </p>
                      <p className={`text-sm mt-3 whitespace-pre-line ${isExpanded ? "" : "line-clamp-3"}`}>
                        {post.content}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => handleLike(post.id)}>
                      <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" /> {post.replies.length} replies
                    </Button>
                  </div>

                  {/* Replies */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="p-3 bg-accent/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{reply.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{reply.content}</p>
                        </div>
                      ))}
                      {user && (
                        <div className="flex gap-2 mt-3">
                          <Input
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleReply(post.id)}
                          />
                          <Button size="sm" onClick={() => handleReply(post.id)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ForumPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <ForumContent />
      </div>
    </AuthProvider>
  )
}
