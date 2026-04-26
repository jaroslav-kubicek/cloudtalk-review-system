import { createBrowserRouter } from 'react-router';
import { Button } from '@/components/ui/button';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <h1 className="text-3xl font-semibold tracking-tight">CT Reviews</h1>
        <p className="text-muted-foreground">scaffold</p>
        <Button>placeholder</Button>
      </div>
    ),
  },
]);
