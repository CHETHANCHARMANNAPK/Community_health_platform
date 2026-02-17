"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Heart, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BloodDonationData {
  fullName: string
  email: string
  phone: string
  age: string
  bloodType: string
  weight: string
  lastDonation: string
  medicalConditions: string
  emergencyContact: string
  emergencyPhone: string
}

export function BloodDonationForm() {
  const { user, error } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<BloodDonationData>({
    fullName: "",
    email: user?.email || "",
    phone: "",
    age: "",
    bloodType: "",
    weight: "",
    lastDonation: "",
    medicalConditions: "",
    emergencyContact: "",
    emergencyPhone: "",
  })
  const [errors, setErrors] = useState<Partial<BloodDonationData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<BloodDonationData> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Phone number must be 10 digits"
    if (!formData.age || Number.parseInt(formData.age) < 18 || Number.parseInt(formData.age) > 65) {
      newErrors.age = "Age must be between 18 and 65"
    }
    if (!formData.bloodType) newErrors.bloodType = "Blood type is required"
    if (!formData.weight || Number.parseInt(formData.weight) < 50) {
      newErrors.weight = "Weight must be at least 50 kg"
    }
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = "Emergency contact is required"
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency phone is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: error || "Please sign in to register for blood donation.",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/blood-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user.uid,
          submittedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        toast({
          title: "Registration Successful!",
          description: "Thank you for registering as a blood donor. We'll contact you soon.",
        })
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BloodDonationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-bold text-green-700">Registration Successful!</h3>
            <p className="text-muted-foreground">
              Thank you for registering as a blood donor. Our team will contact you within 2-3 business days to schedule your donation appointment.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Register Another Donor
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Blood Donor Registration
        </CardTitle>
        <CardDescription>
          Help save lives by becoming a blood donor. Please fill out the form below with accurate information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Enter your age"
                min="18"
                max="65"
              />
              {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type *</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
              {errors.bloodType && <p className="text-sm text-red-500">{errors.bloodType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="Enter your weight"
                min="50"
              />
              {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastDonation">Last Donation Date</Label>
              <Input
                id="lastDonation"
                type="date"
                value={formData.lastDonation}
                onChange={(e) => handleInputChange("lastDonation", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder="Enter emergency contact name"
              />
              {errors.emergencyContact && <p className="text-sm text-red-500">{errors.emergencyContact}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
              <Input
                id="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                placeholder="Enter emergency contact phone"
              />
              {errors.emergencyPhone && <p className="text-sm text-red-500">{errors.emergencyPhone}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions / Medications</Label>
            <Textarea
              id="medicalConditions"
              value={formData.medicalConditions}
              onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
              placeholder="Please list any medical conditions, medications, or allergies"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !user || !!error}>
            {isSubmitting
              ? "Submitting..."
              : user
                ? "Register as Blood Donor"
                : error
                  ? "Authentication Error"
                  : "Sign In to Register"}
          </Button>

          {(!user || error) && (
            <p className="text-sm text-muted-foreground text-center">
              {error ? "Authentication is currently unavailable." : "Please sign in to register for blood donation."}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
