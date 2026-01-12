import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { friendService } from '../../services/friend.service'

interface SearchFriendProps {
    onFriendAdded: () => void
}

export default function SearchFriend({ onFriendAdded }: SearchFriendProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setIsLoading(true)
        setMessage(null)

        try {
            await friendService.sendRequest(email)
            setMessage({ type: 'success', text: 'Friend request sent successfully!' })
            setEmail('')
            onFriendAdded()
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to send request. User might not exist.'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Friend's Email"
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                required
            />

            {message && (
                <div className={`text-sm p-3 rounded-lg ${message.type === 'success' ? 'bg-success-500/10 text-success-400' : 'bg-danger-500/10 text-danger-400'
                    }`}>
                    {message.text}
                </div>
            )}

            <Button type="submit" isLoading={isLoading} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Send Request
            </Button>
        </form>
    )
}
