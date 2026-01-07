import { create } from 'zustand'
import { notificationService, UserNotification } from '../services/notification.service'

interface NotificationState {
    notifications: UserNotification[]
    unreadCount: number
    isLoading: boolean

    fetchNotifications: () => Promise<void>
    fetchUnreadCount: () => Promise<void>
    markAsRead: (id: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    addNotification: (notification: UserNotification) => void // For real-time updates later
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true })
        try {
            const data = await notificationService.getNotifications()
            set({
                notifications: data,
                // Calculate unread count from fetched data to accept source of truth
                unreadCount: data.filter(n => !n.read).length, // Or use separate endpoint if paginated
                isLoading: false
            })
        } catch (error) {
            console.error('Failed to fetch notifications', error)
            set({ isLoading: false })
        }
    },

    fetchUnreadCount: async () => {
        try {
            const { count } = await notificationService.getUnreadCount()
            set({ unreadCount: count })
        } catch (error) {
            console.error('Failed to fetch unread count', error)
        }
    },

    markAsRead: async (id: string) => {
        try {
            // Optimistic update
            set(state => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                ),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }))

            await notificationService.markAsRead(id)
        } catch (error) {
            // Revert if failed? For now just log
            console.error('Failed to mark notification as read', error)
        }
    },

    markAllAsRead: async () => {
        try {
            // Optimistic update
            set(state => ({
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0
            }))

            await notificationService.markAllAsRead()
        } catch (error) {
            console.error('Failed to mark all as read', error)
        }
    },

    addNotification: (notification: UserNotification) => {
        set(state => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1
        }))
    }
}))
