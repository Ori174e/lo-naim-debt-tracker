import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '../../store/notificationStore'
import { formatRelativeTime } from '../../utils/formatDate'
import { NotificationType } from '../../types/notification.types'
import { Bell, DollarSign, UserPlus, CheckCircle, CreditCard, Check, X, Mail } from 'lucide-react'
import { friendService } from '../../services/friend.service'
import Button from '../ui/Button'
import { useFriendStore } from '../../store/friendStore'

interface NotificationListProps {
    mode?: 'dropdown' | 'page'
    onClose?: () => void
}

export default function NotificationList({ mode = 'dropdown', onClose }: NotificationListProps) {
    const { notifications, isLoading, markAsRead, markAllAsRead, fetchNotifications } = useNotificationStore()
    const { fetchFriends } = useFriendStore()
    const listRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const isDropdown = mode === 'dropdown'
    const bgColor = isDropdown ? 'bg-white' : 'bg-slate-800'
    const textColor = isDropdown ? 'text-slate-800' : 'text-slate-200'
    const subTextColor = isDropdown ? 'text-slate-500' : 'text-slate-400'
    const borderColor = isDropdown ? 'border-slate-100' : 'border-slate-700/50'
    const hoverColor = isDropdown ? 'hover:bg-slate-50' : 'hover:bg-slate-700/30'
    const unreadBg = isDropdown ? 'bg-blue-50/50' : 'bg-slate-700/20'

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleAcceptFriend = async (senderId: string, notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await friendService.respondToRequestBySender(senderId, 'ACCEPTED')
            await markAsRead(notificationId)
            fetchNotifications()
            fetchFriends()
        } catch (error) {
            console.error('Failed to accept friend request', error)
        }
    }

    const handleDeclineFriend = async (senderId: string, notificationId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await friendService.respondToRequestBySender(senderId, 'REJECTED')
            await markAsRead(notificationId)
            fetchNotifications()
            fetchFriends()
        } catch (error) {
            console.error('Failed to decline friend request', error)
        }
    }

    const handleViewAll = () => {
        if (onClose) onClose()
        navigate('/notifications')
    }

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.DEBT_CREATED:
                return <DollarSign className="w-5 h-5 text-warning-500" />
            case NotificationType.PAYMENT_RECEIVED:
                return <CreditCard className="w-5 h-5 text-success-500" />
            case NotificationType.FRIEND_REQUEST:
                return <UserPlus className="w-5 h-5 text-primary-500" />
            case NotificationType.DEBT_SETTLED:
                return <CheckCircle className="w-5 h-5 text-success-500" />
            default:
                return <Bell className="w-5 h-5 text-slate-400" />
        }
    }

    if (isLoading && notifications.length === 0) {
        return (
            <div className={`p-8 text-center ${subTextColor} ${bgColor} rounded-xl border ${borderColor}`}>
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-8 bg-slate-200 rounded-full mb-3"></div>
                    <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (notifications.length === 0) {
        return (
            <div className={`p-8 text-center ${subTextColor} ${bgColor} border ${borderColor} rounded-xl shadow-xl`} ref={listRef}>
                <div className="flex flex-col items-center justify-center py-4">
                    <Bell className="w-8 h-8 mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`w-full ${isDropdown ? 'max-w-sm shadow-xl max-h-[500px]' : ''} ${bgColor} border ${borderColor} rounded-xl overflow-hidden flex flex-col`}
            ref={listRef}
        >
            <div className={`p-4 border-b ${borderColor} flex justify-between items-center ${bgColor} sticky top-0 z-10`}>
                <h3 className={`font-bold ${textColor}`}>Notifications</h3>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="overflow-y-auto flex-1">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`p-4 border-b ${borderColor} ${hoverColor} transition-colors cursor-pointer relative group ${!notification.read ? unreadBg : ''
                            }`}
                        onClick={() => markAsRead(notification.id)}
                    >
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.read ? `font-semibold ${textColor}` : subTextColor}`}>
                                    {notification.title}
                                </p>
                                <p className={`text-xs ${subTextColor} mt-0.5 line-clamp-2`}>
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
                                            className="px-3 py-1 h-7 text-xs" // secondary button should inherit compatible styles
                                            onClick={(e) => handleDeclineFriend(notification.senderId!, notification.id, e)}
                                        >
                                            <X className="w-3 h-3 mr-1" />
                                            Decline
                                        </Button>
                                    </div>
                                )}
                                <p className="text-[10px] text-slate-400 mt-2">
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

            {isDropdown && (
                <div className={`p-3 border-t ${borderColor} ${bgColor} sticky bottom-0`}>
                    <button
                        onClick={handleViewAll}
                        className="w-full flex items-center justify-center gap-2 text-sm text-primary-500 hover:text-primary-600 font-medium py-2 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                        View All Notifications
                    </button>
                </div>
            )}
        </div>
    )
}
