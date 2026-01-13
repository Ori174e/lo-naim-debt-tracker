import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { friendController } from '../controllers/friend.controller'

const router = Router()

router.use(authMiddleware)

// GET /api/friends - Get all active friends
router.get('/', friendController.getFriends.bind(friendController))

// GET /api/friends/requests - Get pending requests (sent & received)
router.get('/requests', friendController.getRequests.bind(friendController))

// GET /api/friends/search - Search for users
router.get('/search', friendController.searchUsers.bind(friendController))

// POST /api/friends/request - Send friend request
router.post('/request', friendController.sendRequest.bind(friendController))

// PATCH /api/friends/request/:id/respond - Accept/Reject request
router.patch('/request/:id/respond', friendController.respondToRequest.bind(friendController))

// DELETE /api/friends/:id - Remove friend (id is the friend's userId)
router.delete('/:id', friendController.removeFriend.bind(friendController))

export default router
