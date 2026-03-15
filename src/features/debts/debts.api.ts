import type { Debt, Payment } from '../../types/common';
import { apiClient } from '../../services/api/client';

export const DebtsApi = {
  list: () => apiClient.get<Debt[]>('/debts'),
  getById: (id: string) => apiClient.get<Debt>(`/debts/${id}`),
  create: (payload: Omit<Debt, 'id' | 'createdAt' | 'paidAmount' | 'status'>) =>
    apiClient.post<Debt>('/debts', payload),
  update: (id: string, payload: Partial<Debt>) => apiClient.put<Debt>(`/debts/${id}`, payload),
  remove: (id: string) => apiClient.del<void>(`/debts/${id}`),
  addPayment: (id: string, payment: Payment) => apiClient.post<Debt>(`/debts/${id}/payment`, payment),
};
