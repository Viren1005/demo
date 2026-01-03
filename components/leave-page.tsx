"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { leaveRequests as initialLeaveRequests, type LeaveRequest } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, PlusCircle } from "lucide-react"

export function LeavePage() {
  const { user } = useAuth()
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests)
  const [leaveType, setLeaveType] = useState<string>("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  const myRequests = leaveRequests.filter((r) => r.employeeId === user?.employee.id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRequest: LeaveRequest = {
      id: String(Date.now()),
      employeeId: user?.employee.id || "",
      employeeName: user?.name || "",
      type: leaveType as "Paid" | "Sick" | "Unpaid",
      startDate,
      endDate,
      reason,
      status: "Pending",
      submittedAt: new Date().toISOString().split("T")[0],
    }
    setLeaveRequests([newRequest, ...leaveRequests])
    setLeaveType("")
    setStartDate("")
    setEndDate("")
    setReason("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-success text-success-foreground">Approved</Badge>
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "Pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Management</h1>
        <p className="text-muted-foreground">Apply for leave and track your requests</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {myRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No leave requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {myRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{request.type} Leave</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="font-medium text-foreground">
                          {request.startDate} - {request.endDate}
                        </p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Submitted: {request.submittedAt}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-primary" />
                Apply for Leave
              </CardTitle>
              <CardDescription>Submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid Leave</SelectItem>
                      <SelectItem value="Sick">Sick Leave</SelectItem>
                      <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full sm:w-auto">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
