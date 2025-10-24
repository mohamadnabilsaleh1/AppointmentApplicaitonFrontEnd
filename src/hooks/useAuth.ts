// hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { LoginRequest, LoginResponse, AuthState, User } from '@/types/auth'

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      authService.setToken(data.accessToken)
      queryClient.setQueryData(['auth'], {
        token: data.accessToken,
        user: data.user,
        isAuthenticated: true,
      })
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<void> => {
      authService.removeToken()
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth'], {
        token: null,
        user: null,
        isAuthenticated: false,
      })
      queryClient.clear()
    },
  })
}

export const useAuth = (): AuthState & { isLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: ['auth'],
    queryFn: async (): Promise<AuthState> => {
      const token = authService.getToken()
      if (!token) {
        return {
          token: null,
          user: null,
          isAuthenticated: false,
        }
      }

      try {
        // Validate token and fetch user data
        const [isValid, user] = await Promise.all([
          authService.validateToken(token),
          authService.getCurrentUser(token),
        ])
        if (!isValid) {
          authService.removeToken()
          return {
            token: null,
            user: null,
            isAuthenticated: false,
          }
        }

        return {
          token,
          user,
          isAuthenticated: true,
        }
      } catch {
        authService.removeToken()
        return {
          token: null,
          user: null,
          isAuthenticated: false,
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  })

  return {
    token: data?.token || null,
    user: data?.user || null,
    isAuthenticated: data?.isAuthenticated || false,
    isLoading,
  }
}