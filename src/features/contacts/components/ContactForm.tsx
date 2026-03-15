import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { TextArea } from '../../../components/ui/textarea';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(6, 'Phone is required'),
  notes: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: ContactFormValues;
  onSubmit: (values: ContactFormValues) => Promise<void> | void;
  submitLabel?: string;
  loading?: boolean;
}

const ContactForm = ({ defaultValues, onSubmit, submitLabel = 'Save', loading }: Props) => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { name: '', phone: '', notes: '' },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset();
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Name</label>
        <Input {...form.register('name')} placeholder="Alex Martin" />
        {form.formState.errors.name && (
          <p className="text-xs text-rose-600">{form.formState.errors.name.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Phone</label>
        <Input {...form.register('phone')} placeholder="+1 415-555-1010" />
        {form.formState.errors.phone && (
          <p className="text-xs text-rose-600">{form.formState.errors.phone.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Notes</label>
        <TextArea rows={3} {...form.register('notes')} placeholder="Context about this contact" />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
};

export default ContactForm;
