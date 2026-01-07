import { useState } from 'react'
import { friendService } from '../../services/friend.service'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { Send } from 'lucide-react'

interface AddFriendFormProps {
    onSuccess: () => void
}

export default function AddFriendForm({ onSuccess }: AddFriendFormProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccessMessage(null)
        setIsLoading(true)

        try {
            await friendService.sendRequest(email)
            setSuccessMessage(`Friend request sent to ${email}`)
            setEmail('')
            onSuccess()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send request')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="glass p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-200">Add Friend</h3>
            <form onSubmit={handleSubmit} className="flex gap-2 items-start">
                <div className="flex-1">
                    <Input
                        name="email"
                        type="email"
                        placeholder="Enter friend's email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        error={error || undefined}
                    />
                </div>
                <Button type="submit" variant="primary" isLoading={isLoading} className="mt-[29px]"> {/* Align with input height */}
                    <Send className="w-4 h-4 mr-2" />
                    Send
                </Button>
            </form>
            {successMessage && (
                <p className="text-success-400 text-sm">{successMessage}</p>
            )}
        </div>
    )
}
