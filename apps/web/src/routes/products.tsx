import { Link, useLoaderData } from 'react-router';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/ProductCard';

export async function productsLoader() {
  const { data, error } = await api.GET('/products');
  if (error || !data) {
    throw new Response('Failed to load products', { status: 500 });
  }
  return { products: data };
}

export function ProductsList() {
  const { products } = useLoaderData<typeof productsLoader>();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`} className="block">
              <ProductCard product={p} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
