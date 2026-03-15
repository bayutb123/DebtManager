import type { Debt, Payment } from '../../types/common';
import { apiClient } from '../../services/api/client';
import { mockStorage } from '../../services/mock/localDb';
import { debtsMock } from './debts.mock';

export const DebtsApi = {
  list: async (): Promise<Debt[]> =>
    mockStorage.enabled
      ? Promise.resolve(mockStorage.get<Debt[]>('drm-debts', debtsMock))
      : apiClient.get<Debt[]>('/debts'),
  getById: (id: string): Promise<Debt> =>
    mockStorage.enabled
      ? Promise.resolve((mockStorage.get<Debt[]>('drm-debts', debtsMock) || []).find((d) => d.id === id)!)
      : apiClient.get<Debt>(`/debts/${id}`),
  create: (payload: Omit<Debt, 'id' | 'createdAt' | 'paidAmount' | 'status'>): Promise<Debt> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Debt[]>('drm-debts', debtsMock);
      const newDebt: Debt = {
        ...payload,
        id: `d-${Date.now()}`,
        createdAt: new Date().toISOString(),
        paidAmount: 0,
        status: 'ACTIVE',
      };
      const updated = [newDebt, ...current];
      mockStorage.set('drm-debts', updated);
      return Promise.resolve(newDebt);
    }
    return apiClient.post<Debt>('/debts', payload);
  },
  update: (id: string, payload: Partial<Debt>): Promise<Debt> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Debt[]>('drm-debts', debtsMock);
      const updatedList = current.map((d) => (d.id === id ? { ...d, ...payload } : d));
      const updated = updatedList.find((d) => d.id === id)!;
      mockStorage.set('drm-debts', updatedList);
      return Promise.resolve(updated);
    }
    return apiClient.put<Debt>(`/debts/${id}`, payload);
  },
  remove: (id: string): Promise<void> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Debt[]>('drm-debts', debtsMock).filter((d) => d.id !== id);
      mockStorage.set('drm-debts', current);
      return Promise.resolve();
    }
    return apiClient.del<void>(`/debts/${id}`);
  },
  addPayment: (id: string, payment: Payment): Promise<Debt> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Debt[]>('drm-debts', debtsMock);
      const updatedList = current.map((d) =>
        d.id === id
          ? {
            ...d,
            paidAmount: Math.min(d.amount, d.paidAmount + payment.amount),
            status: (d.paidAmount + payment.amount >= d.amount ? 'PAID' : 'PARTIAL') as Debt['status'],
          }
        : d,
      );
      const updated = updatedList.find((d) => d.id === id)!;
      mockStorage.set('drm-debts', updatedList);
      return Promise.resolve(updated);
    }
    return apiClient.post<Debt>(`/debts/${id}/payment`, payment);
  },
};
