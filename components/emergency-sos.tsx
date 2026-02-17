"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Phone, MapPin, AlertTriangle, Heart, Shield, Thermometer, Zap, Droplets, Bug, Flame } from "lucide-react"

const emergencyContacts = [
  { name: "Emergency Services", number: "911", description: "Police, Fire, Ambulance", icon: Phone, color: "text-red-500" },
  { name: "Poison Control", number: "1-800-222-1222", description: "For poisoning emergencies", icon: AlertTriangle, color: "text-purple-500" },
  { name: "Crisis Hotline", number: "988", description: "Suicide & Crisis Lifeline (24/7)", icon: Heart, color: "text-pink-500" },
  { name: "Red Cross", number: "1-800-733-2767", description: "Disaster relief & blood services", icon: Shield, color: "text-red-600" },
  { name: "Nearest Hospital", number: "Check Local Listings", description: "Find your nearest emergency room", icon: MapPin, color: "text-blue-500" },
]

const firstAidGuides = [
  {
    icon: Heart,
    title: "CPR (Cardiopulmonary Resuscitation)",
    severity: "critical",
    steps: [
      "Check the scene is safe and call 911 immediately",
      "Check for responsiveness — tap shoulders and shout",
      "If unresponsive, place the person on a firm, flat surface",
      "Place the heel of one hand on the center of chest, other hand on top",
      "Push hard and fast — 2 inches deep, 100-120 compressions per minute",
      "After 30 compressions, give 2 rescue breaths (tilt head back, lift chin)",
      "Continue until help arrives or the person starts breathing",
    ],
  },
  {
    icon: Droplets,
    title: "Severe Bleeding",
    severity: "critical",
    steps: [
      "Call 911 for heavy bleeding that won't stop",
      "Apply firm, direct pressure to the wound with a clean cloth",
      "Keep pressing — don't lift the cloth to check",
      "If blood soaks through, add more cloth on top (don't remove the first)",
      "Elevate the injured limb above the heart if possible",
      "Apply a tourniquet 2-3 inches above the wound if bleeding won't stop",
      "Keep the person warm and calm until help arrives",
    ],
  },
  {
    icon: Flame,
    title: "Burns",
    severity: "moderate",
    steps: [
      "Remove the person from the source of the burn",
      "Cool the burn with cool (not cold) running water for 10-20 minutes",
      "Do NOT apply ice, butter, or toothpaste to the burn",
      "Remove jewelry or tight clothing near the burn before swelling",
      "Cover with a sterile, non-stick bandage or clean cloth",
      "Take over-the-counter pain relief if needed",
      "Seek medical attention for burns larger than 3 inches or on face/hands/joints",
    ],
  },
  {
    icon: Zap,
    title: "Choking",
    severity: "critical",
    steps: [
      "Ask 'Are you choking?' — if they can't speak, cough, or breathe, act immediately",
      "Call 911 or have someone else call",
      "Stand behind the person and wrap your arms around their waist",
      "Make a fist with one hand, place it just above the navel",
      "Grasp your fist with the other hand",
      "Give quick, upward abdominal thrusts (Heimlich maneuver)",
      "Repeat until the object is expelled or the person can breathe",
    ],
  },
  {
    icon: Thermometer,
    title: "Heat Stroke",
    severity: "moderate",
    steps: [
      "Call 911 — heat stroke is a medical emergency",
      "Move the person to a cool, shaded area",
      "Remove excess clothing",
      "Cool the person rapidly: apply cold water or ice packs to neck, armpits, and groin",
      "Fan the person while misting with cool water",
      "Do NOT give them anything to drink if they're confused or unconscious",
      "Monitor body temperature and continue cooling until it drops to 101-102°F",
    ],
  },
  {
    icon: Bug,
    title: "Allergic Reaction (Anaphylaxis)",
    severity: "critical",
    steps: [
      "Call 911 immediately for severe allergic reactions",
      "If the person has an EpiPen, help them use it on the outer thigh",
      "Have them lie down with legs elevated (unless they're having trouble breathing)",
      "Loosen tight clothing",
      "If they stop breathing, begin CPR",
      "Do NOT give oral medications if they're having trouble swallowing",
      "A second EpiPen dose can be given after 5-15 minutes if symptoms persist",
    ],
  },
]

const severityColors = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  minor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export function EmergencySOS() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="contacts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="first-aid">First Aid Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          {/* Quick Call Button */}
          <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <Phone className="h-12 w-12 text-red-500 mx-auto mb-3 animate-pulse" />
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">Emergency? Call 911</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  For life-threatening emergencies, call emergency services immediately.
                </p>
                <Button
                  variant="destructive"
                  size="lg"
                  className="mt-4"
                  onClick={() => window.open("tel:911")}
                >
                  <Phone className="h-5 w-5 mr-2" /> Call 911 Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact) => (
              <Card key={contact.name} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent">
                      <contact.icon className={`h-6 w-6 ${contact.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{contact.name}</h3>
                      <p className="text-lg font-bold text-primary">{contact.number}</p>
                      <p className="text-sm text-muted-foreground">{contact.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`tel:${contact.number.replace(/\D/g, "")}`)}
                    >
                      <Phone className="h-3 w-3 mr-1" /> Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Nearest Hospital Finder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" /> Find Nearest Hospital
              </CardTitle>
              <CardDescription>Use your location to find the closest emergency room</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const { latitude, longitude } = pos.coords
                      window.open(
                        `https://www.google.com/maps/search/hospital+emergency+room/@${latitude},${longitude},14z`,
                        "_blank"
                      )
                    })
                  } else {
                    window.open("https://www.google.com/maps/search/hospital+emergency+room", "_blank")
                  }
                }}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" /> Find Hospitals Near Me
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="first-aid" className="space-y-4">
          <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-800 dark:text-amber-200">Important Disclaimer</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    These guides are for informational purposes only. Always call emergency services for serious
                    medical situations. Professional first aid training is highly recommended.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {firstAidGuides.map((guide) => (
              <Card key={guide.title}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <guide.icon className="h-5 w-5" />
                      {guide.title}
                    </CardTitle>
                    <Badge className={severityColors[guide.severity as keyof typeof severityColors]}>
                      {guide.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {guide.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="font-bold text-primary flex-shrink-0 w-5">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
