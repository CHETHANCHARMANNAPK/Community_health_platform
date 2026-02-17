"use client"

import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { BloodBankInventory } from "@/components/blood-bank-inventory"

export default function BloodBankPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Blood Bank Inventory</h1>
            <p className="text-muted-foreground mt-2">
              Real-time blood stock levels. Find out which blood types are needed most.
            </p>
          </div>
          <BloodBankInventory />
        </div>
      </div>
    </AuthProvider>
  )
}
