import type { Receivable, Payment } from '../../types/common';

export type ReceivableWithContact = Receivable & { contactName?: string };

export interface ReceivableFilters {
  status?: Receivable['status'] | 'ALL';
  search?: string;
}

export type ReceivablePayment = Payment;
