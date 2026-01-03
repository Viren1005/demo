"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, TrendingUp, Play, Square, MapPin, AlertCircle } from "lucide-react"

export function EmployeeDashboard() {
  const { user } = useAuth()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)

  // Hydration fix: only set time after mount
  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCheckInOut = () => {
    if (!isCheckedIn) {
      setCheckInTime(new Date())
    } else {
      setCheckInTime(null)
    }
    setIsCheckedIn(!isCheckedIn)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!currentTime) return null

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Section with Branding Gradient */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-sidebar-primary rounded-3xl p-6 md:p-10 text-primary-foreground shadow-lg relative overflow-hidden">
        {/* Abstract shapes for visual flair */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight">
                Hello, {user?.name?.split(" ")[0] || "Team Member"}
              </h1>
              <p className="text-primary-foreground/80 flex items-center gap-2 text-sm md:text-base">
                <Calendar className="w-4 h-4" />
                {formatDate(currentTime)}
              </p>
            </div>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 px-4 py-1.5 backdrop-blur-sm">
              Shift: Morning A
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Tracker */}
        <Card className="border-0 shadow-md ring-1 ring-black/5 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              Shift Management
            </CardTitle>
            <CardDescription>Record your daily activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="text-center md:text-left">
                <p className="text-5xl font-bold text-foreground font-mono tracking-tighter">
                  {formatTime(currentTime)}
                </p>
                {isCheckedIn && checkInTime && (
                  <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center justify-center md:justify-start gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active since {formatTime(checkInTime)}
                  </p>
                )}
              </div>
              <Button
                size="lg"
                className={`w-full h-14 text-lg font-semibold transition-all duration-300 shadow-md ${
                  isCheckedIn 
                    ? "bg-destructive/90 hover:bg-destructive text-white hover:scale-[1.02]" 
                    : "bg-emerald-600 hover:bg-emerald-700 text-white hover:scale-[1.02]"
                }`}
                onClick={handleCheckInOut}
              >
                {isCheckedIn ? (
                  <>
                    <Square className="w-5 h-5 mr-2 fill-current" />
                    End Shift
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Start Shift
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-primary/70 font-medium">Monthly Adherence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-2">
                <p className="text-3xl font-bold text-primary">98%</p>
                <TrendingUp className="w-6 h-6 text-primary/50" />
              </div>
              <Progress value={98} className="h-2 bg-primary/20" />
              <p className="text-xs text-muted-foreground mt-2">Top 5% of team</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Available Leave</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Days Remaining</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 sm:col-span-2">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Upcoming Team Meeting</p>
                <p className="text-sm text-muted-foreground">Tomorrow at 10:00 AM • Room 302</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}