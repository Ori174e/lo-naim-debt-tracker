import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { paymentController } from '../controllers/payment.controller'

const router = Router()

router.use(authMiddleware)

// Payment routes
router.post('/', paymentController.recordPayment.bind(paymentController))
router.get('/debt/:debtId', paymentController.getPaymentsByDebt.bind(paymentController))

export default router
