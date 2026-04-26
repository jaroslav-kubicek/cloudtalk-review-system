import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarsProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function Stars({ value, count, size = 'sm', className }: StarsProps) {
  const filled = Math.round(value);
  const sizeClass = size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center" aria-label={`${value.toFixed(1)} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClass,
              i < filled
                ? 'fill-yellow-400 stroke-yellow-400'
                : 'stroke-muted-foreground/40',
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {value.toFixed(1)}
        {count !== undefined && ` (${count})`}
      </span>
    </div>
  );
}
