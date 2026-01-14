import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'
import NotificationList from './NotificationList'

export default function NotificationBell() {
    const { unreadCount, fetchUnreadCount, fetchNotifications } = useNotificationStore()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Initial fetch
        fetchUnreadCount()

        // Poll for unread count every 30 seconds
        const interval = setInterval(() => {
            fetchUnreadCount()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleOpen = () => {
        if (!isOpen) {
            fetchNotifications() // Refresh list when opening
        }
        setIsOpen(!isOpen)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleOpen}
                className="p-2 rounded-full hover:bg-slate-800 transition-colors relative text-slate-400 hover:text-white"
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-danger-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 origin-top-right">
                    <NotificationList onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    )
}
