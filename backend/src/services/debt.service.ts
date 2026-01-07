import { PrismaClient } from '@prisma/client'
import { AppError } from '../middleware/errorHandler.middleware'
import { CreateDebtInput, UpdateDebtInput } from '../validators/debt.validator'
import { notificationService } from './notification.service'

const prisma = new PrismaClient()

export class DebtService {
    async createDebt(lenderId: string, data: CreateDebtInput) {
        // Find borrower by email
        const borrower = await prisma.user.findUnique({
            where: { email: data.borrowerEmail },
        })

        if (!borrower) {
            throw new AppError('Borrower not found. They must have an account first.', 404)
        }

        if (borrower.id === lenderId) {
            throw new AppError('You cannot create a debt with yourself', 400)
        }

        // Create the debt
        const debt = await prisma.debt.create({
            data: {
                lenderId,
                borrowerId: borrower.id,
                originalAmount: data.originalAmount,
                remainingAmount: data.originalAmount,
                currency: data.currency || 'USD',
                description: data.description,
                dueDate: data.dueDate ? new Date(data.dueDate) : null,
            },
            include: {
                lender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                borrower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        })

        // TRIGGER NOTIFICATION to the borrower
        await notificationService.createNotification(
            debt.borrowerId,
            'DEBT_CREATED',
            'New Debt Added',
            `${debt.lender.name} added a debt of ${debt.originalAmount} ${debt.currency} for "${debt.description}"`,
            debt.lenderId, // senderId
            debt.id        // debtId
        )

        return this.formatDebt(debt)
    }

    async getMyDebts(userId: string) {
        const debts = await prisma.debt.findMany({
            where: {
                OR: [
                    { lenderId: userId },
                    { borrowerId: userId },
                ],
            },
            include: {
                lender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                borrower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        const formatted = debts.map((debt) => this.formatDebt(debt))

        return {
            asLender: formatted.filter((d) => d.lenderId === userId),
            asBorrower: formatted.filter((d) => d.borrowerId === userId),
            all: formatted,
        }
    }

    async getDebtById(debtId: string, userId: string) {
        const debt = await prisma.debt.findUnique({
            where: { id: debtId },
            include: {
                lender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                borrower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                payments: {
                    orderBy: {
                        paymentDate: 'desc',
                    },
                },
            },
        })

        if (!debt) {
            throw new AppError('Debt not found', 404)
        }

        // Check authorization
        if (debt.lenderId !== userId && debt.borrowerId !== userId) {
            throw new AppError('You are not authorized to view this debt', 403)
        }

        return this.formatDebt(debt)
    }

    async updateDebt(debtId: string, userId: string, data: UpdateDebtInput) {
        const debt = await prisma.debt.findUnique({
            where: { id: debtId },
        })

        if (!debt) {
            throw new AppError('Debt not found', 404)
        }

        // Only lender can update debt details
        if (debt.lenderId !== userId) {
            throw new AppError('Only the lender can update debt details', 403)
        }

        const updated = await prisma.debt.update({
            where: { id: debtId },
            data: {
                description: data.description,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
                status: data.status,
            },
            include: {
                lender: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                borrower: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        })

        return this.formatDebt(updated)
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
            payments: debt.payments?.map((p: any) => ({
                id: p.id,
                amount: Number(p.amount),
                paymentDate: p.paymentDate.toISOString(),
                note: p.note,
                recordedBy: p.recordedBy,
            })),
        }
    }
}

export const debtService = new DebtService()
