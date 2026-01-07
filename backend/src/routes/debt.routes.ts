import { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { debtController } from '../controllers/debt.controller'
import { paymentController } from '../controllers/payment.controller'

const router = Router()

router.use(authMiddleware)

// Debt routes
router.post('/', debtController.createDebt.bind(debtController))
router.get('/', debtController.getMyDebts.bind(debtController))
router.get('/:id', debtController.getDebtById.bind(debtController))
router.patch('/:id', debtController.updateDebt.bind(debtController))

// Settle debt
router.post('/:id/settle', paymentController.settleDebt.bind(paymentController))

export default router
