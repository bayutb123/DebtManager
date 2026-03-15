import { create } from 'zustand';
import type { Payment, Receivable } from '../../types/common';
import { ReceivableService } from './receivables.service';
import type { ReceivableFilters } from './receivables.types';

interface ReceivableState {
  receivables: Receivable[];
  loading: boolean;
  error?: string;
  fetchReceivables: (filters?: ReceivableFilters) => Promise<void>;
  addReceivable: (
    payload: Omit<Receivable, 'id' | 'createdAt' | 'paidAmount' | 'status'>,
  ) => Promise<Receivable>;
  updateReceivable: (id: string, payload: Partial<Receivable>) => Promise<Receivable>;
  removeReceivable: (id: string) => Promise<void>;
  addPayment: (id: string, payment: Payment) => Promise<Receivable>;
}

export const useReceivableStore = create<ReceivableState>((set, get) => ({
  receivables: [],
  loading: false,
  async fetchReceivables(filters) {
    set({ loading: true, error: undefined });
    try {
      const data = await ReceivableService.list(filters);
      set({ receivables: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
  async addReceivable(payload) {
    const newItem = await ReceivableService.create(payload);
    set({ receivables: [newItem, ...get().receivables] });
    return newItem;
  },
  async updateReceivable(id, payload) {
    const updated = await ReceivableService.update(id, payload);
    set({ receivables: get().receivables.map((d) => (d.id === id ? updated : d)) });
    return updated;
  },
  async removeReceivable(id) {
    await ReceivableService.remove(id);
    set({ receivables: get().receivables.filter((d) => d.id !== id) });
  },
  async addPayment(id, payment) {
    const updated = await ReceivableService.addPayment(id, payment);
    set({ receivables: get().receivables.map((d) => (d.id === id ? updated : d)) });
    return updated;
  },
}));
