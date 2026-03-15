import { forwardRef, useMemo } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number | undefined;
  onChange: (value: number) => void;
}

const formatDisplay = (value: number | undefined) =>
  value !== undefined && !Number.isNaN(value)
    ? `Rp ${value.toLocaleString('id-ID')}`
    : '';

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const displayValue = useMemo(() => formatDisplay(value), [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const numeric = Number(e.target.value.replace(/[^0-9]/g, ''));
      onChange(Number.isNaN(numeric) ? 0 : numeric);
    };

    return (
      <input
        ref={ref}
        inputMode="numeric"
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/60 focus-visible:border-slate-900',
          'placeholder:text-slate-400',
          className,
        )}
        value={displayValue}
        onChange={handleChange}
        placeholder="Rp 0"
        {...props}
      />
    );
  },
);

CurrencyInput.displayName = 'CurrencyInput';
