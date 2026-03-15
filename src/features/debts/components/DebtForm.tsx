import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../../components/ui/input';
import { TextArea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Select } from '../../../components/ui/select';
import type { Contact } from '../../../types/common';
import { CurrencyInput } from '../../../components/ui/currency-input';

const schema = z.object({
  title: z.string().min(2),
  amount: z.coerce.number().positive(),
  dueDate: z.string().min(4),
  contactId: z.string().min(1),
  notes: z.string().optional(),
});

export type DebtFormValues = z.infer<typeof schema>;

interface Props {
  contacts: Contact[];
  defaultValues?: Partial<DebtFormValues>;
  onSubmit: (values: DebtFormValues) => Promise<void> | void;
  loading?: boolean;
  submitLabel?: string;
}

const DebtForm = ({ contacts, defaultValues, onSubmit, loading, submitLabel = 'Save debt' }: Props) => {
  const form = useForm<DebtFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: '',
      amount: 0,
      dueDate: new Date().toISOString().slice(0, 10),
      contactId: contacts[0]?.id ?? '',
      notes: '',
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset();
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Title</label>
        <Input {...form.register('title')} placeholder="Car repair loan" />
        {form.formState.errors.title && (
          <p className="text-xs text-rose-600">{form.formState.errors.title.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Amount</label>
          <Controller
            control={form.control}
            name="amount"
            render={({ field }) => (
              <CurrencyInput
                value={field.value}
                onChange={(val) => field.onChange(val)}
                aria-label="Amount"
              />
            )}
          />
          {form.formState.errors.amount && (
            <p className="text-xs text-rose-600">{form.formState.errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Due date</label>
          <Input type="date" {...form.register('dueDate')} />
          {form.formState.errors.dueDate && (
            <p className="text-xs text-rose-600">{form.formState.errors.dueDate.message}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Contact</label>
        <Select {...form.register('contactId')}>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Notes</label>
        <TextArea rows={3} {...form.register('notes')} placeholder="Add a note" />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
};

export default DebtForm;
