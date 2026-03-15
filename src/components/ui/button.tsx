import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', loading = false, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:outline-slate-300',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-200',
      outline:
        'border border-slate-300 text-slate-900 bg-white hover:bg-slate-50 focus-visible:outline-slate-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
