import { Debt } from '../../types/debt.types'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelativeTime } from '../../utils/formatDate'
import { Calendar, User } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface DebtCardProps {
    debt: Debt
    onClick?: () => void
}

export default function DebtCard({ debt, onClick }: DebtCardProps) {
    const { user } = useAuthStore()
    const isLender = debt.lenderId === user?.id
    const otherPerson = isLender ? debt.borrower : debt.lender

    const statusColors = {
        ACTIVE: 'bg-primary-500/20 text-primary-400 border-primary-500/30',
        SETTLED: 'bg-success-500/20 text-success-400 border-success-500/30',
        DISPUTED: 'bg-warning-500/20 text-warning-400 border-warning-500/30',
        CANCELLED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    }

    return (
        <Card hover onClick={onClick}>
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                            <span className="text-sm font-bold">
                                {otherPerson.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="font-medium">{otherPerson.name}</p>
                            <p className="text-sm text-slate-400">{otherPerson.email}</p>
                        </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[debt.status]}`}>
                        {debt.status}
                    </span>
                </div>

                {/* Amount */}
                <div>
                    <p className={`text-2xl font-bold ${isLender ? 'text-success-400' : 'text-danger-400'}`}>
                        {isLender ? '+' : '-'}
                        {formatCurrency(debt.remainingAmount, debt.currency)}
                    </p>
                    {debt.originalAmount !== debt.remainingAmount && (
                        <p className="text-sm text-slate-400">
                            of {formatCurrency(debt.originalAmount, debt.currency)}
                        </p>
                    )}
                </div>

                {/* Description */}
                {debt.description && (
                    <p className="text-slate-300 text-sm line-clamp-2">{debt.description}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{isLender ? 'Lent to' : 'Borrowed from'} {otherPerson.name.split(' ')[0]}</span>
                    </div>

                    {debt.dueDate && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Due {formatRelativeTime(debt.dueDate)}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )
}
