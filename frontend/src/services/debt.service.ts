import api from './api'
import { Debt, CreateDebtData } from '../types/debt.types'

interface DebtsResponse {
    asLender: Debt[]
    asBorrower: Debt[]
    all: Debt[]
}

export const debtService = {
    async createDebt(data: CreateDebtData): Promise<Debt> {
        const response = await api.post('/debts', data)
        return response.data
    },

    async getMyDebts(): Promise<DebtsResponse> {
        const response = await api.get('/debts')
        return response.data
    },

    async getDebtById(id: string): Promise<Debt> {
        const response = await api.get(`/debts/${id}`)
        return response.data
    },

    async updateDebt(id: string, data: Partial<Debt>): Promise<Debt> {
        const response = await api.patch(`/debts/${id}`, data)
        return response.data
    },
}
