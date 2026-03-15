import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebtStore } from '../debts.store';
import { useContactStore } from '../../contacts/contacts.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import PaymentForm from '../../transactions/components/PaymentForm';
import StatusBadge from '../../../components/shared/StatusBadge';
import LoadingState from '../../../components/shared/LoadingState';
import { formatCurrency } from '../../../utils/format';
import { Button } from '../../../components/ui/button';
import { DebtService } from '../debts.service';
import { DebtsApi } from '../debts.api';

const DebtDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { debts, fetchDebts } = useDebtStore();
  const { contacts, fetchContacts } = useContactStore();

  useEffect(() => {
    fetchContacts();
    fetchDebts();
  }, [fetchContacts, fetchDebts]);

  const { data: debtData, isLoading } = useQuery({
    queryKey: ['debts', id],
    queryFn: () => DebtsApi.getById(id!),
  });

  const paymentMutation = useMutation({
    mutationFn: (values: { amount: number; date: string; note?: string }) =>
      DebtService.addPayment(id!, {
        id: `p-${Date.now()}`,
        referenceId: id!,
        type: 'DEBT',
        amount: Number(values.amount),
        date: values.date,
        note: values.note,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });

  const debt = useMemo(() => debtData ?? debts.find((d) => d.id === id), [debts, debtData, id]);
  const contact = contacts.find((c) => c.id === debt?.contactId);

  if (isLoading || !debt) return <LoadingState label="Loading debt..." />;

  const outstanding = debt.amount - debt.paidAmount;

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
                <CardTitle className="text-lg">{debt.title}</CardTitle>
                <CardDescription>{debt.notes}</CardDescription>
              </div>
              <StatusBadge status={debt.status} />
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
              <p className="text-sm font-semibold text-slate-900">{debt.dueDate}</p>
            </div>
            <div>
              <p className="card-subtitle">Amount</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(debt.amount)}</p>
            </div>
            <div>
              <p className="card-subtitle">Paid</p>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(debt.paidAmount)}</p>
            </div>
            <div>
              <p className="card-subtitle">Outstanding</p>
              <p className="text-sm font-semibold text-amber-700">{formatCurrency(outstanding)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add payment</CardTitle>
            <CardDescription>Reduce the outstanding balance.</CardDescription>
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

export default DebtDetailPage;
