import { Response, NextFunction } from 'express'
import { friendService } from '../services/friend.service'
import { AuthRequest } from '../middleware/auth.middleware'
import { z } from 'zod'

// Simple schema for request
const sendRequestSchema = z.object({
    email: z.string().email(),
})

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

    respondToRequestBySender = async (req: AuthRequest, res: Response, next: NextFunction) => {
        console.log("🚀 ROUTE HIT: respondToRequestBySender called");
        console.log("Payload received:", req.body);
        console.log("User ID (Receiver):", req.userId);
        try {
            const { senderId, status } = req.body
            const result = await friendService.respondToRequestBySender(req.userId!, senderId, status)
            res.json(result)
        } catch (error) {
            next(error)
        }
    }
}

export const friendController = new FriendController()
