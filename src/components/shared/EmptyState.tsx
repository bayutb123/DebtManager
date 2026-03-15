import type { ReactNode } from 'react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

const EmptyState = ({ title, description, actionLabel, onAction, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-white/70 p-6 text-center">
    <div className="text-slate-400">{icon}</div>
    <p className="text-base font-semibold text-slate-900">{title}</p>
    <p className="text-sm text-slate-500">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
