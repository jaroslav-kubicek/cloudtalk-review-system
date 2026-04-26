import { redirect } from 'react-router';
import { clearSession } from '@/lib/auth';

export function logoutAction() {
  clearSession();
  return redirect('/products');
}
