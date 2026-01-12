import { Response, NextFunction } from 'express'
import { notificationService } from '../services/notification.service'
import { AuthRequest } from '../middleware/auth.middleware'

export class NotificationController {
    async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const notifications = await notificationService.getUserNotifications(req.userId!)
            res.json(notifications)
        } catch (error) {
            next(error)
        }
    }

    async getUnreadCount(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const count = await notificationService.getUnreadCount(req.userId!)
            res.json({ count })
        } catch (error) {
            next(error)
        }
    }

    async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string }
            await notificationService.markAsRead(id, req.userId!)
            res.json({ success: true })
        } catch (error) {
            next(error)
        }
    }

    async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await notificationService.markAllAsRead(req.userId!)
            res.json({ success: true })
        } catch (error) {
            next(error)
        }
    }
}

export const notificationController = new NotificationController()
