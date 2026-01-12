import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Button from '../ui/Button'
import { LogOut, User } from 'lucide-react'
import NotificationBell from '../notifications/NotificationBell'

export default function Header() {
    const { logout, user } = useAuthStore()
    const navigate = useNavigate()

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
                    <span className="font-display font-bold text-xl tracking-tight">
                        Lo <span className="text-primary-400">Naim</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationBell />

                    <div className="hidden md:flex items-center gap-3 pl-4 border-l border-slate-800">
                        <div className="text-right">
                            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                            {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full" />
                            ) : (
                                <User className="w-5 h-5 text-slate-400" />
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-slate-400 hover:text-danger-400"
                        >
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
