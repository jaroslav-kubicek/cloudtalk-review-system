import { createCustomerClient } from '@reviews/api-client';
import { getToken } from '@/lib/auth';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const api = createCustomerClient({
  baseUrl,
  getToken,
});
