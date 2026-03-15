import type { Payment } from '../../types/common';
import { apiClient } from '../../services/api/client';
import { mockStorage } from '../../services/mock/localDb';
import { transactionsMock } from './transactions.mock';

export const TransactionsService = {
  list: async (): Promise<Payment[]> =>
    mockStorage.enabled ? mockStorage.get<Payment[]>('drm-transactions', transactionsMock) : apiClient.get<Payment[]>('/transactions'),
};
