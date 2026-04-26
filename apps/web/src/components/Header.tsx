import { Form, Link } from 'react-router';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: { email: string } | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/products" className="text-lg font-semibold tracking-tight">
          CT Reviews
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Form method="post" action="/logout">
                <Button type="submit" variant="ghost" size="sm">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Log out
                </Button>
              </Form>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="?login=1">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
