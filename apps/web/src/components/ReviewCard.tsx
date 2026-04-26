import type { ReviewDto, ReviewStatus } from '@reviews/api-client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Stars } from '@/components/Stars';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: ReviewDto;
  showStatus?: boolean;
}

const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export function ReviewCard({ review, showStatus = false }: ReviewCardProps) {
  const date = new Date(review.createdAt).toLocaleDateString();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Stars value={review.rating} />
              <span className="font-medium">{review.title}</span>
            </div>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>
          {showStatus && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                STATUS_STYLES[review.status],
              )}
            >
              {review.status}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line">{review.body}</p>
      </CardContent>
    </Card>
  );
}
