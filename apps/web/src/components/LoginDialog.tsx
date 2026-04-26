import { useEffect } from 'react';
import { useFetcher, useSearchParams } from 'react-router';
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
import type { LoginActionData } from '@/routes/login';

export function LoginDialog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get('login') === '1';
  const fetcher = useFetcher<LoginActionData>();

  const close = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('login');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data?.ok) {
      close();
    }
  }, [fetcher.state, fetcher.data, searchParams, setSearchParams]);

  const error = fetcher.data && !fetcher.data.ok ? fetcher.data.error : null;
  const submitting = fetcher.state !== 'idle';

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Log in</DialogTitle>
          <DialogDescription>
            Use a seeded customer account (e.g. alice@example.com / password123).
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post" action="/login" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="alice@example.com"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
