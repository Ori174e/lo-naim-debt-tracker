import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'
import FriendList from '../components/friends/FriendList'
import AddFriendForm from '../components/friends/AddFriendForm'
import FriendRequestList from '../components/friends/FriendRequestList'
import { friendService, FriendRequest } from '../services/friend.service'
import { User } from '../types/user.types'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function FriendsPage() {
    const [friends, setFriends] = useState<User[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const { friends, pendingRequests } = useFriendStore()

    const hasFriends = friends.length > 0
    const hasRequests = pendingRequests.received.length > 0 || pendingRequests.sent.length > 0

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-primary-500/30">
            <Header />
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">Your Friends ({friends.length})</h2>
                {isLoading ? (
                    <div className="text-center py-12">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <FriendList friends={friends} onUpdate={loadData} />
                )}
            </div>
        </div>
            </main >
        <Navigation />
        </div >
    )
}
