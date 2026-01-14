import { PrismaClient, FriendshipStatus } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import { notificationService } from './notification.service'

const prisma = new PrismaClient()

export class FriendService {
    async sendRequest(userId: string, targetEmail: string) {
        // 1. Find target user
        const targetUser = await prisma.user.findUnique({
            where: { email: targetEmail },
        })

        if (!targetUser) {
            throw new AppError('User not found', 404)
        }

        if (targetUser.id === userId) {
            throw new AppError('You cannot send a friend request to yourself', 400)
        }

        // 2. Check existing friendship or request
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: targetUser.id },
                    { user1Id: targetUser.id, user2Id: userId },
                ],
            },
        })

        if (existing) {
            if (existing.status === 'ACCEPTED') {
                throw new AppError('You are already friends', 400)
            }
            if (existing.status === 'PENDING') {
                throw new AppError('A friend request is already pending', 400)
            }
            if (existing.status === 'BLOCKED') {
                throw new AppError('Unable to send request', 400) // Generic message for blocked
            }
        }

        // 3. Create request
        // We always store the requester as user1 for PENDING requests initially, 
        // or we just trust the status. For simplicity: user1 is requester.
        const friendship = await prisma.friendship.create({
            data: {
                user1Id: userId,
                user2Id: targetUser.id,
                status: FriendshipStatus.PENDING,
            },
            include: {
                user1: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
                user2: {
                    select: { id: true, name: true, email: true, avatarUrl: true },
                },
            },
        })

        // TRIGGER NOTIFICATION
        await notificationService.createNotification(
            targetUser.id,
            'FRIEND_REQUEST',
            'New Friend Request',
            `You have a friend request from ${friendship.user1?.name}`,
            userId // senderId
        )

        return friendship
    }

    async respondToRequest(userId: string, requestId: string, status: 'ACCEPTED' | 'REJECTED') {
        const friendship = await prisma.friendship.findUnique({
            where: { id: requestId },
        })

        if (!friendship) {
            throw new AppError('Friend request not found', 404)
        }

        // Only the recipient (user2) can accept/reject
        if (friendship.user2Id !== userId) {
            throw new AppError('Not authorized to respond to this request', 403)
        }

        if (friendship.status !== 'PENDING') {
            throw new AppError('Request is not pending', 400)
        }

        if (status === 'REJECTED') {
            // Delete the record if rejected
            await prisma.friendship.delete({
                where: { id: requestId },
            })
            return { message: 'Request rejected' }
        }

        // Accept
        const updated = await prisma.friendship.update({
            where: { id: requestId },
            data: { status: FriendshipStatus.ACCEPTED },
            include: {
                user1: { select: { id: true, name: true, email: true, avatarUrl: true } },
                user2: { select: { id: true, name: true, email: true, avatarUrl: true } },
            },
        })

        // TRIGGER NOTIFICATION
        await notificationService.createNotification(
            updated.user1Id,
            'FRIEND_REQUEST',
            'Friend Request Accepted',
            `${updated.user2.name} accepted your friend request`,
            updated.user2Id // senderId
        )

        return updated
    }

    async respondToRequestBySender(userId: string, senderId: string, status: 'ACCEPTED' | 'REJECTED') {
        console.log(`🔍 Searching for pending friendship between Sender: ${senderId} and Receiver: ${userId}`);
        const friendship = await prisma.friendship.findFirst({
            where: {
                user1Id: senderId,
                user2Id: userId,
                status: 'PENDING',
            },
        })

        if (!friendship) {
            console.error("❌ Friendship NOT FOUND in DB. Returning 404.");
            // Also try reverse lookup for debugging purposes
            const reverse = await prisma.friendship.findFirst({
                where: { user1Id: userId, user2Id: senderId, status: 'PENDING' }
            });
            if (reverse) console.log("Found reverse pending request (User -> Sender).");

            throw new AppError('Friend request not found', 404)
        }

        return this.respondToRequest(userId, friendship.id, status)
    }

    async getFriends(userId: string) {
        const friendships = await prisma.friendship.findMany({
            where: {
                AND: [
                    { status: 'ACCEPTED' },
                    {
                        OR: [{ user1Id: userId }, { user2Id: userId }],
                    },
                ],
            },
            include: {
                user1: { select: { id: true, name: true, email: true, avatarUrl: true } },
                user2: { select: { id: true, name: true, email: true, avatarUrl: true } },
            },
        })

        // Map to just the "other" user
        return friendships.map((f) => {
            return f.user1Id === userId ? f.user2 : f.user1
        })
    }

    async getPendingRequests(userId: string) {
        const received = await prisma.friendship.findMany({
            where: {
                user2Id: userId,
                status: 'PENDING',
            },
            include: {
                user1: { select: { id: true, name: true, email: true, avatarUrl: true } },
            },
        })

        const sent = await prisma.friendship.findMany({
            where: {
                user1Id: userId,
                status: 'PENDING',
            },
            include: {
                user2: { select: { id: true, name: true, email: true, avatarUrl: true } },
            },
        })

        return {
            received: received.map(f => ({ ...f, requester: f.user1 })),
            sent: sent.map(f => ({ ...f, recipient: f.user2 })),
        }
    }

    async removeFriend(userId: string, friendId: string) {
        // Find the relationship
        const friendship = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: friendId },
                    { user1Id: friendId, user2Id: userId },
                ],
            },
        })

        if (!friendship) {
            throw new AppError('Friendship not found', 404)
        }

        await prisma.friendship.delete({
            where: { id: friendship.id },
        })

        return { message: 'Friend removed' }
    }
    async searchUsers(currentUserId: string, query: string) {
        if (!query || query.length < 2) return []

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUserId } },
                    {
                        OR: [
                            { email: { contains: query, mode: 'insensitive' } },
                            { name: { contains: query, mode: 'insensitive' } },
                            { phone: { contains: query, mode: 'insensitive' } },
                        ],
                    },
                ],
            },
            take: 10,
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
            },
        })

        // Enhancement: Check friendship status for each user could be done here
        // For now, returning raw users is sufficient for the MVP search
        return users
    }
}

export const friendService = new FriendService()
