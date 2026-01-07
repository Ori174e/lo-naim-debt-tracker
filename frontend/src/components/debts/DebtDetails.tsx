import { useState } from 'react'
import { Debt } from '../../types/debt.types'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import PaymentHistory from '../payments/PaymentHistory'
import RecordPaymentForm from '../payments/RecordPaymentForm'
import { useDebtStore } from '../../store/debtStore'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate, formatRelativeTime } from '../../utils/formatDate'
import { Calendar, DollarSign, FileText, User, Check } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

interface DebtDetailsProps {
    debt: Debt
    onUpdate?: () => void
}

export default function DebtDetails({ debt, onUpdate }: DebtDetailsProps) {
    const { user } = useAuthStore()
    const { settleDebt } = useDebtStore()
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
    const [isSettleModalOpen, setIsSettleModalOpen] = useState(false)
    const [isSettling, setIsSettling] = useState(false)

    const isLender = debt.lenderId === user?.id
    const isBorrower = debt.borrowerId === user?.id
    const otherPerson = isLender ? debt.borrower : debt.lender
    const canRecordPayment = debt.status === 'ACTIVE' && debt.remainingAmount > 0
    const paymentProgress = ((Number(debt.originalAmount) - Number(debt.remainingAmount)) / Number(debt.originalAmount)) * 100

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false)
        if (onUpdate) onUpdate()
    }

    const handleSettle = async () => {
        try {
            setIsSettling(true)
            await settleDebt(debt.id)
            setIsSettleModalOpen(false)
            if (onUpdate) onUpdate()
        } catch (error) {
            // Error is handled by store
        } finally {
            setIsSettling(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                        <span className="text-xl font-bold">
                            {otherPerson.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{otherPerson.name}</h2>
                        <p className="text-slate-400">{otherPerson.email}</p>
                    </div>
                </div>

                <div className="glass rounded-xl p-4 mb-4">
                    <p className="text-sm text-slate-400 mb-1">
                        {isLender ? 'They owe you' : 'You owe them'}
                    </p>
                    <p className={`text-4xl font-bold ${isLender ? 'text-success-400' : 'text-danger-400'}`}>
                        {formatCurrency(debt.remainingAmount, debt.currency)}
                    </p>
                    {debt.originalAmount !== debt.remainingAmount && (
                        <div className="mt-3">
                            <div className="flex justify-between text-sm text-slate-400 mb-2">
                                <span>Originally {formatCurrency(debt.originalAmount, debt.currency)}</span>
                                <span>{paymentProgress.toFixed(0)}% paid</span>
                            </div>
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-success-500 to-success-400 transition-all duration-500"
                                    style={{ width: `${paymentProgress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {canRecordPayment && (
                    <div className="flex gap-3">
                        <Button
                            variant="primary"
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="flex-1"
                        >
                            Record Payment
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => setIsSettleModalOpen(true)}
                            className="flex-1"
                        >
                            <Check className="w-5 h-5 mr-2" />
                            Settle Debt
                        </Button>
                    </div>
                )}

                {debt.status === 'SETTLED' && (
                    <div className="bg-success-500/10 border border-success-500/30 rounded-xl p-3 text-success-300 text-center">
                        ✓ Debt Settled on {formatDate(debt.settledAt!)}
                    </div>
                )}
            </Card>

            {/* Details */}
            <Card>
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-400">Description</p>
                            <p className="text-slate-200">{debt.description || 'No description'}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-400">Created</p>
                            <p className="text-slate-200">{formatDate(debt.createdAt)}</p>
                            <p className="text-xs text-slate-500">{formatRelativeTime(debt.createdAt)}</p>
                        </div>
                    </div>

                    {debt.dueDate && (
                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-warning-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-slate-400">Due Date</p>
                                <p className="text-slate-200">{formatDate(debt.dueDate)}</p>
                                <p className="text-xs text-slate-500">{formatRelativeTime(debt.dueDate)}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-3">
                        <DollarSign className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-400">Currency</p>
                            <p className="text-slate-200">{debt.currency}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-slate-400 mt-0.5" />
                        <div>
                            <p className="text-sm text-slate-400">Status</p>
                            <p className="text-slate-200">{debt.status}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Payment History */}
            <PaymentHistory debtId={debt.id} currency={debt.currency} />

            {/* Record Payment Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                title="Record Payment"
                size="md"
            >
                <RecordPaymentForm
                    debtId={debt.id}
                    remainingAmount={Number(debt.remainingAmount)}
                    currency={debt.currency}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setIsPaymentModalOpen(false)}
                />
            </Modal>

            {/* Settle Debt Confirmation Modal */}
            <Modal
                isOpen={isSettleModalOpen}
                onClose={() => setIsSettleModalOpen(false)}
                title="Settle Debt"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-slate-300">
                        Are you sure you want to settle this debt? This will create a payment for the remaining amount:
                    </p>
                    <div className="glass rounded-xl p-4 text-center">
                        <p className="text-sm text-slate-400 mb-1">Amount to settle</p>
                        <p className="text-3xl font-bold text-success-400">
                            {formatCurrency(debt.remainingAmount, debt.currency)}
                        </p>
                    </div>
                    <p className="text-sm text-slate-400">
                        This action cannot be undone. The debt will be marked as SETTLED.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={() => setIsSettleModalOpen(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleSettle}
                            isLoading={isSettling}
                            className="flex-1"
                        >
                            Confirm Settlement
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
