import createClient, { type Client, type Middleware } from 'openapi-fetch';
import type { paths, components } from './generated/openapi.js';

export type ApiSchemas = components['schemas'];
export type ReviewDto = ApiSchemas['ReviewDto'];
export type ReviewStatus = ApiSchemas['ReviewStatus'];
export type ProductListItemDto = ApiSchemas['ProductListItemDto'];
export type ProductDetailDto = ApiSchemas['ProductDetailDto'];
export type ProductStatsDto = ApiSchemas['ProductStatsDto'];
export type LoginDto = ApiSchemas['LoginDto'];
export type LoginResponseDto = ApiSchemas['LoginResponseDto'];
export type CreateReviewDto = ApiSchemas['CreateReviewDto'];

export type { paths, components } from './generated/openapi.js';

export interface CustomerClientOptions {
  baseUrl: string;
  getToken?: () => string | null | undefined;
}

export type CustomerClient = Client<paths>;

export function createCustomerClient(options: CustomerClientOptions): CustomerClient {
  const client = createClient<paths>({ baseUrl: options.baseUrl });

  if (options.getToken) {
    const auth: Middleware = {
      onRequest({ request }) {
        const token = options.getToken?.();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
        return request;
      },
    };
    client.use(auth);
  }

  return client;
}
