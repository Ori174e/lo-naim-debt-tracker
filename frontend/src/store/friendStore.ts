import { create } from 'zustand'
import { User } from '../types/user.types'
import { friendService, FriendRequest } from '../services/friend.service'

interface FriendState {
    friends: User[]
    pendingRequests: {
        sent: FriendRequest[]
        received: FriendRequest[]
    }
    isLoading: boolean
    error: string | null
    fetchFriends: () => Promise<void>
    fetchPendingRequests: () => Promise<void>
}

export const useFriendStore = create<FriendState>((set) => ({
    friends: [],
    pendingRequests: {
        sent: [],
        received: [],
    },
    isLoading: false,
    error: null,

    fetchFriends: async () => {
        try {
            set({ isLoading: true, error: null })
            const friends = await friendService.getFriends()
            set({ friends, isLoading: false })
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.message || 'Failed to fetch friends'
            })
        }
    },

    fetchPendingRequests: async () => {
        try {
            // In a real usage, we might verify we want to merge or separate these loading states
            // for now sharing 'isLoading' is fine
            // set({ isLoading: true, error: null }) 
            const requests = await friendService.getRequests()
            set({ pendingRequests: requests })
        } catch (error: any) {
            console.error('Failed to fetch requests', error)
            // We don't block main UI for this error usually
        }
    }
}))
