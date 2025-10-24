// types/auth.ts
export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  firstName: string,
  lastName:string
  avatar?: string
  role?: string
}

export interface LoginResponse {
  accessToken: string
  user: User
}

export interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
}