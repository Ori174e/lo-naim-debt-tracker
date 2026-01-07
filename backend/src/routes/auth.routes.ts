import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { authController } from '../controllers/auth.controller'

const router = Router()

// Public routes
router.post('/signup', authController.signup.bind(authController))
router.post('/login', authController.login.bind(authController))

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController))
router.patch('/profile', authMiddleware, authController.updateProfile.bind(authController))
router.patch('/preferences', authMiddleware, authController.updatePreferences.bind(authController))

export default router
