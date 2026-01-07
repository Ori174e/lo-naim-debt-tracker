import { useState, useEffect } from 'react'
import { useDebtStore } from '../../store/debtStore'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { CreateDebtData } from '../../types/debt.types'
import { friendService } from '../../services/friend.service'
import { User } from '../../types/user.types'
import { ChevronDown, Check } from 'lucide-react'

interface CreateDebtFormProps {
    onSuccess: () => void
}

export default function CreateDebtForm({ onSuccess }: CreateDebtFormProps) {
    const { createDebt, isLoading, error } = useDebtStore()
    const [friends, setFriends] = useState<User[]>([])

    // Custom dropdown state
    const [isOpen, setIsOpen] = useState(false)
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null)
    const [manualEmail, setManualEmail] = useState('')
    const [useManualEmail, setUseManualEmail] = useState(false)

    const [formData, setFormData] = useState<Omit<CreateDebtData, 'borrowerEmail'>>({
        originalAmount: 0,
        currency: 'USD',
        description: '',
        dueDate: '',
    })

    useEffect(() => {
        loadFriends()
    }, [])

    const loadFriends = async () => {
        try {
            const data = await friendService.getFriends()
            setFriends(data)
        } catch (err) {
            console.error('Failed to load friends', err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Determine borrower email
        const borrowerEmail = useManualEmail ? manualEmail : selectedFriend?.email

        if (!borrowerEmail) {
            // Validation handled by HTML required or manual check needed here?
            // Since we have custom UI, we should prevent submit
            return
        }

        try {
            await createDebt({
                borrowerEmail,
                ...formData,
                originalAmount: Number(formData.originalAmount),
                dueDate: formData.dueDate || undefined,
            })
            onSuccess()
            // Reset form
            setFormData({
                originalAmount: 0,
                currency: 'USD',
                description: '',
                dueDate: '',
            })
            setSelectedFriend(null)
            setManualEmail('')
        } catch (error) {
            // Error is handled by store
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-3 text-danger-300 text-sm">
                    {error}
                </div>
            )}

            {/* FRIEND SELECTOR (Custom UI) */}
            <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Who owes you? <span className="text-danger-400">*</span>
                </label>

                {!useManualEmail ? (
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full input text-left flex items-center justify-between"
                        >
                            {selectedFriend ? (
                                <span className="text-white">{selectedFriend.name} ({selectedFriend.email})</span>
                            ) : (
                                <span className="text-slate-400">Select a friend...</span>
                            )}
                            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl max-h-60 overflow-auto shadow-xl">
                                {friends.length === 0 ? (
                                    <div className="p-4 text-center text-slate-400 text-sm">
                                        No friends found. <br />
                                        <button type="button" onClick={() => { setUseManualEmail(true); setIsOpen(false); }} className="text-primary-400 hover:underline mt-1">
                                            Enter email manually
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {friends.map(friend => (
                                            <button
                                                key={friend.id}
                                                type="button"
                                                className="w-full p-3 text-left hover:bg-slate-700transition-colors flex items-center justify-between group"
                                                onClick={() => {
                                                    setSelectedFriend(friend)
                                                    setIsOpen(false)
                                                }}
                                            >
                                                <div>
                                                    <div className="text-slate-200 font-medium">{friend.name}</div>
                                                    <div className="text-xs text-slate-500">{friend.email}</div>
                                                </div>
                                                {selectedFriend?.id === friend.id && <Check className="w-4 h-4 text-primary-400" />}
                                            </button>
                                        ))}
                                        <div className="border-t border-slate-700 p-2">
                                            <button
                                                type="button"
                                                onClick={() => { setUseManualEmail(true); setIsOpen(false); setSelectedFriend(null); }}
                                                className="w-full p-2 text-sm text-center text-primary-400 hover:bg-slate-700 rounded-lg transition-colors"
                                            >
                                                + Enter someone else's email
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                name="borrowerEmail"
                                type="email"
                                placeholder="friend@example.com"
                                value={manualEmail}
                                onChange={(e) => setManualEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <Button type="button" variant="secondary" onClick={() => setUseManualEmail(false)} className="mt-0">
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Amount"
                    type="number"
                    name="originalAmount"
                    value={formData.originalAmount || ''}
                    onChange={handleChange}
                    placeholder="100.00"
                    step="0.01"
                    min="0.01"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        Currency
                    </label>
                    <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="input"
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description <span className="text-danger-400">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What was this for? (e.g., 'Lunch at restaurant', 'Rent share')"
                    className="input min-h-[100px] resize-none"
                    required
                />
            </div>

            <Input
                label="Due Date (Optional)"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                helperText="When should they pay you back?"
            />

            <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1" disabled={!selectedFriend && !manualEmail}>
                    Create Debt
                </Button>
            </div>
        </form>
    )
}
