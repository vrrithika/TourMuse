"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AuthContextType {
  user: any
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>({
  name: "John Doe",
  email: "john@example.com",
})
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const login = async (email: string, password: string) => {
    // Simulate login
    setUser({ name: "John Doe", email })
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
