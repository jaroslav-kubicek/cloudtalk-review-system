import { Outlet, useLoaderData } from 'react-router';
import { Header } from '@/components/Header';
import { LoginDialog } from '@/components/LoginDialog';
import { getEmail } from '@/lib/auth';

export function rootLoader() {
  const email = getEmail();
  return { user: email ? { email } : null };
}

export function RootLayout() {
  const { user } = useLoaderData<typeof rootLoader>();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header user={user} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
      <LoginDialog />
    </div>
  );
}
