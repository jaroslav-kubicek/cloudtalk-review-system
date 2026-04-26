import type { components } from '@reviews/api-client';

type Distribution = components['schemas']['RatingDistribution'];

interface RatingHistogramProps {
  distribution: Distribution;
  total: number;
}

const STARS = [5, 4, 3, 2, 1] as const;

export function RatingHistogram({ distribution, total }: RatingHistogramProps) {
  return (
    <div className="space-y-1.5">
      {STARS.map((stars) => {
        const count = distribution[stars];
        const pct = total === 0 ? 0 : (count / total) * 100;
        return (
          <div key={stars} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-sm text-muted-foreground tabular-nums">
              {stars} star
            </span>
            <div className="h-2 flex-1 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-sm text-muted-foreground tabular-nums">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
