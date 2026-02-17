"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useI18n } from "@/components/i18n-provider"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { NotificationBell } from "@/components/notification-bell"
import {
  Menu, X, User, LogOut, Settings, AlertCircle, Heart, Droplets, Calendar,
  MessageSquare, BookOpen, Trophy, Activity, Phone, LayoutDashboard, ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

const mainNavLinks = [
  { href: "/#blood-donation", labelKey: "nav.bloodDonation", icon: Heart },
  { href: "/#hygiene", labelKey: "nav.hygiene", icon: Droplets },
  { href: "/#cleaning-drives", labelKey: "nav.cleaningDrives", icon: Activity },
]

const moreNavLinks = [
  { href: "/blood-bank", labelKey: "nav.bloodBank", icon: Droplets },
  { href: "/calendar", labelKey: "nav.calendar", icon: Calendar },
  { href: "/forum", labelKey: "nav.forum", icon: MessageSquare },
  { href: "/blog", labelKey: "nav.blog", icon: BookOpen },
  { href: "/leaderboard", labelKey: "nav.leaderboard", icon: Trophy },
  { href: "/emergency", labelKey: "nav.emergency", icon: Phone },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signIn, signOut, isAdmin, error, loading } = useAuth()
  const { t } = useI18n()

  return (
    <>
      {error && (
        <Alert variant="destructive" className="rounded-none border-x-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-foreground">
                HealthCare+
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium hover:text-primary px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  {t(link.labelKey)}
                </Link>
              ))}

              {/* More dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-sm font-medium">
                    More <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {moreNavLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="flex items-center gap-2">
                        <link.icon className="h-4 w-4" />
                        {t(link.labelKey)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium hover:text-primary px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-1">
              <DarkModeToggle />
              <LanguageSwitcher />
              <NotificationBell />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline max-w-24 truncate">{user.displayName || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} disabled={loading}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {loading ? t("common.loading") : t("auth.signOut")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={signIn} size="sm" disabled={loading}>
                  {loading ? t("common.loading") : t("auth.signIn")}
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 space-y-1 border-t">
              <p className="text-xs text-muted-foreground px-2 mb-2 font-semibold uppercase">Main</p>
              {mainNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 py-2 px-2 text-sm font-medium hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {t(link.labelKey)}
                </Link>
              ))}
              <p className="text-xs text-muted-foreground px-2 mt-3 mb-2 font-semibold uppercase">Features</p>
              {moreNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 py-2 px-2 text-sm font-medium hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  {t(link.labelKey)}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 py-2 px-2 text-sm font-medium hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 py-2 px-2 text-sm font-medium hover:text-primary hover:bg-accent rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
