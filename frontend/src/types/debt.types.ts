export interface Debt {
    id: string
    lenderId: string
    borrowerId: string
    originalAmount: number
    remainingAmount: number
    currency: string
    description?: string
    status: DebtStatus
    dueDate?: string
    createdAt: string
    updatedAt: string
    settledAt?: string
    lender: {
        id: string
        name: string
        email: string
        avatarUrl?: string
    }
    borrower: {
        id: string
        name: string
        email: string
        avatarUrl?: string
    }
    payments?: Payment[]
}

export enum DebtStatus {
    ACTIVE = 'ACTIVE',
    SETTLED = 'SETTLED',
    DISPUTED = 'DISPUTED',
    CANCELLED = 'CANCELLED',
}

export interface Payment {
    id: string
    debtId: string
    amount: number
    paymentDate: string
    note?: string
    recordedBy: string
}

export interface CreateDebtData {
    borrowerId?: string
    borrowerEmail?: string
    originalAmount: number
    currency?: string
    description?: string
    dueDate?: string
}

export interface RecordPaymentData {
    debtId: string
    amount: number
    note?: string
}
