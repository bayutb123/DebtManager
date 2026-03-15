import type { Payment, Receivable } from '../../types/common';
import { apiClient } from '../../services/api/client';
import { mockStorage } from '../../services/mock/localDb';
import { receivablesMock } from './receivables.mock';

export const ReceivablesApi = {
  list: async (): Promise<Receivable[]> =>
    mockStorage.enabled
      ? Promise.resolve(mockStorage.get<Receivable[]>('drm-receivables', receivablesMock))
      : apiClient.get<Receivable[]>('/receivables'),
  getById: (id: string): Promise<Receivable> =>
    mockStorage.enabled
      ? Promise.resolve(
          (mockStorage.get<Receivable[]>('drm-receivables', receivablesMock) || []).find((d) => d.id === id)!,
        )
      : apiClient.get<Receivable>(`/receivables/${id}`),
  create: (payload: Omit<Receivable, 'id' | 'createdAt' | 'paidAmount' | 'status'>): Promise<Receivable> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Receivable[]>('drm-receivables', receivablesMock);
      const newItem: Receivable = {
        ...payload,
        id: `r-${Date.now()}`,
        createdAt: new Date().toISOString(),
        paidAmount: 0,
        status: 'ACTIVE',
      };
      const updated = [newItem, ...current];
      mockStorage.set('drm-receivables', updated);
      return Promise.resolve(newItem);
    }
    return apiClient.post<Receivable>('/receivables', payload);
  },
  update: (id: string, payload: Partial<Receivable>): Promise<Receivable> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Receivable[]>('drm-receivables', receivablesMock);
      const updatedList = current.map((d) => (d.id === id ? { ...d, ...payload } : d));
      const updated = updatedList.find((d) => d.id === id)!;
      mockStorage.set('drm-receivables', updatedList);
      return Promise.resolve(updated);
    }
    return apiClient.put<Receivable>(`/receivables/${id}`, payload);
  },
  remove: (id: string): Promise<void> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Receivable[]>('drm-receivables', receivablesMock).filter((d) => d.id !== id);
      mockStorage.set('drm-receivables', current);
      return Promise.resolve();
    }
    return apiClient.del<void>(`/receivables/${id}`);
  },
  addPayment: (id: string, payment: Payment): Promise<Receivable> => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Receivable[]>('drm-receivables', receivablesMock);
      const updatedList = current.map((d) =>
        d.id === id
          ? {
            ...d,
            paidAmount: Math.min(d.amount, d.paidAmount + payment.amount),
            status: (d.paidAmount + payment.amount >= d.amount ? 'PAID' : 'PARTIAL') as Receivable['status'],
          }
        : d,
      );
      const updated = updatedList.find((d) => d.id === id)!;
      mockStorage.set('drm-receivables', updatedList);
      return Promise.resolve(updated);
    }
    return apiClient.post<Receivable>(`/receivables/${id}/payment`, payment);
  },
};
