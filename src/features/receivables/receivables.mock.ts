import type { Receivable } from '../../types/common';

export const receivablesMock: Receivable[] = [
  {
    id: 'r-2001',
    contactId: 'c-2',
    title: 'Sold old phone',
    amount: 450,
    paidAmount: 150,
    dueDate: '2026-03-30',
    status: 'PARTIAL',
    notes: 'Installments every two weeks',
    createdAt: '2026-02-10',
  },
  {
    id: 'r-2002',
    contactId: 'c-1',
    title: 'Event ticket reimbursement',
    amount: 220,
    paidAmount: 220,
    dueDate: '2026-01-20',
    status: 'PAID',
    notes: 'Concert tickets',
    createdAt: '2026-01-05',
  },
  {
    id: 'r-2003',
    contactId: 'c-5',
    title: 'Short-term loan to friend',
    amount: 300,
    paidAmount: 0,
    dueDate: '2026-04-15',
    status: 'ACTIVE',
    notes: 'To be repaid after bonus',
    createdAt: '2026-03-05',
  },
];
