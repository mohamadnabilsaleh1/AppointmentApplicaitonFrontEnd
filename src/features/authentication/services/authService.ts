// services/authService.ts
import { LoginRequest, LoginResponse, User } from '@/features/authentication/types/auth'

class AuthService {
    private readonly baseURL = "http://localhost:5001/api"
    
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await fetch(`http://localhost:5001/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.errors["User.InvalidCredentials"][0] || `Login failed: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error('Network error occurred during login')
        }
    }

    async getCurrentUser(token: string): Promise<User> {
        try {
            const response = await fetch(`http://localhost:5001/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error('Failed to fetch user data')
            }

            return await response.json()
        } catch (error) {
            throw new Error('Unable to fetch user information')
        }
    }

    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token)
        }
    }

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token')
        }
        return null
    }

    removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token')
        }
    }

    async validateToken(token: string): Promise<boolean> {
        try {
            const response = await fetch(`http://localhost:5001/api/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.ok
        } catch {
            return false
        }
    }
}

export const authService = new AuthService()