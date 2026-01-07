import { useAuthStore } from '../store/authStore'
import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'
import { ArrowDown, ArrowUp, Users, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
    const { user } = useAuthStore()

    // Mock data - will be replaced with real data from API
    const stats = {
        owedToMe: 1250.0,
        iOwe: 480.0,
        activeDebts: 7,
        friends: 12,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold font-display mb-2">
                        Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
                    </h1>
                    <p className="text-slate-400">Here's your debt overview</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card glass-hover group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="glass p-3 rounded-xl group-hover:bg-success-500/20 transition-colors">
                                <ArrowDown className="w-6 h-6 text-success-500" />
                            </div>
                            <span className="text-xs font-medium text-success-400 bg-success-500/10 px-2 py-1 rounded-full">
                                +$120 this week
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Owed to Me</p>
                            <p className="text-3xl font-bold text-gradient">
                                ${stats.owedToMe.toFixed(2)}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card glass-hover group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="glass p-3 rounded-xl group-hover:bg-danger-500/20 transition-colors">
                                <ArrowUp className="w-6 h-6 text-danger-500" />
                            </div>
                            <span className="text-xs font-medium text-danger-400 bg-danger-500/10 px-2 py-1 rounded-full">
                                Pay soon
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">I Owe</p>
                            <p className="text-3xl font-bold text-white">${stats.iOwe.toFixed(2)}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card glass-hover group cursor-pointer"
                        const { user} = useAuthStore()
                    const {debtsAsLender, debtsAsBorrower, fetchDebts, isLoading} = useDebtStore()
                    const navigate = useNavigate()

  useEffect(() => {
                        fetchDebts()
                    }, [])

  const hasDebts = debtsAsLender.length > 0 || debtsAsBorrower.length > 0

                    return (
                    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-primary-500/30">
                        <Header />

                        <main className="max-w-7xl mx-auto px-4 py-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <h1 className="text-3xl font-display font-bold text-white mb-2">
                                    Welcome back, {user?.name?.split(' ')[0]} 👋
                                </h1>
                                <p className="text-slate-400">Here's your financial overview.</p>
                            </motion.div>

                            {isLoading ? (
                                <div className="flex items-center justify-center p-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                                </div>
                            ) : (
                                <>
                                    <DashboardStats
                                        debtsAsLender={debtsAsLender}
                                        debtsAsBorrower={debtsAsBorrower}
                                    />

                                    {hasDebts ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            <DebtChart
                                                debtsAsLender={debtsAsLender}
                                                debtsAsBorrower={debtsAsBorrower}
                                            />

                                            {/* Quick Actions / Recent Activity could go here */}
                                            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                                                <div className="flex gap-4">
                                                    <Button onClick={() => navigate('/debts')}>
                                                        View All Debts
                                                    </Button>
                                                    <Button variant="outline" onClick={() => navigate('/friends')}>
                                                        Manage Friends
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={Plus}
                                            title="No debts yet"
                                            description="Start tracking by adding your first debt or connecting with friends."
                                            actionLabel="Create Debt"
                                            onAction={() => navigate('/debts')}
                                        />
                                    )}
                                </>
                            )}
                        </main>
                    </div>
                    )
}
