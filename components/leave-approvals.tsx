"use client"

import { useState } from "react"
import { leaveRequests as initialLeaveRequests, employees, type LeaveRequest } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckSquare, Check, X, Calendar } from "lucide-react"

export function LeaveApprovals() {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests)

  const pendingRequests = leaveRequests.filter((r) => r.status === "Pending")
  const processedRequests = leaveRequests.filter((r) => r.status !== "Pending")

  const handleApprove = (id: string) => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" as const } : r)))
  }

  const handleReject = (id: string) => {
    setLeaveRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" as const } : r)))
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

  const LeaveRequestCard = ({ request, showActions }: { request: LeaveRequest; showActions: boolean }) => {
    const employee = employees.find((e) => e.id === request.employeeId)

    return (
      <div className="p-4 border border-border rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={employee?.avatar || "/placeholder.svg"} />
              <AvatarFallback>{request.employeeName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{request.employeeName}</span>
                {getStatusBadge(request.status)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {request.startDate} - {request.endDate}
                </span>
              </div>
              <Badge variant="outline">{request.type} Leave</Badge>
              <p className="text-sm text-muted-foreground mt-2">{request.reason}</p>
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button size="sm" className="bg-success hover:bg-success/90" onClick={() => handleApprove(request.id)}>
                <Check className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                <X className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leave Approvals</h1>
        <p className="text-muted-foreground">Review and process leave requests</p>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            Approval Queue
          </CardTitle>
          <CardDescription>{pendingRequests.length} requests pending</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No pending requests</div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <LeaveRequestCard key={request.id} request={request} showActions={true} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Processed</CardTitle>
          <CardDescription>Previously approved or rejected requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processedRequests.map((request) => (
              <LeaveRequestCard key={request.id} request={request} showActions={false} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
