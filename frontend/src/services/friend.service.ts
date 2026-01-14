import api from './api'
import { User } from '../types/user.types'

export interface FriendRequest {
    id: string
    user1Id: string
    user2Id: string
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED'
    createdAt: string
    requester?: User
    recipient?: User
}

export const friendService = {
    async getFriends(): Promise<User[]> {
        const response = await api.get('/friends')
        return response.data
    },

    async getRequests(): Promise<{ sent: FriendRequest[]; received: FriendRequest[] }> {
        const response = await api.get('/friends/requests')
        return response.data
    },

    async sendRequest(email: string): Promise<FriendRequest> {
        const response = await api.post('/friends/request', { email })
        return response.data
    },

    async respondToRequest(requestId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<FriendRequest> {
        const response = await api.post(`/friends/requests/${requestId}/respond`, { status })
        return response.data
    },

    async searchUsers(query: string): Promise<User[]> {
        const response = await api.get('/friends/search', { params: { q: query } })
        return response.data
    },

    async respondToRequestBySender(senderId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<void> {
        await api.post('/friends/requests/respond-by-sender', { senderId, status })
    },

    async removeFriend(friendId: string): Promise<{ message: string }> {
        const response = await api.delete(`/friends/${friendId}`)
        return response.data
    },
}
