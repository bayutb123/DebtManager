import { apiClient } from '../../services/api/client';
import type { Payment } from '../../types/common';

export interface DashboardSummary {
  totalDebt: number;
  totalReceivable: number;
  netBalance: number;
  recentTransactions: Payment[];
}

export const DashboardService = {
  getSummary: () => apiClient.get<DashboardSummary>('/dashboard/summary'),
};
