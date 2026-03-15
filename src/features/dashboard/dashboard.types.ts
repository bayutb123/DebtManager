import type { Payment } from '../../types/common';

export interface DashboardStats {
  totalDebt: number;
  totalReceivable: number;
  netBalance: number;
  recentTransactions: Payment[];
}
