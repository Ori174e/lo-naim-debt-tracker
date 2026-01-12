import { useState } from 'react'
import { User } from '../../types/user.types'
import { friendService } from '../../services/friend.service'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { UserMinus } from 'lucide-react'

interface FriendListProps {
    friends: User[]
    onUpdate: () => void
}

export default function FriendList({ friends, onUpdate }: FriendListProps) {
    const [selectedFriend, setSelectedFriend] = useState<User | null>(null)
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleRemoveClick = (friend: User) => {
        setSelectedFriend(friend)
        setIsRemoveModalOpen(true)
    }

    const confirmRemove = async () => {
        if (!selectedFriend) return
        try {
            setIsLoading(true)
            await friendService.removeFriend(selectedFriend.id)
            onUpdate()
            setIsRemoveModalOpen(false)
        } catch (error) {
            console.error('Failed to remove friend:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (friends.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <p>You haven't added any friends yet.</p>
                <p className="text-sm">Send a request to connect!</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {friends.map((friend) => (
                    <Card key={friend.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-bold text-white">
                                {friend.avatarUrl ? (
                                    <img src={friend.avatarUrl} alt={friend.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    friend.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200">{friend.name}</h3>
                                <p className="text-xs text-slate-400">{friend.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="danger" size="sm" onClick={() => handleRemoveClick(friend)}>
                                <UserMinus className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isRemoveModalOpen}
                onClose={() => setIsRemoveModalOpen(false)}
                title="Remove Friend"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-slate-300">
                        Are you sure you want to remove <span className="font-bold text-white">{selectedFriend?.name}</span> from your friends list?
                    </p>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={() => setIsRemoveModalOpen(false)} className="flex-1">Cancel</Button>
                        <Button variant="danger" onClick={confirmRemove} isLoading={isLoading} className="flex-1">Remove</Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
