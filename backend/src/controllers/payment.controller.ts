import { Response, NextFunction } from 'express'
import { paymentService } from '../services/payment.service'
import { recordPaymentSchema } from '../validators/payment.validator'
import { AuthRequest } from '../middleware/auth.middleware'

export class PaymentController {
    async recordPayment(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = recordPaymentSchema.parse(req.body)
            const result = await paymentService.recordPayment(req.userId!, validatedData)
            res.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getPaymentsByDebt(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { debtId } = req.params as { debtId: string }
            const payments = await paymentService.getPaymentsByDebt(debtId, req.userId!)
            res.status(200).json(payments)
        } catch (error) {
            next(error)
        }
    }

    async settleDebt(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string }
            const result = await paymentService.settleDebt(id, req.userId!)
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export const paymentController = new PaymentController()
