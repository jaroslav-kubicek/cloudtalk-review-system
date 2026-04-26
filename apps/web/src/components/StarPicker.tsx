import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarPickerProps {
  value: number;
  onChange: (value: number) => void;
}

const STARS = [1, 2, 3, 4, 5] as const;

export function StarPicker({ value, onChange }: StarPickerProps) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div role="radiogroup" aria-label="Rating" className="flex items-center gap-1">
      {STARS.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="rounded-sm p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(n)}
        >
          <Star
            className={cn(
              'h-7 w-7 transition-colors',
              n <= display
                ? 'fill-yellow-400 stroke-yellow-400'
                : 'stroke-muted-foreground/40',
            )}
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  );
}
