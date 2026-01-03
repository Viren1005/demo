"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, UserCheck, Clock, AlertCircle, Download, Plus, Search } from "lucide-react"
// Note: Ensure your mock-data file exists, or these will return undefined
import { employees, attendanceRecords, leaveRequests } from "@/lib/mock-data"

export function AdminDashboard() {
  // Safety checks in case mock-data is empty or not loaded yet
  const safeEmployees = employees || []
  const safeAttendance = attendanceRecords || []
  const safeLeave = leaveRequests || []

  const presentToday = safeAttendance.filter((r) => r.date === "2024-01-15" && r.status === "Present").length
  const pendingLeaves = safeLeave.filter((r) => r.status === "Pending").length
  const recentActivity = safeAttendance.filter((r) => r.date === "2024-01-15").slice(0, 5)

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Executive Overview</h1>
          <p className="text-muted-foreground mt-1">Real-time organization metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Total Headcount</CardDescription>
            <Users className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{safeEmployees.length}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs font-normal">Active</Badge>
              <span className="text-xs text-muted-foreground">+2 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">On Site Today</CardDescription>
            <UserCheck className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{presentToday}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${safeEmployees.length > 0 ? (presentToday / safeEmployees.length) * 100 : 0}%` }} 
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {safeEmployees.length > 0 ? Math.round((presentToday / safeEmployees.length) * 100) : 0}% rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Action Items</CardDescription>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{pendingLeaves}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Leave requests pending approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Live Attendance Feed
              </CardTitle>
              <CardDescription>Real-time check-in updates</CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="py-4 px-6 font-medium">Employee</th>
                  <th className="py-4 px-6 font-medium">Check In</th>
                  <th className="py-4 px-6 font-medium">Check Out</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentActivity.map((record) => {
                  const employee = safeEmployees.find((e) => e.id === record.employeeId)
                  return (
                    <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 border-2 border-background">
                            <AvatarImage src={employee?.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {employee?.name.charAt(0) || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{record.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{employee?.role || "Staff"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-muted-foreground">{record.checkIn || "--:--"}</td>
                      <td className="py-4 px-6 font-mono text-muted-foreground">{record.checkOut || "--:--"}</td>
                      <td className="py-4 px-6">
                        <Badge
                          className={`rounded-full px-3 py-1 border-0 ${
                            record.status === "Present"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : record.status === "Half-day"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                          }`}
                        >
                          {record.status}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
                {recentActivity.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No activity recorded today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}