import { useState, useEffect } from 'react'
import Header from '../components/layout/Header'
import Navigation from '../components/layout/Navigation'
import FriendList from '../components/friends/FriendList'
import SearchFriend from '../components/friends/SearchFriend'
import FriendRequestList from '../components/friends/FriendRequestList'
import { useFriendStore } from '../store/friendStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Plus } from 'lucide-react'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

export default function FriendsPage() {
    const { friends, pendingRequests, fetchFriends, fetchPendingRequests, isLoading } = useFriendStore()
    const [isAddOpen, setIsAddOpen] = useState(false)

    useEffect(() => {
        fetchFriends()
        fetchPendingRequests()
    }, [fetchFriends, fetchPendingRequests])

    // Load data callback for child components if needed, or rely on store
    const handleUpdate = () => {
        fetchFriends()
        fetchPendingRequests()
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-primary-500/30">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-8 mb-20">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold text-white">Friends</h1>
                    <Button onClick={() => setIsAddOpen(true)}>
                        <Plus className="w-5 h-5 mr-2" />
                        Add Friend
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Friends List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-4">Your Friends ({friends.length})</h2>
                        {isLoading ? (
                            <div className="text-center py-12">
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <FriendList friends={friends} onUpdate={handleUpdate} />
                        )}
                    </div>

                    {/* Sidebar - Requests */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold mb-4">Friend Requests</h2>
                            <FriendRequestList
                                received={pendingRequests.received}
                                sent={pendingRequests.sent}
                                onUpdate={handleUpdate}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Navigation />

            <Modal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Add a New Friend"
            >
                <div className="space-y-6">
                    <p className="text-slate-400 text-sm">
                        Search for a user by email to send a friend request.
                    </p>
                    <SearchFriend onFriendAdded={() => {
                        handleUpdate()
                        setIsAddOpen(false)
                    }} />
                </div>
            </Modal>
        </div>
    )
}
