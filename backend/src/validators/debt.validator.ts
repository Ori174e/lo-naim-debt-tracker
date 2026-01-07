import { z } from 'zod'

export const createDebtSchema = z.object({
    borrowerEmail: z.string().email('Invalid email address'),
    originalAmount: z.number().positive('Amount must be greater than 0'),
    currency: z.string().default('USD').optional(),
    description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
    dueDate: z.string().datetime().optional(),
})

export const updateDebtSchema = z.object({
    description: z.string().min(1).max(500).optional(),
    dueDate: z.string().datetime().optional(),
    status: z.enum(['ACTIVE', 'SETTLED', 'DISPUTED', 'CANCELLED']).optional(),
})

export type CreateDebtInput = z.infer<typeof createDebtSchema>
export type UpdateDebtInput = z.infer<typeof updateDebtSchema>
