"use client"

import { useState } from "react"
import { Bell, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "urgent"
  read: boolean
  createdAt: string
}

const defaultNotifications: Notification[] = [
  {
    id: "n1",
    title: "Urgent: B- Blood Needed",
    message: "Blood bank is critically low on B- blood type. Please donate if you can!",
    type: "urgent",
    read: false,
    createdAt: "2026-02-17T08:00:00Z",
  },
  {
    id: "n2",
    title: "Beach Cleanup This Saturday",
    message: "Don't forget the beach cleanup drive this Saturday at 7 AM. See you there!",
    type: "info",
    read: false,
    createdAt: "2026-02-16T14:00:00Z",
  },
  {
    id: "n3",
    title: "Donation Confirmed",
    message: "Your blood donation registration has been confirmed. Thank you for saving lives!",
    type: "success",
    read: false,
    createdAt: "2026-02-15T10:00:00Z",
  },
  {
    id: "n4",
    title: "New Health Article",
    message: "Check out our latest article on mental health and community wellness.",
    type: "info",
    read: true,
    createdAt: "2026-02-14T16:00:00Z",
  },
]

const typeStyles: Record<string, string> = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-6" onClick={markAllRead}>
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 border-b last:border-0 cursor-pointer hover:bg-accent/50 transition-colors ${
                  !notification.read ? "bg-accent/20" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${typeStyles[notification.type]}`}>
                        {notification.type}
                      </Badge>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm font-medium truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
