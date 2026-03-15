import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export const Table = ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto">
    <table
      className={cn(
        'min-w-full divide-y divide-slate-200 text-sm text-left bg-white/70 rounded-xl overflow-hidden',
        className,
      )}
      {...props}
    />
  </div>
);

export const THead = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className="bg-slate-50" {...props} />
);

export const TBody = (props: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y divide-slate-100" {...props} />
);

export const TH = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600', className)} {...props} />
);

export const TD = ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-3 text-sm text-slate-800', className)} {...props} />
);
