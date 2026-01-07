import { Response, NextFunction } from 'express'
import { debtService } from '../services/debt.service'
import { createDebtSchema, updateDebtSchema } from '../validators/debt.validator'
import { AuthRequest } from '../middleware/auth.middleware'

export class DebtController {
    async createDebt(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = createDebtSchema.parse(req.body)
            const debt = await debtService.createDebt(req.userId!, validatedData)
            res.status(201).json(debt)
        } catch (error) {
            next(error)
        }
    }

    async getMyDebts(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const debts = await debtService.getMyDebts(req.userId!)
            res.status(200).json(debts)
        } catch (error) {
            next(error)
        }
    }

    async getDebtById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const debt = await debtService.getDebtById(req.params.id, req.userId!)
            res.status(200).json(debt)
        } catch (error) {
            next(error)
        }
    }

    async updateDebt(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = updateDebtSchema.parse(req.body)
            const debt = await debtService.updateDebt(req.params.id, req.userId!, validatedData)
            res.status(200).json(debt)
        } catch (error) {
            next(error)
        }
    }
}

export const debtController = new DebtController()
