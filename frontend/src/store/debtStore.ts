import { create } from 'zustand'
import { Debt, CreateDebtData } from '../types/debt.types'
import { debtService } from '../services/debt.service'
import { paymentService, RecordPaymentData } from '../services/payment.service'

interface DebtState {
    debts: Debt[]
    asLender: Debt[]
    asBorrower: Debt[]
    isLoading: boolean
    error: string | null
    fetchDebts: () => Promise<void>
    createDebt: (data: CreateDebtData) => Promise<void>
    recordPayment: (data: RecordPaymentData) => Promise<void>
    settleDebt: (debtId: string) => Promise<void>
    clearError: () => void
}

export const useDebtStore = create<DebtState>((set) => ({
    debts: [],
    asLender: [],
    asBorrower: [],
    isLoading: false,
    error: null,

    fetchDebts: async () => {
        try {
            set({ isLoading: true, error: null })
            const data = await debtService.getMyDebts()
            set({
                debts: data.all,
                asLender: data.asLender,
                asBorrower: data.asBorrower,
                isLoading: false,
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch debts',
                isLoading: false,
            })
            throw error
        }
    },

    createDebt: async (data: CreateDebtData) => {
        try {
            set({ isLoading: true, error: null })
            await debtService.createDebt(data)
            // Refresh debts after creation
            const updatedData = await debtService.getMyDebts()
            set({
                debts: updatedData.all,
                asLender: updatedData.asLender,
                asBorrower: updatedData.asBorrower,
                isLoading: false,
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create debt',
                isLoading: false,
            })
            throw error
        }
    },

    recordPayment: async (data: RecordPaymentData) => {
        try {
            set({ isLoading: true, error: null })
            await paymentService.recordPayment(data)
            // Refresh debts after payment
            const updatedData = await debtService.getMyDebts()
            set({
                debts: updatedData.all,
                asLender: updatedData.asLender,
                asBorrower: updatedData.asBorrower,
                isLoading: false,
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to record payment',
                isLoading: false,
            })
            throw error
        }
    },

    settleDebt: async (debtId: string) => {
        try {
            set({ isLoading: true, error: null })
            await paymentService.settleDebt(debtId)
            // Refresh debts after settlement
            const updatedData = await debtService.getMyDebts()
            set({
                debts: updatedData.all,
                asLender: updatedData.asLender,
                asBorrower: updatedData.asBorrower,
                isLoading: false,
            })
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to settle debt',
                isLoading: false,
            })
            throw error
        }
    },

    clearError: () => set({ error: null }),
}))
