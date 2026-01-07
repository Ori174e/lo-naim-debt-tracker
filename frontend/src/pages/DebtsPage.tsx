import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDebtStore } from '../store/debtStore'
import { Plus, Filter, Search, Receipt } from 'lucide-react'
import Header from '../components/layout/Header'
import DebtList from '../components/debts/DebtList'
import CreateDebtForm from '../components/debts/CreateDebtForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import EmptyState from '../components/ui/EmptyState'

export default function DebtsPage() {
    const { fetchDebts, isLoading, debtsAsLender, debtsAsBorrower } = useDebtStore()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchDebts()
    }, [fetchDebts])

    const hasDebts = debtsAsLender.length > 0 || debtsAsBorrower.length > 0

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-primary-500/30">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Debts</h1>
                        <p className="text-slate-400">Manage your lendings and borrowings.</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)} className="shadow-lg shadow-primary-500/20">
                        <Plus className="w-5 h-5 mr-2" />
                        Create Debt
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                    </div>
                ) : !hasDebts ? (
                    <EmptyState
                        icon={Receipt}
                        title="No debts found"
                        description="You don't have any active debts. Create one to get started!"
                        actionLabel="Create First Debt"
                        onAction={() => setIsCreateOpen(true)}
                    />
                ) : (
                    <>
                        {/* Search and Filter Bar could go here */}
                        <div className="mb-6 flex gap-4">
                            <div className="flex-1 max-w-md">
                                <Input
                                    placeholder="Search debts..."
                                    icon={<Search className="w-4 h-4" />}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {/* <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Filter</Button> */}
                        </div>

                        <DebtList asLender={debtsAsLender} asBorrower={debtsAsBorrower} />
                    </>
                )}
            </main>

            <Modal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Create New Debt"
            >
                <CreateDebtForm onSuccess={() => setIsCreateOpen(false)} />
            </Modal>
        </div>
    )
}
