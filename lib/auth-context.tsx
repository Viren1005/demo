"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { employees, type Employee } from "./mock-data"

export type UserRole = "admin" | "employee"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  employee: Employee
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Mock authentication - accepts any email/password
    const employee = employees.find((e) => e.email.toLowerCase() === email.toLowerCase()) || employees[0]

    setUser({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      avatar: employee.avatar,
      role,
      employee,
    })
    return true
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
