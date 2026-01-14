import api from './api'
import { NotificationType } from '../types/notification.types'

export interface UserNotification {
    id: string
    type: NotificationType
    title: string
    message: string
    read: boolean
    data?: any
    createdAt: string
    openedAt?: string
    senderId?: string
}

export const notificationService = {
    async getNotifications(): Promise<UserNotification[]> {
        const response = await api.get('/notifications')
        return response.data
    },

    async getUnreadCount(): Promise<{ count: number }> {
        const response = await api.get('/notifications/unread-count')
        return response.data
    },

    async markAsRead(id: string): Promise<void> {
        await api.patch(`/notifications/${id}/read`)
    },

    async markAllAsRead(): Promise<void> {
        await api.patch('/notifications/read-all')
    },
}
