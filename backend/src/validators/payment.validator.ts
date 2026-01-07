import { z } from 'zod'

export const recordPaymentSchema = z.object({
    debtId: z.string().cuid('Invalid debt ID'),
    amount: z.number().positive('Payment amount must be greater than 0'),
    note: z.string().max(500, 'Note too long').optional(),
})

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>
