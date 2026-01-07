import { useState } from 'react'
import { paymentService, Payment } from '../../services/payment.service'
import { formatDate, formatRelativeTime } from '../../utils/formatDate'
import { formatCurrency } from '../../utils/formatCurrency'
import Card from '../ui/Card'
import LoadingSpinner from '../ui/LoadingSpinner'
import { DollarSign, User, Calendar } from 'lucide-react'
import { useEffect } from 'react'

interface PaymentHistoryProps {
    debtId: string
    currency: string
}

export default function PaymentHistory({ debtId, currency }: PaymentHistoryProps) {
    const [payments, setPayments] = useState<Payment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadPayments()
    }, [debtId])

    const loadPayments = async () => {
        try {
            setIsLoading(true)
            const data = await paymentService.getPaymentHistory(debtId)
            setPayments(data)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load payment history')
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner size="md" text="Loading payment history..." />
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-4 text-danger-300">
                {error}
            </div>
        )
    }

    if (payments.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">No payments recorded yet</p>
                    <p className="text-sm text-slate-500 mt-1">
                        Payments will appear here once recorded
                    </p>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>

            {payments.map((payment, index) => (
                <Card key={payment.id} className="relative">
                    {/* Timeline connector */}
                    {index < payments.length - 1 && (
                        <div className="absolute left-6 top-16 bottom-0 w-px bg-slate-700" />
                    )}

                    <div className="flex gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center relative z-10">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="text-xl font-bold text-success-400">
                                        {formatCurrency(payment.amount, currency)}
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {formatDate(payment.paymentDate)}
                                    </p>
                                </div>
                                <span className="text-xs text-slate-500">
                                    {formatRelativeTime(payment.paymentDate)}
                                </span>
                            </div>

                            {payment.note && (
                                <p className="text-sm text-slate-300 mb-2">{payment.note}</p>
                            )}

                            {payment.recorder && (
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <User className="w-3 h-3" />
                                    <span>Recorded by {payment.recorder.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            ))}

            {/* Summary */}
            <Card className="bg-gradient-to-r from-success-500/10 to-success-600/10 border-success-500/30">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Total Paid</span>
                    <span className="text-lg font-bold text-success-400">
                        {formatCurrency(
                            payments.reduce((sum, p) => sum + p.amount, 0),
                            currency
                        )}
                    </span>
                </div>
            </Card>
        </div>
    )
}
