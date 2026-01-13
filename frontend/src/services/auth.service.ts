import api from './api'
import { User, LoginCredentials, SignupData, AuthTokens } from '../types/user.types'

interface AuthResponse {
    user: User
    tokens: AuthTokens
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post('/auth/login', credentials)
        return response.data
    },

    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await api.post('/auth/signup', data)
        return response.data
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get('/auth/me')
        return response.data
    },

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await api.patch('/auth/profile', data)
        return response.data
    },

    async updateNotificationPreferences(preferences: {
        pushEnabled?: boolean
        emailEnabled?: boolean
        smsEnabled?: boolean
    }): Promise<User> {
        const response = await api.patch('/auth/preferences', preferences)
        return response.data
    },

    async updatePassword(data: any): Promise<User> {
        const response = await api.put('/auth/update-password', data)
        return response.data
    },

    async updateEmail(data: { email: string }): Promise<User> {
        const response = await api.put('/auth/update-email', data)
        return response.data
    },
}
