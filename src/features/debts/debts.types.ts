import type { Debt, Payment } from '../../types/common';

export type DebtWithContact = Debt & { contactName?: string };

export interface DebtFilters {
  status?: Debt['status'] | 'ALL';
  search?: string;
}

export interface DebtStats {
  totalDebt: number;
  totalPaid: number;
  outstanding: number;
}

export type DebtPayment = Payment;
