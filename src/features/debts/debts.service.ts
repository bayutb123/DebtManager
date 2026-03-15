import type { Payment } from '../../types/common';
import { DebtsApi } from './debts.api';
import type { DebtFilters } from './debts.types';

export const DebtService = {
  list: async (filters?: DebtFilters) => {
    const data = await DebtsApi.list();
    if (!filters) return data;
    const { status, search } = filters;
    return data.filter((d) => {
      const matchesStatus = !status || status === 'ALL' || d.status === status;
      const matchesSearch =
        !search ||
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.notes?.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  },
  getById: DebtsApi.getById,
  create: DebtsApi.create,
  update: DebtsApi.update,
  remove: DebtsApi.remove,
  addPayment: (id: string, payment: Payment) => DebtsApi.addPayment(id, payment),
};
