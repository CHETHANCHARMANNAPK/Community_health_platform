"use client"

import { BloodDonationForm } from "@/components/blood-donation-form"
import { HygieneAwareness } from "@/components/hygiene-awareness"
import { CleaningDriveRegistration } from "@/components/cleaning-drive-registration"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { useI18n } from "@/components/i18n-provider"
import Link from "next/link"
import {
  Droplets, Calendar, MessageSquare, BookOpen, Trophy, Phone, Activity,
  Heart, Layout,
} from "lucide-react"

const featureCards = [
  { href: "/blood-bank", labelKey: "nav.bloodBank", descKey: "bloodBank.subtitle", icon: Droplets, color: "text-red-500 bg-red-100 dark:bg-red-900/30" },
  { href: "/calendar", labelKey: "nav.calendar", descKey: "calendar.subtitle", icon: Calendar, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
  { href: "/forum", labelKey: "nav.forum", descKey: "forum.subtitle", icon: MessageSquare, color: "text-green-500 bg-green-100 dark:bg-green-900/30" },
  { href: "/blog", labelKey: "nav.blog", descKey: "blog.subtitle", icon: BookOpen, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" },
  { href: "/leaderboard", labelKey: "nav.leaderboard", descKey: "leaderboard.subtitle", icon: Trophy, color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" },
  { href: "/emergency", labelKey: "nav.emergency", descKey: "emergency.subtitle", icon: Phone, color: "text-red-600 bg-red-100 dark:bg-red-900/30" },
  { href: "/dashboard", labelKey: "nav.dashboard", descKey: "dashboard.subtitle", icon: Layout, color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30" },
  { href: "/dashboard", labelKey: "hygiene.title", descKey: "hygiene.subtitle", icon: Activity, color: "text-teal-500 bg-teal-100 dark:bg-teal-900/30" },
]

function HomeContent() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PWAInstallPrompt />
      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">{t("hero.title")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#blood-donation"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              <Heart className="h-5 w-5" /> {t("nav.bloodDonation")}
            </Link>
            <Link
              href="/emergency"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Phone className="h-5 w-5" /> {t("nav.emergency")}
            </Link>
            <Link
              href="/blood-bank"
              className="inline-flex items-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-accent transition-colors"
            >
              <Droplets className="h-5 w-5" /> {t("nav.bloodBank")}
            </Link>
          </div>
        </section>

        {/* Feature Showcase Grid */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">{t("common.viewAll")}</h2>
            <p className="text-muted-foreground">{t("hero.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featureCards.map((feature) => (
              <Link
                key={feature.labelKey}
                href={feature.href}
                className="group p-4 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition-all text-center"
              >
                <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-3`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{t(feature.labelKey)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t(feature.descKey)}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Blood Donation Section */}
        <section id="blood-donation" className="scroll-mt-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("blood.title")}</h2>
            <p className="text-muted-foreground">
              {t("blood.subtitle")}
            </p>
          </div>
          <BloodDonationForm />
        </section>

        {/* Hygiene Awareness Section */}
        <section id="hygiene" className="scroll-mt-20">
          <HygieneAwareness />
        </section>

        {/* Cleaning Drive Registration */}
        <section id="cleaning-drives" className="scroll-mt-20">
          <CleaningDriveRegistration />
        </section>

        {/* Footer */}
        <footer className="border-t pt-8 pb-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HealthCare+ Community Health Platform. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-3 flex-wrap">
            <Link href="/blog" className="hover:text-primary transition-colors">{t("nav.blog")}</Link>
            <Link href="/forum" className="hover:text-primary transition-colors">{t("nav.forum")}</Link>
            <Link href="/calendar" className="hover:text-primary transition-colors">{t("nav.calendar")}</Link>
            <Link href="/emergency" className="hover:text-primary transition-colors">{t("nav.emergency")}</Link>
            <Link href="/leaderboard" className="hover:text-primary transition-colors">{t("nav.leaderboard")}</Link>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  )
}
