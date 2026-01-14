import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useDebtStore } from '../store/debtStore'
import Header from '../components/layout/Header'
import DashboardStats from '../components/dashboard/DashboardStats'
import DebtChart from '../components/dashboard/DebtChart'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

export default function DashboardPage() {
    const { user } = useAuthStore()
    const { asLender: debtsAsLender, asBorrower: debtsAsBorrower, fetchDebts, isLoading } = useDebtStore()
    const navigate = useNavigate()

    useEffect(() => {
        fetchDebts()
    }, [fetchDebts])

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

                                {/* Quick Actions */}
                                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                    <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <Button onClick={() => navigate('/debts')}>
                                            View All Debts
                                        </Button>
                                        <Button variant="ghost" onClick={() => navigate('/friends')}>
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
