"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Droplets, RefreshCw, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BloodStock {
  type: string
  units: number
  status: "adequate" | "low" | "critical"
  lastUpdated: string
}

const statusConfig = {
  adequate: { label: "Adequate", color: "bg-green-500", badge: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  low: { label: "Low", color: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  critical: { label: "Critical", color: "bg-red-500", badge: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
}

export function BloodBankInventory() {
  const { toast } = useToast()
  const [inventory, setInventory] = useState<BloodStock[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/blood-bank")
      if (res.ok) {
        const data = await res.json()
        setInventory(data)
      }
    } catch (error) {
      console.error("Error fetching blood bank inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalUnits = inventory.reduce((s, i) => s + i.units, 0)
  const criticalTypes = inventory.filter((i) => i.status === "critical")
  const lowTypes = inventory.filter((i) => i.status === "low")

  const maxUnits = Math.max(...inventory.map((i) => i.units), 1)

  return (
    <div className="space-y-6">
      {/* Alert for critical stocks */}
      {criticalTypes.length > 0 && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">Critical Blood Shortage</h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  The following blood types are critically low:{" "}
                  <strong>{criticalTypes.map((t) => t.type).join(", ")}</strong>.
                  Please donate if you have a matching blood type!
                </p>
                <Button
                  size="sm"
                  variant="destructive"
                  className="mt-2"
                  onClick={() => {
                    toast({
                      title: "Alert Shared",
                      description: "Urgent blood donation request has been shared with the community.",
                    })
                  }}
                >
                  <Bell className="h-3 w-3 mr-1" /> Share Urgent Alert
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Droplets className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{totalUnits}</p>
            <p className="text-sm text-muted-foreground">Total Units Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-bold">{lowTypes.length + criticalTypes.length}</p>
            <p className="text-sm text-muted-foreground">Types Needing Donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Last Updated</p>
            <p className="text-sm text-muted-foreground">
              {inventory[0]
                ? new Date(inventory[0].lastUpdated).toLocaleString()
                : "N/A"}
            </p>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchInventory}>
              <RefreshCw className="h-3 w-3 mr-1" /> Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Stock by Type</CardTitle>
          <CardDescription>Current availability across all blood types</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading inventory...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.map((stock) => {
                const config = statusConfig[stock.status]
                const pct = (stock.units / maxUnits) * 100
                return (
                  <div
                    key={stock.type}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold">{stock.type}</span>
                      <Badge className={config.badge}>{config.label}</Badge>
                    </div>
                    <p className="text-3xl font-bold mb-1">{stock.units}</p>
                    <p className="text-xs text-muted-foreground mb-3">units available</p>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${config.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Donation Compatibility Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Type Compatibility</CardTitle>
          <CardDescription>Who can donate to whom?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4">Blood Type</th>
                  <th className="text-center py-2 px-1">Can Donate To</th>
                  <th className="text-center py-2 px-1">Can Receive From</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {[
                  { type: "O-", donateTo: "All Types", receiveFrom: "O-" },
                  { type: "O+", donateTo: "O+, A+, B+, AB+", receiveFrom: "O-, O+" },
                  { type: "A-", donateTo: "A-, A+, AB-, AB+", receiveFrom: "O-, A-" },
                  { type: "A+", donateTo: "A+, AB+", receiveFrom: "O-, O+, A-, A+" },
                  { type: "B-", donateTo: "B-, B+, AB-, AB+", receiveFrom: "O-, B-" },
                  { type: "B+", donateTo: "B+, AB+", receiveFrom: "O-, O+, B-, B+" },
                  { type: "AB-", donateTo: "AB-, AB+", receiveFrom: "O-, A-, B-, AB-" },
                  { type: "AB+", donateTo: "AB+", receiveFrom: "All Types" },
                ].map((row) => (
                  <tr key={row.type} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-bold">{row.type}</td>
                    <td className="text-center py-2 px-1">{row.donateTo}</td>
                    <td className="text-center py-2 px-1">{row.receiveFrom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
