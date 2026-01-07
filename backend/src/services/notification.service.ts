import { PrismaClient, NotificationType } from '@prisma/client'

const prisma = new PrismaClient()

export class NotificationService {
    async createNotification(
        recipientId: string,
        type: NotificationType,
        title: string,
        message: string,
        senderId?: string,
        debtId?: string
    ) {
        return prisma.notification.create({
            data: {
                recipientId,
                type,
                title,
                message,
                senderId,
                debtId,
            },
        })
    }

    async getUserNotifications(userId: string) {
        return prisma.notification.findMany({
            where: { recipientId: userId },
            orderBy: { sentAt: 'desc' },
            take: 50,
        })
    }

    async getUnreadCount(userId: string) {
        return prisma.notification.count({
            where: {
                recipientId: userId,
                openedAt: null,
            },
        })
    }

    async markAsRead(notificationId: string, userId: string) {
        // Verify ownership
        const notification = await prisma.notification.findFirst({
            where: { id: notificationId, recipientId: userId },
        })

        if (!notification) return null

        return prisma.notification.update({
            where: { id: notificationId },
            data: { openedAt: new Date() },
        })
    }

    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: { recipientId: userId, openedAt: null },
            data: { openedAt: new Date() },
        })
    }
}

export const notificationService = new NotificationService()
