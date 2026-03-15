import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useReceivableStore } from '../receivables.store';
import { useContactStore } from '../../contacts/contacts.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import StatusBadge from '../../../components/shared/StatusBadge';
import PaymentForm from '../../transactions/components/PaymentForm';
import { formatCurrency } from '../../../utils/format';
import { Button } from '../../../components/ui/button';
import LoadingState from '../../../components/shared/LoadingState';
import { ReceivableService } from '../receivables.service';
import { ReceivablesApi } from '../receivables.api';

const ReceivableDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { receivables, fetchReceivables } = useReceivableStore();
  const { contacts, fetchContacts } = useContactStore();

  useEffect(() => {
    fetchContacts();
    fetchReceivables();
  }, [fetchContacts, fetchReceivables]);

  const { data: receivableData, isLoading } = useQuery({
    queryKey: ['receivables', id],
    queryFn: () => ReceivablesApi.getById(id!),
  });

  const paymentMutation = useMutation({
    mutationFn: (values: { amount: number; date: string; note?: string }) =>
      ReceivableService.addPayment(id!, {
        id: `p-${Date.now()}`,
        referenceId: id!,
        type: 'RECEIVABLE',
        amount: Number(values.amount),
        date: values.date,
        note: values.note,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['receivables'] }),
  });

  const item = useMemo(() => receivableData ?? receivables.find((d) => d.id === id), [receivables, receivableData, id]);
  const contact = contacts.find((c) => c.id === item?.contactId);

  if (isLoading || !item) return <LoadingState label="Loading receivable..." />;

  const outstanding = item.amount - item.paidAmount;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        ← Back
      </Button>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.notes}</CardDescription>
              </div>
              <StatusBadge status={item.status} />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="card-subtitle">Contact</p>
              <p className="text-sm font-semibold text-slate-900">{contact?.name}</p>
              <p className="text-xs text-slate-500">{contact?.phone}</p>
            </div>
            <div>
              <p className="card-subtitle">Due</p>
              <p className="text-sm font-semibold text-slate-900">{item.dueDate}</p>
            </div>
            <div>
              <p className="card-subtitle">Amount</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.amount)}</p>
            </div>
            <div>
              <p className="card-subtitle">Paid</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.paidAmount)}</p>
            </div>
            <div>
              <p className="card-subtitle">Outstanding</p>
              <p className="text-sm font-semibold text-emerald-700">{formatCurrency(outstanding)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add payment</CardTitle>
            <CardDescription>Record money you received.</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentForm
              onSubmit={async (values) => {
                await paymentMutation.mutateAsync(values);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceivableDetailPage;
