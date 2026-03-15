import { Badge } from '../ui/badge';

interface StatusBadgeProps {
  status: 'ACTIVE' | 'PARTIAL' | 'PAID' | 'OVERDUE' | string;
}

const statusVariantMap: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  ACTIVE: 'info',
  PARTIAL: 'warning',
  PAID: 'success',
  OVERDUE: 'danger',
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variant = statusVariantMap[status] ?? 'default';
  return <Badge variant={variant}>{status}</Badge>;
};

export default StatusBadge;
