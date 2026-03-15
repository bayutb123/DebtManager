import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebtStore } from '../debts.store';
import { useContactStore } from '../../contacts/contacts.store';
import { DebtService } from '../debts.service';
import type { Debt } from '../../../types/common';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Table, THead, TBody, TH, TD } from '../../../components/ui/table';
import DebtForm from '../components/DebtForm';
import StatusBadge from '../../../components/shared/StatusBadge';
import LoadingState from '../../../components/shared/LoadingState';
import EmptyState from '../../../components/shared/EmptyState';
import { formatCurrency } from '../../../utils/format';

const DebtsPage = () => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);
  const { debts, fetchDebts } = useDebtStore();
  const { contacts, fetchContacts } = useContactStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'PARTIAL' | 'PAID' | 'OVERDUE'>('ALL');

  useEffect(() => {
    fetchContacts();
    fetchDebts();
  }, [fetchContacts, fetchDebts]);

  const { data: debtsData, isLoading } = useQuery<Debt[]>({
    queryKey: ['debts'],
    queryFn: () => DebtService.list(),
  });

  useEffect(() => {
    if (debtsData) {
      useDebtStore.setState({ debts: debtsData });
    }
  }, [debtsData]);

  const createMutation = useMutation({
    mutationFn: DebtService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: DebtService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  const sourceDebts: Debt[] = debtsData ?? debts ?? [];

  const filtered = useMemo(
    () =>
      sourceDebts.filter((d) => {
        const matchesStatus = status === 'ALL' || d.status === status;
        const matchesSearch =
          !search ||
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.notes?.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [sourceDebts, search, status],
  );

  if (isLoading) return <LoadingState label="Loading debts..." />;
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const firstInput = formRef.current?.querySelector('input[name="title"]') as HTMLInputElement | null;
        firstInput?.focus();
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Debts</h2>
          <p className="text-sm text-slate-500">Manage what you owe and keep payments on schedule.</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search by title or notes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card ref={formRef}>
          <CardHeader>
            <CardTitle>Add debt</CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <EmptyState
                title="No contacts yet"
                description="Add a contact first, then assign the debt."
                actionLabel="Go to contacts"
                onAction={() => {
                  window.location.href = '/contacts';
                }}
              />
            ) : (
              <DebtForm
                contacts={contacts}
                onSubmit={async (values) => {
                  await createMutation.mutateAsync({
                    ...values,
                    amount: Number(values.amount),
                    contactId: values.contactId,
                    dueDate: values.dueDate,
                    notes: values.notes,
                  });
                }}
              />
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>All debts</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState
                title="No debts yet"
                description="Create a debt to start tracking what you owe."
                actionLabel="Add debt"
                onAction={scrollToForm}
              />
            ) : (
              <Table>
                <THead>
                  <tr>
                    <TH>Title</TH>
                    <TH>Status</TH>
                    <TH>Due</TH>
                    <TH>Amount</TH>
                    <TH>Paid</TH>
                    <TH>Actions</TH>
                  </tr>
                </THead>
                <TBody>
                  {filtered.map((debt) => (
                    <tr key={debt.id} className="hover:bg-slate-50">
                      <TD>
                        <Link to={`/debts/${debt.id}`} className="font-semibold text-slate-900 hover:underline">
                          {debt.title}
                        </Link>
                        <p className="text-xs text-slate-500">{debt.notes}</p>
                      </TD>
                      <TD>
                        <StatusBadge status={debt.status} />
                      </TD>
                      <TD>{debt.dueDate}</TD>
                      <TD>{formatCurrency(debt.amount)}</TD>
                      <TD>{formatCurrency(debt.paidAmount)}</TD>
                      <TD className="space-x-2">
                        <Button variant="ghost" className="px-2 py-1 text-xs">
                          <Link to={`/debts/${debt.id}`}>View</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() => deleteMutation.mutate(debt.id)}
                        >
                          Delete
                        </Button>
                      </TD>
                    </tr>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebtsPage;
