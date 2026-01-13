import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { AppError } from '../middleware/errorHandler.middleware'
import { SignupInput, LoginInput, UpdateProfileInput, UpdatePreferencesInput, UpdatePasswordInput, UpdateEmailInput } from '../validators/user.validator'

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
        const hashedPassword = await bcrypt.hash(data.password, 10)

        // Create user with a unique authId (since we're not using Firebase)
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                phone: data.phone,
                authId: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                password: hashedPassword,
            },
        })

        // Generate JWT token
        const token = this.generateToken(user.id)

        return {
            user: this.mapUserResponse(user),
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

        // Verify password if it exists
        if (user.password) {
            const isPasswordValid = await bcrypt.compare(data.password, user.password)
            if (!isPasswordValid) {
                throw new AppError('Invalid email or password', 401)
            }
        } else {
            // Fallback for old demo users (optional: force reset later)
            // For now, allow login if no password set (demo mode)
        }

        // Generate JWT token
        const token = this.generateToken(user.id)

        return {
            user: this.mapUserResponse(user),
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

        return this.mapUserResponse(user)
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

        return this.mapUserResponse(user)
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

        return this.mapUserResponse(user)
    }

    async updatePassword(userId: string, data: UpdatePasswordInput) {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw new AppError('User not found', 404)

        // Verify old password
        if (user.password) {
            const isValid = await bcrypt.compare(data.oldPassword, user.password)
            if (!isValid) throw new AppError('Incorrect old password', 400)
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10)

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return this.mapUserResponse(updatedUser)
    }

    async updateEmail(userId: string, data: UpdateEmailInput) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
        if (existingUser) throw new AppError('Email already in use', 400)

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email: data.email }
        })

        return this.mapUserResponse(updatedUser)
    }

    private generateToken(userId: string): string {
        return jwt.sign(
            { userId },
            process.env.JWT_SECRET || 'default-secret-key',
            { expiresIn: '7d' }
        )
    }

    private mapUserResponse(user: any) {
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
}

export const authService = new AuthService()
