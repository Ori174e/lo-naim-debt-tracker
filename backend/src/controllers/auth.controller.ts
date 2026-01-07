import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/auth.service'
import { signupSchema, loginSchema, updateProfileSchema, updatePreferencesSchema } from '../validators/user.validator'
import { AuthRequest } from '../middleware/auth.middleware'

export class AuthController {
    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = signupSchema.parse(req.body)
            const result = await authService.signup(validatedData)
            res.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = loginSchema.parse(req.body)
            const result = await authService.login(validatedData)
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = await authService.getUserById(req.userId!)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = updateProfileSchema.parse(req.body)
            const user = await authService.updateProfile(req.userId!, validatedData)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    async updatePreferences(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = updatePreferencesSchema.parse(req.body)
            const user = await authService.updatePreferences(req.userId!, validatedData)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
}

export const authController = new AuthController()
