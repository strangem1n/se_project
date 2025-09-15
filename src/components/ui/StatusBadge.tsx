import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, variant = 'default', size = 'md' }: StatusBadgeProps) {
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium',
      variantClasses[variant],
      sizeClasses[size]
    )}>
      {status}
    </span>
  );
}
