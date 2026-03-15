import type { Payment } from '../../types/common';

export const transactionsMock: Payment[] = [
  { id: 't-1', referenceId: 'd-1001', type: 'DEBT', amount: 150, date: '2026-02-10', note: 'Partial payment' },
  { id: 't-2', referenceId: 'r-2001', type: 'RECEIVABLE', amount: 100, date: '2026-02-15', note: 'Installment' },
  { id: 't-3', referenceId: 'd-1003', type: 'DEBT', amount: 300, date: '2026-03-05', note: 'Down payment' },
  { id: 't-4', referenceId: 'r-2002', type: 'RECEIVABLE', amount: 220, date: '2026-01-18', note: 'Reimbursed' },
];
