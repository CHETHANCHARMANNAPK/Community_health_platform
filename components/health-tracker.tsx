"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Droplets, Footprints, Apple, Moon, Target, TrendingUp, Plus } from "lucide-react"

interface HealthData {
  water: number
  steps: number
  sleep: number
  calories: number
  weight: number
  height: number
}

interface HealthGoal {
  water: number
  steps: number
  sleep: number
  calories: number
}

const weeklyData = [
  { day: "Mon", water: 6, steps: 8200, sleep: 7, calories: 2100 },
  { day: "Tue", water: 8, steps: 10500, sleep: 8, calories: 1900 },
  { day: "Wed", water: 7, steps: 7800, sleep: 6.5, calories: 2200 },
  { day: "Thu", water: 5, steps: 9200, sleep: 7.5, calories: 2000 },
  { day: "Fri", water: 8, steps: 11000, sleep: 8, calories: 1850 },
  { day: "Sat", water: 6, steps: 6500, sleep: 9, calories: 2300 },
  { day: "Sun", water: 7, steps: 5000, sleep: 8.5, calories: 2150 },
]

export function HealthTracker() {
  const [data, setData] = useState<HealthData>({
    water: 5,
    steps: 7500,
    sleep: 7,
    calories: 1800,
    weight: 70,
    height: 170,
  })

  const [goals] = useState<HealthGoal>({
    water: 8,
    steps: 10000,
    sleep: 8,
    calories: 2000,
  })

  const bmi = data.weight / Math.pow(data.height / 100, 2)
  const bmiCategory =
    bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese"
  const bmiColor =
    bmi < 18.5 ? "text-yellow-500" : bmi < 25 ? "text-green-500" : bmi < 30 ? "text-orange-500" : "text-red-500"

  const metrics = [
    {
      icon: Droplets,
      label: "Water Intake",
      value: data.water,
      goal: goals.water,
      unit: "glasses",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: Footprints,
      label: "Steps",
      value: data.steps,
      goal: goals.steps,
      unit: "steps",
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: Moon,
      label: "Sleep",
      value: data.sleep,
      goal: goals.sleep,
      unit: "hours",
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: Apple,
      label: "Calories",
      value: data.calories,
      goal: goals.calories,
      unit: "kcal",
      color: "text-orange-500",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => {
              const progress = Math.min((metric.value / metric.goal) * 100, 100)
              return (
                <Card key={metric.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                        <metric.icon className={`h-5 w-5 ${metric.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-xl font-bold">
                          {metric.value.toLocaleString()}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            / {metric.goal.toLocaleString()} {metric.unit}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            const increment =
                              metric.label === "Steps" ? 500 : metric.label === "Calories" ? 100 : 1
                            setData((prev) => ({
                              ...prev,
                              [metric.label === "Water Intake"
                                ? "water"
                                : metric.label === "Steps"
                                  ? "steps"
                                  : metric.label === "Sleep"
                                    ? "sleep"
                                    : "calories"]: prev[
                                metric.label === "Water Intake"
                                  ? "water"
                                  : metric.label === "Steps"
                                    ? "steps"
                                    : metric.label === "Sleep"
                                      ? "sleep"
                                      : "calories"
                              ] + increment,
                            }))
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Add Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" /> Daily Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric) => {
                  const progress = Math.min((metric.value / metric.goal) * 100, 100)
                  return (
                    <div key={metric.label} className="flex items-center gap-4">
                      <metric.icon className={`h-4 w-4 ${metric.color} flex-shrink-0`} />
                      <span className="text-sm w-24 flex-shrink-0">{metric.label}</span>
                      <Progress value={progress} className="flex-1 h-3" />
                      <span className="text-sm font-medium w-12 text-right">{Math.round(progress)}%</span>
                      {progress >= 100 && <span className="text-green-500 text-xs">✓ Done!</span>}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Weekly Overview
              </CardTitle>
              <CardDescription>Your health metrics for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">Day</th>
                      <th className="text-center py-2 px-2">
                        <Droplets className="h-4 w-4 text-blue-500 inline" /> Water
                      </th>
                      <th className="text-center py-2 px-2">
                        <Footprints className="h-4 w-4 text-green-500 inline" /> Steps
                      </th>
                      <th className="text-center py-2 px-2">
                        <Moon className="h-4 w-4 text-purple-500 inline" /> Sleep
                      </th>
                      <th className="text-center py-2 px-2">
                        <Apple className="h-4 w-4 text-orange-500 inline" /> Cals
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyData.map((day) => (
                      <tr key={day.day} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium">{day.day}</td>
                        <td className="text-center py-2 px-2">{day.water} glasses</td>
                        <td className="text-center py-2 px-2">{day.steps.toLocaleString()}</td>
                        <td className="text-center py-2 px-2">{day.sleep}h</td>
                        <td className="text-center py-2 px-2">{day.calories}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Water</p>
                  <p className="text-lg font-bold text-blue-500">
                    {(weeklyData.reduce((s, d) => s + d.water, 0) / 7).toFixed(1)} glasses
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Steps</p>
                  <p className="text-lg font-bold text-green-500">
                    {Math.round(weeklyData.reduce((s, d) => s + d.steps, 0) / 7).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Sleep</p>
                  <p className="text-lg font-bold text-purple-500">
                    {(weeklyData.reduce((s, d) => s + d.sleep, 0) / 7).toFixed(1)}h
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Calories</p>
                  <p className="text-lg font-bold text-orange-500">
                    {Math.round(weeklyData.reduce((s, d) => s + d.calories, 0) / 7)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bmi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" /> BMI Calculator
              </CardTitle>
              <CardDescription>Calculate your Body Mass Index</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={data.height}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, height: Number(e.target.value) }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={data.weight}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, weight: Number(e.target.value) }))
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Your BMI</p>
                    <p className={`text-5xl font-bold ${bmiColor}`}>{bmi.toFixed(1)}</p>
                    <p className={`text-lg font-medium mt-2 ${bmiColor}`}>{bmiCategory}</p>
                  </div>
                  <div className="w-full mt-6 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-yellow-500">Underweight</span>
                      <span>&lt; 18.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-500">Normal</span>
                      <span>18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-500">Overweight</span>
                      <span>25.0 - 29.9</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-500">Obese</span>
                      <span>≥ 30.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
