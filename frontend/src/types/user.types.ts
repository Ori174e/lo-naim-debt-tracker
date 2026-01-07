export interface User {
    id: string
    email: string
    name: string
    phone?: string
    avatarUrl?: string
    pushEnabled: boolean
    emailEnabled: boolean
    smsEnabled: boolean
    createdAt: string
    updatedAt: string
}

export interface AuthTokens {
    accessToken: string
    refreshToken?: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface SignupData {
    email: string
    password: string
    name: string
    phone?: string
}
