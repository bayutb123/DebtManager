export type Status = 'ACTIVE' | 'PARTIAL' | 'PAID' | 'OVERDUE';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  notes?: string;
}

export interface Debt {
  id: string;
  contactId: string;
  title: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: Status;
  notes?: string;
  createdAt: string;
}

export interface Receivable extends Debt {}

export type TransactionType = 'DEBT' | 'RECEIVABLE';

export interface Payment {
  id: string;
  referenceId: string;
  type: TransactionType;
  amount: number;
  date: string;
  note?: string;
}
