import { useState } from 'react'
import { Debt } from '../../types/debt.types'
import DebtCard from './DebtCard'
import { motion } from 'framer-motion'

interface DebtListProps {
    asLender: Debt[]
    asBorrower: Debt[]
}

type Tab = 'owed-to-me' | 'i-owe'

export default function DebtList({ asLender, asBorrower }: DebtListProps) {
    const [activeTab, setActiveTab] = useState<Tab>('owed-to-me')

    const debts = activeTab === 'owed-to-me' ? asLender : asBorrower

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 glass rounded-xl p-1">
                <button
                    onClick={() => setActiveTab('owed-to-me')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all relative ${activeTab === 'owed-to-me' ? 'text-success-400' : 'text-slate-400 hover:text-slate-300'
                        }`}
                >
                    {activeTab === 'owed-to-me' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-success-500/20 rounded-lg"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">
                        Owed to Me ({asLender.length})
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('i-owe')}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all relative ${activeTab === 'i-owe' ? 'text-danger-400' : 'text-slate-400 hover:text-slate-300'
                        }`}
                >
                    {activeTab === 'i-owe' && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-danger-500/20 rounded-lg"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">
                        I Owe ({asBorrower.length})
                    </span>
                </button>
            </div>

            {/* Debt List */}
            <div className="space-y-4">
                {debts.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <p className="text-slate-400">
                            {activeTab === 'owed-to-me'
                                ? 'No one owes you money yet'
                                : "You don't owe anyone money"}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                            {activeTab === 'owed-to-me'
                                ? 'Create a debt to track money owed to you'
                                : 'Debts created by others will appear here'}
                        </p>
                    </div>
                ) : (
                    debts.map((debt) => <DebtCard key={debt.id} debt={debt} />)
                )}
            </div>
        </div>
    )
}
