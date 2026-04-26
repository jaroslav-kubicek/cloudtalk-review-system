import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StarPicker } from '@/components/StarPicker';
import type { ProductDetailActionData } from '@/routes/product-detail';

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WriteReviewDialog({ open, onOpenChange }: WriteReviewDialogProps) {
  const fetcher = useFetcher<ProductDetailActionData>();
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!open) setRating(0);
  }, [open]);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      onOpenChange(false);
    }
  }, [fetcher.state, fetcher.data, onOpenChange]);

  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  const submitting = fetcher.state !== 'idle';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Reviews go through moderation before appearing publicly.
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="rating" value={rating} />
          <div className="space-y-2">
            <Label>Rating</Label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea id="body" name="body" required maxLength={2000} rows={5} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={submitting || rating < 1}>
              {submitting ? 'Submitting…' : 'Submit'}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
