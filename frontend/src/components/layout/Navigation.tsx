import { useLocation, Link } from 'react-router-dom'
import { Home, Receipt, Users, User, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/debts', icon: Receipt, label: 'Debts' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Navigation() {
    const location = useLocation()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-2">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary-500/20 rounded-xl"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon
                                    className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-primary-400' : 'text-slate-400'
                                        }`}
                                />
                                <span
                                    className={`text-xs relative z-10 transition-colors ${isActive ? 'text-primary-400 font-medium' : 'text-slate-500'
                                        }`}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
