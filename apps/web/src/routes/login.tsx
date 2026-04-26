import type { ActionFunctionArgs } from 'react-router';
import { api } from '@/lib/api';
import { setSession } from '@/lib/auth';

export type LoginActionData = { ok: true } | { ok: false; error: string };

export async function loginAction({ request }: ActionFunctionArgs): Promise<LoginActionData> {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  const { data, error } = await api.POST('/auth/login', {
    body: { email, password },
  });

  if (error || !data) {
    return { ok: false, error: 'Invalid email or password.' };
  }

  setSession(data.accessToken, email);
  return { ok: true };
}
