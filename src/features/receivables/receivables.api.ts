import type { Payment, Receivable } from '../../types/common';
import { apiClient } from '../../services/api/client';

export const ReceivablesApi = {
  list: () => apiClient.get<Receivable[]>('/receivables'),
  getById: (id: string) => apiClient.get<Receivable>(`/receivables/${id}`),
  create: (payload: Omit<Receivable, 'id' | 'createdAt' | 'paidAmount' | 'status'>) =>
    apiClient.post<Receivable>('/receivables', payload),
  update: (id: string, payload: Partial<Receivable>) => apiClient.put<Receivable>(`/receivables/${id}`, payload),
  remove: (id: string) => apiClient.del<void>(`/receivables/${id}`),
  addPayment: (id: string, payment: Payment) => apiClient.post<Receivable>(`/receivables/${id}/payment`, payment),
};
