import type { Payment } from '../../types/common';
import { apiClient } from '../../services/api/client';

export const TransactionsService = {
  list: async (): Promise<Payment[]> => apiClient.get<Payment[]>('/transactions'),
};
