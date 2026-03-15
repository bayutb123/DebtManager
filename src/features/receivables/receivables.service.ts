import type { Payment } from '../../types/common';
import { ReceivablesApi } from './receivables.api';
import type { ReceivableFilters } from './receivables.types';

export const ReceivableService = {
  list: (filters?: ReceivableFilters) =>
    ReceivablesApi.list().then((data) => {
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
    }),
  getById: ReceivablesApi.getById,
  create: ReceivablesApi.create,
  update: ReceivablesApi.update,
  remove: ReceivablesApi.remove,
  addPayment: (id: string, payment: Payment) => ReceivablesApi.addPayment(id, payment),
};
