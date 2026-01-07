import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { notificationController } from '../controllers/notification.controller'

const router = Router()

router.use(authMiddleware)

// GET /api/notifications - Get user notifications
router.get('/', notificationController.getNotifications.bind(notificationController))

// GET /api/notifications/unread-count - Get unread count
router.get('/unread-count', notificationController.getUnreadCount.bind(notificationController))

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', notificationController.markAsRead.bind(notificationController))

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', notificationController.markAllAsRead.bind(notificationController))

export default router
