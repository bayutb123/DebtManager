import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../../components/ui/input';
import { TextArea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { CurrencyInput } from '../../../components/ui/currency-input';

const schema = z.object({
  amount: z.coerce.number().positive(),
  date: z.string().min(4),
  note: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<PaymentFormValues>;
  onSubmit: (values: PaymentFormValues) => Promise<void> | void;
  loading?: boolean;
}

const PaymentForm = ({ defaultValues, onSubmit, loading }: Props) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      note: '',
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({ ...values, note: '' });
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Amount</label>
        <Controller
          control={form.control}
          name="amount"
          render={({ field }) => (
            <CurrencyInput value={field.value} onChange={(val) => field.onChange(val)} aria-label="Amount" />
          )}
        />
        {form.formState.errors.amount && (
          <p className="text-xs text-rose-600">{form.formState.errors.amount.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Date</label>
        <Input type="date" {...form.register('date')} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Note</label>
        <TextArea rows={3} {...form.register('note')} placeholder="Optional note" />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        Add payment
      </Button>
    </form>
  );
};

export default PaymentForm;
