export interface Notification {
    id: string
    type: NotificationType
    debtId?: string
    senderId?: string
    recipientId: string
    title: string
    message: string
    sentAt: string
    openedAt?: string
    status: NotificationStatus
}

export enum NotificationType {
    DEBT_CREATED = 'DEBT_CREATED',
    PAYMENT_REMINDER = 'PAYMENT_REMINDER',
    PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
    DEBT_SETTLED = 'DEBT_SETTLED',
    FRIEND_REQUEST = 'FRIEND_REQUEST',
}

export enum NotificationStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED',
}
