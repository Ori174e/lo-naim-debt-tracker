import { motion } from 'framer-motion'
// import { useAuthStore } from '../store/authStore'
import Header from '../components/layout/Header'
import NotificationList from '../components/notifications/NotificationList'

export default function NotificationsPage() {
    // const { user } = useAuthStore()

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-primary-500/30">
            <Header />

            <main className="max-w-3xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-display font-bold text-white mb-2">
                        Notifications
                    </h1>
                    <p className="text-slate-400">View all your activity and requests.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <NotificationList mode="page" />
                </motion.div>
            </main>
        </div>
    )
}
