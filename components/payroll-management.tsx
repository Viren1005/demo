"use client"

import { useState } from "react"
import { employees } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Search, Download, Send } from "lucide-react"

const payrollData = employees.map((emp) => ({
  ...emp,
  salary: 5000 + Math.random() * 3000,
  bonus: Math.random() > 0.5 ? 500 : 0,
  deductions: 500 + Math.random() * 200,
  status: Math.random() > 0.3 ? "Processed" : "Pending",
}))

export function PayrollManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("january-2024")

  const filteredPayroll = payrollData.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPayroll = filteredPayroll.reduce((acc, emp) => acc + emp.salary + emp.bonus - emp.deductions, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payroll Management</h1>
        <p className="text-muted-foreground">Manage employee salaries and payments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              ${totalPayroll.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">For January 2024</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Employees</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{employees.length}</p>
            <p className="text-sm text-muted-foreground">Active payroll entries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Payments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {payrollData.filter((p) => p.status === "Pending").length}
            </p>
            <p className="text-sm text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Payroll Details
              </CardTitle>
              <CardDescription>Review and process employee payments</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Send className="w-4 h-4 mr-2" />
                Process All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january-2024">January 2024</SelectItem>
                <SelectItem value="december-2023">December 2023</SelectItem>
                <SelectItem value="november-2023">November 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Base Salary</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Bonus</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Deductions</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Net Pay</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayroll.map((emp) => (
                  <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={emp.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{emp.department}</td>
                    <td className="py-3 px-4 text-right text-foreground">${emp.salary.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-success">+${emp.bonus.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-destructive">-${emp.deductions.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium text-foreground">
                      ${(emp.salary + emp.bonus - emp.deductions).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge
                        variant={emp.status === "Processed" ? "default" : "secondary"}
                        className={
                          emp.status === "Processed"
                            ? "bg-success text-success-foreground"
                            : "bg-warning text-warning-foreground"
                        }
                      >
                        {emp.status}
                      </Badge>
                    </td>
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
