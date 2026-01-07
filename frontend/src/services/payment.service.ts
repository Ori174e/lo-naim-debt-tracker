import api from './api'

export interface RecordPaymentData {
    debtId: string
    amount: number
    note?: string
}

export interface Payment {
    id: string
    debtId: string
    amount: number
    paymentDate: string
    note?: string
    recordedBy: string
    recorder?: {
        id: string
        name: string
        email: string
    }
}

export const paymentService = {
    async recordPayment(data: RecordPaymentData) {
        const response = await api.post('/payments', data)
        return response.data
    },

    async getPaymentHistory(debtId: string): Promise<Payment[]> {
        const response = await api.get(`/payments/debt/${debtId}`)
        return response.data
    },

    async settleDebt(debtId: string) {
        const response = await api.post(`/debts/${debtId}/settle`)
        return response.data
    },
}
