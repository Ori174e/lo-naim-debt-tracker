import { useState } from 'react'
import { paymentService } from '../../services/payment.service'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { formatCurrency } from '../../utils/formatCurrency'

interface RecordPaymentFormProps {
    debtId: string
    remainingAmount: number
    currency: string
    onSuccess: () => void
    onCancel: () => void
}

export default function RecordPaymentForm({
    debtId,
    remainingAmount,
    currency,
    onSuccess,
    onCancel,
}: RecordPaymentFormProps) {
    const [amount, setAmount] = useState<number>(0)
    const [note, setNote] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (amount <= 0) {
            setError('Payment amount must be greater than 0')
            return
        }

        if (amount > remainingAmount) {
            setError(`Payment cannot exceed remaining amount (${formatCurrency(remainingAmount, currency)})`)
            return
        }

        try {
            setIsLoading(true)
            await paymentService.recordPayment({
                debtId,
                amount,
                note: note || undefined,
            })
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to record payment')
        } finally {
            setIsLoading(false)
        }
    }

    const handlePayFull = () => {
        setAmount(remainingAmount)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-3 text-danger-300 text-sm">
                    {error}
                </div>
            )}

            <div className="glass rounded-xl p-4 mb-4">
                <p className="text-sm text-slate-400 mb-1">Remaining Amount</p>
                <p className="text-2xl font-bold text-gradient">
                    {formatCurrency(remainingAmount, currency)}
                </p>
            </div>

            <div className="flex gap-2">
                <Input
                    label="Payment Amount"
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    max={remainingAmount}
                    required
                />
                <div className="flex items-end">
                    <Button
                        type="button"
                        variant="secondary"
                        size="md"
                        onClick={handlePayFull}
                        className="whitespace-nowrap"
                    >
                        Pay Full
                    </Button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Note (Optional)
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this payment..."
                    className="input min-h-[80px] resize-none"
                    maxLength={500}
                />
                <p className="text-xs text-slate-500 mt-1">{note.length}/500</p>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
                    Record Payment
                </Button>
            </div>
        </form>
    )
}
