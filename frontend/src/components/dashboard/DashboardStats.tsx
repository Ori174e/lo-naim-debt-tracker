import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { Debt } from '../../types/debt.types'

interface DashboardStatsProps {
    debtsAsLender: Debt[]
    debtsAsBorrower: Debt[]
}

export default function DashboardStats({
    debtsAsLender,
    debtsAsBorrower,
}: DashboardStatsProps) {
    // Calculate totals
    const totalOwedToYou = debtsAsLender
        .reduce((sum, debt) => sum + (debt.status !== 'SETTLED' ? debt.remainingAmount : 0), 0)

    const totalYouOwe = debtsAsBorrower
        .reduce((sum, debt) => sum + (debt.status !== 'SETTLED' ? debt.remainingAmount : 0), 0)

    const netBalance = totalOwedToYou - totalYouOwe

    const cards = [
        {
            label: 'You are owed',
            value: totalOwedToYou,
            icon: ArrowDownLeft,
            color: 'text-success-400',
            bgColor: 'bg-success-400/10',
            description: 'Total pending from friends'
        },
        {
            label: 'You owe',
            value: totalYouOwe,
            icon: ArrowUpRight,
            color: 'text-danger-400',
            bgColor: 'bg-danger-400/10',
            description: 'Total to pay back'
        },
        {
            label: 'Net Balance',
            value: Math.abs(netBalance),
            icon: Wallet,
            color: netBalance >= 0 ? 'text-primary-400' : 'text-orange-400',
            bgColor: netBalance >= 0 ? 'bg-primary-400/10' : 'bg-orange-400/10',
            description: netBalance >= 0 ? 'You are overall positive' : 'You are overall negative',
            prefix: netBalance >= 0 ? '+' : '-'
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group"
                >
                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${card.color}`}>
                        <card.icon className="w-24 h-24 -mr-8 -mt-8" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${card.bgColor}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-400 text-sm font-medium mb-1">{card.label}</p>
                            <h3 className="text-3xl font-display font-bold text-white mb-2">
                                <span className="text-lg text-slate-500 font-normal mr-1">{card.prefix}</span>
                                ${card.value.toLocaleString()}
                            </h3>
                            <p className="text-xs text-slate-500">{card.description}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
