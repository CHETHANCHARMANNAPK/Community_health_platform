"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, HandHeart, Shield, Sparkles, Users, Heart } from "lucide-react"

const hygieneTopics = [
  {
    icon: Droplets,
    title: "Hand Hygiene",
    description: "Proper handwashing techniques and when to wash your hands",
    tips: [
      "Wash hands for at least 20 seconds with soap and water",
      "Use hand sanitizer with at least 60% alcohol when soap isn't available",
      "Wash before eating, after using restroom, and after coughing/sneezing",
      "Clean under fingernails and between fingers thoroughly",
    ],
    importance: "Prevents 80% of common infections",
  },
  {
    icon: Shield,
    title: "Personal Hygiene",
    description: "Daily hygiene practices for overall health and well-being",
    tips: [
      "Shower or bathe daily with soap and warm water",
      "Brush teeth twice daily and floss regularly",
      "Wear clean clothes and change undergarments daily",
      "Keep hair clean and well-groomed",
    ],
    importance: "Reduces risk of skin infections and dental problems",
  },
  {
    icon: Sparkles,
    title: "Home Hygiene",
    description: "Maintaining a clean and healthy living environment",
    tips: [
      "Clean and disinfect frequently touched surfaces daily",
      "Wash bedding and towels in hot water weekly",
      "Keep kitchen and bathroom areas clean and dry",
      "Ensure proper ventilation in all rooms",
    ],
    importance: "Creates a healthier living environment for families",
  },
  {
    icon: Users,
    title: "Community Hygiene",
    description: "Practices that benefit the entire community's health",
    tips: [
      "Dispose of waste properly in designated bins",
      "Cover mouth and nose when coughing or sneezing",
      "Stay home when sick to prevent spreading illness",
      "Participate in community cleaning initiatives",
    ],
    importance: "Prevents disease outbreaks and promotes public health",
  },
]

const hygieneStats = [
  { label: "Infections Prevented", value: "80%", description: "by proper hand hygiene" },
  { label: "Disease Reduction", value: "50%", description: "with good personal hygiene" },
  { label: "Community Health", value: "90%", description: "improvement with collective effort" },
  { label: "Healthcare Costs", value: "40%", description: "reduction through prevention" },
]

export function HygieneAwareness() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Hygiene Awareness</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Good hygiene practices are essential for maintaining health and preventing the spread of diseases. Learn about
          proper hygiene techniques and their importance for individual and community well-being.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hygieneStats.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hygiene Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hygieneTopics.map((topic, index) => {
          const IconComponent = topic.icon
          return (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  {topic.title}
                </CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Key Practices:</h4>
                  <ul className="space-y-2">
                    {topic.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <Badge variant="secondary" className="text-xs">
                    <Heart className="h-3 w-3 mr-1" />
                    {topic.importance}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Call to Action */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <HandHeart className="h-12 w-12 text-primary mx-auto" />
            <h3 className="text-2xl font-bold text-foreground">Join Our Hygiene Initiative</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Help us spread awareness about the importance of hygiene in our community. Together, we can create a
              healthier environment for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Badge variant="outline">Community Health</Badge>
              <Badge variant="outline">Disease Prevention</Badge>
              <Badge variant="outline">Public Awareness</Badge>
              <Badge variant="outline">Health Education</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
