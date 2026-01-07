import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import { RecordPaymentInput } from '../validators/payment.validator'
import { notificationService } from './notification.service'

const prisma = new PrismaClient()

export class PaymentService {
    async recordPayment(userId: string, data: RecordPaymentInput) {
        // Get the debt with current amount
        const debt = await prisma.debt.findUnique({
            where: { id: data.debtId },
            include: {
                lender: true,
                borrower: true,
            },
        })

        if (!debt) {
            throw new AppError('Debt not found', 404)
        }

        // Check authorization - only lender or borrower can record payment
        if (debt.lenderId !== userId && debt.borrowerId !== userId) {
            throw new AppError('You are not authorized to record payment for this debt', 403)
        }

        // Check if debt is already settled
        if (debt.status === 'SETTLED') {
            throw new AppError('Cannot add payment to a settled debt', 400)
        }

        // Validate payment amount
        const remainingAmount = Number(debt.remainingAmount)
        if (data.amount > remainingAmount) {
            throw new AppError(
                `Payment amount ($${data.amount}) exceeds remaining debt ($${remainingAmount})`,
                400
            )
        }

        // Calculate new remaining amount
        const newRemainingAmount = remainingAmount - data.amount
        const isFullyPaid = newRemainingAmount === 0

        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Create payment record
            const payment = await tx.payment.create({
                data: {
                    debtId: data.debtId,
                    amount: data.amount,
                    note: data.note,
                    recordedBy: userId,
                },
            })

            // Update debt remaining amount and status
            const updatedDebt = await tx.debt.update({
                where: { id: data.debtId },
                data: {
                    remainingAmount: newRemainingAmount,
                    status: isFullyPaid ? 'SETTLED' : debt.status,
                    settledAt: isFullyPaid ? new Date() : null,
                },
                include: {
                    lender: true,
                    borrower: true,
                    payments: {
                        orderBy: {
                            paymentDate: 'desc',
                        },
                    },
                },
            })

            return { payment, debt: updatedDebt }
        })

        // TRIGGER NOTIFICATIONS
        const targetUserId = userId === debt.lenderId ? debt.borrowerId : debt.lenderId
        const recorderName = userId === debt.lenderId ? debt.lender.name : debt.borrower.name

        // Notify about payment
        await notificationService.createNotification(
            targetUserId,
            'PAYMENT_RECEIVED', // Generic type for payment activity
            'Payment Recorded',
            `${recorderName} recorded a payment of ${data.amount} ${debt.currency}`,
            userId,
            debt.id
        )

        // If settled, notify both (or just the one who didn't trigger it, effectively handled above + extra info)
        if ((result.debt.status as string) === 'SETTLED' && (debt.status as string) !== 'SETTLED') {
            await notificationService.createNotification(
                targetUserId,
                'DEBT_SETTLED',
                'Debt Settled',
                `The debt "${debt.description}" has been settled!`,
                userId,
                debt.id
            )
        }

        return {
            payment: this.formatPayment(result.payment),
            debt: this.formatDebt(result.debt),
        }
    }

    async getPaymentsByDebt(debtId: string, userId: string) {
        // First check if user has access to this debt
        const debt = await prisma.debt.findUnique({
            where: { id: debtId },
        })

        if (!debt) {
            throw new AppError('Debt not found', 404)
        }

        if (debt.lenderId !== userId && debt.borrowerId !== userId) {
            throw new AppError('You are not authorized to view payments for this debt', 403)
        }

        const payments = await prisma.payment.findMany({
            where: { debtId },
            include: {
                recorder: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                paymentDate: 'desc',
            },
        })

        return payments.map((p) => this.formatPayment(p))
    }

    async settleDebt(debtId: string, userId: string) {
        const debt = await prisma.debt.findUnique({
            where: { id: debtId },
            include: {
                lender: true,
                borrower: true
            }
        })

        if (!debt) {
            throw new AppError('Debt not found', 404)
        }

        // Only lender or borrower can settle
        if (debt.lenderId !== userId && debt.borrowerId !== userId) {
            throw new AppError('You are not authorized to settle this debt', 403)
        }

        if (debt.status === 'SETTLED') {
            throw new AppError('Debt is already settled', 400)
        }

        const remainingAmount = Number(debt.remainingAmount)
        if (remainingAmount === 0) {
            throw new AppError('Debt has no remaining balance', 400)
        }

        // Create payment for remaining amount and mark as settled
        const result = await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.create({
                data: {
                    debtId,
                    amount: remainingAmount,
                    note: 'Debt settled in full',
                    recordedBy: userId,
                },
            })

            const updatedDebt = await tx.debt.update({
                where: { id: debtId },
                data: {
                    remainingAmount: 0,
                    status: 'SETTLED',
                    settledAt: new Date(),
                },
                include: {
                    lender: true,
                    borrower: true,
                    payments: {
                        orderBy: {
                            paymentDate: 'desc',
                        },
                    },
                },
            })

            return { payment, debt: updatedDebt }
        })

        // TRIGGER NOTIFICATIONS
        const targetUserId = userId === debt.lenderId ? debt.borrowerId : debt.lenderId
        const settlerName = userId === debt.lenderId ? debt.lender.name : debt.borrower.name

        await notificationService.createNotification(
            targetUserId,
            'DEBT_SETTLED',
            'Debt Settled',
            `${settlerName} settled the debt "${debt.description}"`,
            userId,
            debt.id
        )

        return {
            payment: this.formatPayment(result.payment),
            debt: this.formatDebt(result.debt),
        }
    }

    private formatPayment(payment: any) {
        return {
            id: payment.id,
            debtId: payment.debtId,
            amount: Number(payment.amount),
            paymentDate: payment.paymentDate.toISOString(),
            note: payment.note,
            recordedBy: payment.recordedBy,
            recorder: payment.recorder,
        }
    }

    private formatDebt(debt: any) {
        return {
            id: debt.id,
            lenderId: debt.lenderId,
            borrowerId: debt.borrowerId,
            originalAmount: Number(debt.originalAmount),
            remainingAmount: Number(debt.remainingAmount),
            currency: debt.currency,
            description: debt.description,
            status: debt.status,
            dueDate: debt.dueDate?.toISOString(),
            createdAt: debt.createdAt.toISOString(),
            updatedAt: debt.updatedAt.toISOString(),
            settledAt: debt.settledAt?.toISOString(),
            lender: debt.lender,
            borrower: debt.borrower,
            payments: debt.payments?.map((p: any) => this.formatPayment(p)),
        }
    }
}

export const paymentService = new PaymentService()
