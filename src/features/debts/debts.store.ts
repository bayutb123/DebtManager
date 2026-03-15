import { create } from 'zustand';
import type { Debt, Payment } from '../../types/common';
import { DebtService } from './debts.service';
import type { DebtFilters } from './debts.types';

interface DebtState {
  debts: Debt[];
  loading: boolean;
  error?: string;
  fetchDebts: (filters?: DebtFilters) => Promise<void>;
  addDebt: (payload: Omit<Debt, 'id' | 'createdAt' | 'paidAmount' | 'status'>) => Promise<Debt>;
  updateDebt: (id: string, payload: Partial<Debt>) => Promise<Debt>;
  removeDebt: (id: string) => Promise<void>;
  addPayment: (id: string, payment: Payment) => Promise<Debt>;
}

export const useDebtStore = create<DebtState>((set, get) => ({
  debts: [],
  loading: false,
  async fetchDebts(filters) {
    set({ loading: true, error: undefined });
    try {
      const data = await DebtService.list(filters);
      set({ debts: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
  async addDebt(payload) {
    const newDebt = await DebtService.create(payload);
    set({ debts: [newDebt, ...get().debts] });
    return newDebt;
  },
  async updateDebt(id, payload) {
    const updated = await DebtService.update(id, payload);
    set({ debts: get().debts.map((d) => (d.id === id ? updated : d)) });
    return updated;
  },
  async removeDebt(id) {
    await DebtService.remove(id);
    set({ debts: get().debts.filter((d) => d.id !== id) });
  },
  async addPayment(id, payment) {
    const updated = await DebtService.addPayment(id, payment);
    set({ debts: get().debts.map((d) => (d.id === id ? (updated as Debt) : d)) });
    return updated as Debt;
  },
}));
