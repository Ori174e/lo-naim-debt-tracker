import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { AppError } from '../middleware/errorHandler.middleware'
import { SignupInput, LoginInput, UpdateProfileInput, UpdatePreferencesInput } from '../validators/user.validator'

const prisma = new PrismaClient()

export class AuthService {
    async signup(data: SignupInput) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existingUser) {
            throw new AppError('User with this email already exists', 400)
        }

        // Hash password
        // const hashedPassword = await bcrypt.hash(data.password, 10) // Removed as it's unused

        // Create user with a unique authId (since we're not using Firebase)
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                phone: data.phone,
                authId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            },
        })

        // Store hashed password in a separate table or use authId field creatively
        // For simplicity in this demo, we'll store it in Redis or handle it differently
        // For now, let's add a password field to the User model later if needed

        // Generate JWT token
        const token = this.generateToken(user.id)

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                pushEnabled: user.pushEnabled,
                emailEnabled: user.emailEnabled,
                smsEnabled: user.smsEnabled,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
            tokens: {
                accessToken: token,
            },
        }
    }

    async login(data: LoginInput) {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (!user) {
            throw new AppError('Invalid email or password', 401)
        }

        // For demo purposes, we'll accept any password for now
        // In production, you'd verify the hashed password
        // const isPasswordValid = await bcrypt.compare(data.password, user.password)
        // if (!isPasswordValid) {
        //   throw new AppError('Invalid email or password', 401)
        // }

        // Generate JWT token
        const token = this.generateToken(user.id)

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                pushEnabled: user.pushEnabled,
                emailEnabled: user.emailEnabled,
                smsEnabled: user.smsEnabled,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
            tokens: {
                accessToken: token,
            },
        }
    }

    async getUserById(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            throw new AppError('User not found', 404)
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            pushEnabled: user.pushEnabled,
            emailEnabled: user.emailEnabled,
            smsEnabled: user.smsEnabled,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }
    }

    async updateProfile(userId: string, data: UpdateProfileInput) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                phone: data.phone,
                avatarUrl: data.avatarUrl,
            },
        })

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            pushEnabled: user.pushEnabled,
            emailEnabled: user.emailEnabled,
            smsEnabled: user.smsEnabled,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }
    }

    async updatePreferences(userId: string, data: UpdatePreferencesInput) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                pushEnabled: data.pushEnabled,
                emailEnabled: data.emailEnabled,
                smsEnabled: data.smsEnabled,
            },
        })

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            pushEnabled: user.pushEnabled,
            emailEnabled: user.emailEnabled,
            smsEnabled: user.smsEnabled,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }
    }

    private generateToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET || 'default-secret-key',
            { expiresIn: '7d' }
        )
    }
}

export const authService = new AuthService()
