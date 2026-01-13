import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'
import { LogOut, User, Home, UserPlus } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'
import Modal from '../ui/Modal'
import SearchFriend from '../friends/SearchFriend'

export default function Header() {
    const { logout, user } = useAuthStore()
    const navigate = useNavigate()
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-primary-500/20">
                        L
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard')}
                        className="text-slate-400 hover:text-primary-400"
                        title="Home"
                    >
                        <Home className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddFriendOpen(true)}
                        className="text-slate-400 hover:text-primary-400"
                        title="Add Friend"
                    >
                        <UserPlus className="w-5 h-5" />
                    </Button>

                    <NotificationBell />

                    <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                        <div
                            className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 hover:ring-offset-slate-900 transition-all text-slate-400 hover:text-white"
                            onClick={() => navigate('/profile')}
                            title="Profile"
                        >
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-danger-400"
                            title="Sign Out"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isAddFriendOpen}
                onClose={() => setIsAddFriendOpen(false)}
                title="Add a New Friend"
            >
                <div className="space-y-6">
                    <p className="text-slate-400 text-sm">
                        Search for a user by email, name, or phone number to send a friend request.
                    </p>
                    <SearchFriend onFriendAdded={() => {
                        setIsAddFriendOpen(false)
                    }} />
                </div>
            </Modal>
        </header>
    )
}
