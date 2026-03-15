import { Button } from '../ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = 'Something went wrong.', onRetry }: ErrorStateProps) => (
  <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
    <span>{message}</span>
    {onRetry && (
      <Button variant="danger" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);

export default ErrorState;
