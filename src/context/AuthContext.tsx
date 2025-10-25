'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, useLogin, useLogout } from '@/features/authentication/hooks/useAuth'
import { LoginRequest, User } from '@/features/authentication/types/auth'

interface AuthContextType {
  login: (credentials: LoginRequest) => Promise<User> // ✅ returns user now
  logout: () => Promise<void>
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  isLoggingOut: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  // ✅ Fix: return the logged-in user
  const login = async (credentials: LoginRequest) => {
    const data = await loginMutation.mutateAsync(credentials)
    return data.user // <-- get user directly from API response
  }

  const logout = async () => {
    await logoutMutation.mutateAsync()
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated: auth.isAuthenticated,
        user: auth.user,
        isLoading: auth.isLoading,
        isLoggingOut: logoutMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider')
  return context
}
