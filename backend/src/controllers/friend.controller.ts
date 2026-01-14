import { Response, NextFunction } from 'express'
import { friendService } from '../services/friend.service'
import { AuthRequest } from '../middleware/auth.middleware'
import { z } from 'zod'

// Simple schema for request
const sendRequestSchema = z.object({
    email: z.string().email(),
})

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class FriendController {
    getFriends = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const friends = await friendService.getFriends(req.userId!)
            res.json(friends)
        } catch (error) {
            next(error)
        }
    }

    getRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const requests = await friendService.getPendingRequests(req.userId!)
            res.json(requests)
        } catch (error) {
            next(error)
        }
    }

    sendRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { email } = sendRequestSchema.parse(req.body)
            const result = await friendService.sendRequest(req.userId!, email)
            res.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }

    searchUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { q } = req.query
            if (typeof q !== 'string') {
                res.status(400).json({ message: 'Search query required' })
                return
            }
            const results = await friendService.searchUsers(req.userId!, q)
            res.json(results)
        } catch (error) {
            next(error)
        }
    }

    respondToRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string }
            const { status } = req.body // EXPECTS { status: 'ACCEPTED' | 'REJECTED' }

            if (status !== 'ACCEPTED' && status !== 'REJECTED') {
                res.status(400).json({ message: 'Invalid status' })
                return
            }

            const result = await friendService.respondToRequest(req.userId!, id, status)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    removeFriend = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params as { id: string } // This is the FRIEND'S user ID, not the friendship ID for convenience
            const result = await friendService.removeFriend(req.userId!, id)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    respondToRequestBySender = async (req: AuthRequest, res: Response) => {
        const { senderId, status } = req.body
        console.log(`🕵️ Looking for friendship: Sender=${senderId}, Receiver=${req.userId}`);

        // 2. Dump ALL friendships for this user (to see what exists)
        const allFriendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { user1Id: req.userId },
                    { user2Id: req.userId }
                ]
            }
        });
        console.log("📊 DB DUMP (User's Friendships):", JSON.stringify(allFriendships, null, 2));

        // 3. Try to find the record (Loose Search - ignoring status)
        let friendship = allFriendships.find(f =>
            (f.user1Id === senderId && f.user2Id === req.userId) ||
            (f.user1Id === req.userId && f.user2Id === senderId) // Check reverse direction too
        );

        if (!friendship) {
            console.error("❌ STILL NOT FOUND after loose search.");
            return res.status(404).json({ message: "Friendship record not found (Ghost Notification)" });
        }

        console.log("✅ FOUND Friendship:", friendship);

        // 4. Update it
        if (status === 'REJECTED') {
            await prisma.friendship.delete({ where: { id: friendship.id } });
            return res.json({ message: 'Request rejected' });
        }

        const updated = await prisma.friendship.update({
            where: { id: friendship.id },
            data: { status: 'ACCEPTED' }
        });

        return res.json(updated);
    }
}

export const friendController = new FriendController()
