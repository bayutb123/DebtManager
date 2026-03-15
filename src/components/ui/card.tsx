import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('glass-panel p-4 md:p-5', className)} {...props}>
    {children}
  </div>
));

export const CardHeader = ({ className, children, ...props }: CardProps) => (
  <div className={cn('flex items-start justify-between gap-3', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: CardProps) => (
  <h3 className={cn('card-title', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: CardProps) => (
  <p className={cn('card-subtitle', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: CardProps) => (
  <div className={cn('mt-4', className)} {...props}>
    {children}
  </div>
);
