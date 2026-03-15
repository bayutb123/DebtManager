import { apiClient } from '../../services/api/client';
import type { Payment } from '../../types/common';
import { mockStorage } from '../../services/mock/localDb';
import { debtsMock } from '../debts/debts.mock';
import { receivablesMock } from '../receivables/receivables.mock';
import { transactionsMock } from '../transactions/transactions.mock';

export interface DashboardSummary {
  totalDebt: number;
  totalReceivable: number;
  netBalance: number;
  recentTransactions: Payment[];
}

export const DashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    if (mockStorage.enabled) {
      const debts = mockStorage.get('drm-debts', debtsMock);
      const receivables = mockStorage.get('drm-receivables', receivablesMock);
      const tx = mockStorage.get('drm-transactions', transactionsMock);
      const totalDebt = debts.reduce((s, d) => s + d.amount, 0);
      const totalReceivable = receivables.reduce((s, d) => s + d.amount, 0);
      const netBalance =
        receivables.reduce((s, d) => s + d.paidAmount, 0) - debts.reduce((s, d) => s + d.paidAmount, 0);
      return {
        totalDebt,
        totalReceivable,
        netBalance,
        recentTransactions: tx.slice(0, 10),
      };
    }
    return apiClient.get<DashboardSummary>('/dashboard/summary');
  },
};
