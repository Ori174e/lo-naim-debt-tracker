import { useRef, useEffect } from 'react'
import { useNotificationStore } from '../../store/notificationStore'
import { formatRelativeTime } from '../../utils/formatDate'
import { NotificationType } from '../../types/notification.types'
import { Bell, DollarSign, UserPlus, CheckCircle, CreditCard, Check, X } from 'lucide-react'
import { friendService } from '../../services/friend.service'
import Button from '../ui/Button'
import { useFriendStore } from '../../store/friendStore'

export default function NotificationList() {
    const { notifications, isLoading, markAsRead, markAllAsRead, fetchNotifications } = useNotificationStore()
    const { fetchFriends } = useFriendStore()
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleAcceptFriend = async (senderId: string, notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await friendService.respondToRequest(senderId, 'ACCEPTED')
            await markAsRead(notificationId)
            fetchFriends() // Refresh friend list
        } catch (error) {
            console.error('Failed to accept friend request', error)
        }
    }

    const handleDeclineFriend = async (senderId: string, notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await friendService.respondToRequest(senderId, 'REJECTED')
            await markAsRead(notificationId)
        } catch (error) {
            console.error('Failed to decline friend request', error)
        }
    }

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.DEBT_CREATED:
                return <DollarSign className="w-5 h-5 text-warning-400" />
            case NotificationType.PAYMENT_RECEIVED:
                return <CreditCard className="w-5 h-5 text-success-400" />
            case NotificationType.FRIEND_REQUEST:
                return <UserPlus className="w-5 h-5 text-primary-400" />
            case NotificationType.DEBT_SETTLED:
                return <CheckCircle className="w-5 h-5 text-success-400" />
            default:
                return <Bell className="w-5 h-5 text-slate-400" />
        }
    }

    if (isLoading && notifications.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400">
                Loading...
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 bg-slate-800 border border-slate-700/50 rounded-xl" ref={listRef}>
                <div className="flex flex-col items-center justify-center py-4">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]" ref={listRef}>
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800 sticky top-0 z-10">
                <h3 className="font-bold text-white">Notifications</h3>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="overflow-y-auto flex-1">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer relative group ${!notification.read ? 'bg-slate-700/20' : ''
                            }`}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.read ? 'text-white font-medium' : 'text-slate-300'}`}>
                                    {notification.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                                    {notification.message}
                                </p>
                                {notification.type === NotificationType.FRIEND_REQUEST && !notification.read && notification.senderId && (
                                    <div className="flex gap-2 mt-3">
                                        <Button
                                            size="sm"
                                            className="px-3 py-1 h-7 text-xs"
                                            onClick={(e) => handleAcceptFriend(notification.senderId!, notification.id, e)}
                                        >
                                            <Check className="w-3 h-3 mr-1" />
                                            Accept
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="px-3 py-1 h-7 text-xs bg-slate-700 hover:bg-slate-600 border-none"
                                            onClick={(e) => handleDeclineFriend(notification.senderId!, notification.id, e)}
                                        >
                                            <X className="w-3 h-3 mr-1" />
                                            Decline
                                        </Button>
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-500 mt-2">
                                    {formatRelativeTime(notification.createdAt)}
                                </p>
                            </div>
                            {!notification.read && (
                                <div className="flex-shrink-0 self-center">
                                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
