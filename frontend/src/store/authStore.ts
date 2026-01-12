import { create } from 'zustand'
import { User, LoginCredentials, SignupData } from '../types/user.types'
import { authService } from '../services/auth.service'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (credentials: LoginCredentials) => Promise<void>
    signup: (data: SignupData) => Promise<void>
    logout: () => void
    initializeAuth: () => Promise<void>
    clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (credentials) => {
        try {
            set({ isLoading: true, error: null })
            const { user, tokens } = await authService.login(credentials)
            localStorage.setItem('accessToken', tokens.accessToken)
            if (tokens.refreshToken) {
                localStorage.setItem('refreshToken', tokens.refreshToken)
            }
            set({ user, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Login failed',
                isLoading: false,
            })
            throw error
        }
    },

    signup: async (data) => {
        try {
            set({ isLoading: true, error: null })
            const { user, tokens } = await authService.signup(data)
            localStorage.setItem('accessToken', tokens.accessToken)
            if (tokens.refreshToken) {
                localStorage.setItem('refreshToken', tokens.refreshToken)
            }
            set({ user, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Signup failed',
                isLoading: false,
            })
            throw error
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        set({ user: null, isAuthenticated: false })
    },

    initializeAuth: async () => {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            set({ isLoading: false })
            return
        }

        try {
            const user = await authService.getCurrentUser()
            set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            set({ user: null, isAuthenticated: false, isLoading: false })
        }
    },

    clearError: () => set({ error: null }),
}))
