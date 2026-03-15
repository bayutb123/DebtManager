import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReceivableStore } from '../receivables.store';
import { useContactStore } from '../../contacts/contacts.store';
import { ReceivableService } from '../receivables.service';
import type { Receivable } from '../../../types/common';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Table, THead, TBody, TH, TD } from '../../../components/ui/table';
import ReceivableForm from '../components/ReceivableForm';
import StatusBadge from '../../../components/shared/StatusBadge';
import LoadingState from '../../../components/shared/LoadingState';
import EmptyState from '../../../components/shared/EmptyState';
import { formatCurrency } from '../../../utils/format';

const ReceivablesPage = () => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);
  const { receivables, fetchReceivables } = useReceivableStore();
  const { contacts, fetchContacts } = useContactStore();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'PARTIAL' | 'PAID' | 'OVERDUE'>('ALL');

  useEffect(() => {
    fetchContacts();
    fetchReceivables();
  }, [fetchContacts, fetchReceivables]);

  const { data: receivableData, isLoading } = useQuery<Receivable[]>({
    queryKey: ['receivables'],
    queryFn: () => ReceivableService.list(),
  });

  useEffect(() => {
    if (receivableData) {
      useReceivableStore.setState({ receivables: receivableData });
    }
  }, [receivableData]);

  const createMutation = useMutation({
    mutationFn: ReceivableService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['receivables'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: ReceivableService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['receivables'] }),
  });

  const sourceReceivables: Receivable[] = receivableData ?? receivables ?? [];

  const filtered = useMemo(
    () =>
      sourceReceivables.filter((d) => {
        const matchesStatus = status === 'ALL' || d.status === status;
        const matchesSearch =
          !search ||
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.notes?.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [sourceReceivables, search, status],
  );

  if (isLoading) return <LoadingState label="Loading receivables..." />;

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const firstInput = formRef.current?.querySelector('input[name=\"title\"]') as HTMLInputElement | null;
        firstInput?.focus();
      }, 300);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Receivables</h2>
          <p className="text-sm text-slate-500">Track what others owe you and request payments.</p>
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
            <CardTitle>Add receivable</CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <EmptyState
                title="No contacts yet"
                description="Add a contact first, then assign the receivable."
                actionLabel="Go to contacts"
                onAction={() => {
                  window.location.href = '/contacts';
                }}
              />
            ) : (
              <ReceivableForm
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
            <CardTitle>All receivables</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState
                title="No receivables yet"
                description="Create one to start tracking incoming payments."
                actionLabel="Add receivable"
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
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <TD>
                        <Link to={`/receivables/${item.id}`} className="font-semibold text-slate-900 hover:underline">
                          {item.title}
                        </Link>
                        <p className="text-xs text-slate-500">{item.notes}</p>
                      </TD>
                      <TD>
                        <StatusBadge status={item.status} />
                      </TD>
                      <TD>{item.dueDate}</TD>
                      <TD>{formatCurrency(item.amount)}</TD>
                      <TD>{formatCurrency(item.paidAmount)}</TD>
                      <TD className="space-x-2">
                        <Button variant="ghost" className="px-2 py-1 text-xs">
                          <Link to={`/receivables/${item.id}`}>View</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          onClick={() => deleteMutation.mutate(item.id)}
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

export default ReceivablesPage;
