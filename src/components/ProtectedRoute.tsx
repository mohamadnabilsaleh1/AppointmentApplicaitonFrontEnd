'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/features/authentication/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[] // optional — for role-based access
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Redirect unauthenticated users
      if (!isAuthenticated && !isLoading) {
        router.push('/login')
        return
      }
      console.log("user ==>",user);
      console.log("requiredRoles ==>",requiredRoles);
      // If roles are defined, check if user has access
      if (requiredRoles && !requiredRoles.includes(user?.role ?? '')) {
        router.push('/unauthorized') // or some other route
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  // Check again client-side (in case redirect is delayed)
  if (requiredRoles && !requiredRoles.includes(user?.role ?? '')) {
    return null
  }

  return <>{children}</>
}
