"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { attendanceRecords, employees } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Search } from "lucide-react"

export function AttendancePage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredRecords = attendanceRecords.filter((record) => {
    // For employees, only show their own records
    if (!isAdmin && record.employeeId !== user?.employee.id) {
      return false
    }

    // Search filter
    if (searchTerm && !record.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Status filter
    if (statusFilter !== "all" && record.status !== statusFilter) {
      return false
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Present":
        return <Badge className="bg-success text-success-foreground">Present</Badge>
      case "Absent":
        return <Badge variant="destructive">Absent</Badge>
      case "Half-day":
        return <Badge className="bg-warning text-warning-foreground">Half-day</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">
          {isAdmin ? "View all employee attendance records" : "View your attendance history"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Attendance Records
          </CardTitle>
          <CardDescription>
            {isAdmin ? "Filter and search employee attendance" : "Your attendance history"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters - Admin only */}
          {isAdmin && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Half-day">Half-day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {isAdmin && <th className="text-left py-3 px-4 font-medium text-muted-foreground">Employee</th>}
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Check In</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Check Out</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const employee = employees.find((e) => e.id === record.employeeId)
                  return (
                    <tr key={record.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      {isAdmin && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={employee?.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{employee?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{record.employeeName}</span>
                          </div>
                        </td>
                      )}
                      <td className="py-3 px-4 text-foreground">{record.date}</td>
                      <td className="py-3 px-4 text-foreground">{record.checkIn || "-"}</td>
                      <td className="py-3 px-4 text-foreground">{record.checkOut || "-"}</td>
                      <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No attendance records found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
