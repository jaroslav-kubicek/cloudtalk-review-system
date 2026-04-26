import { Link, useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Stars } from '@/components/Stars';
import { ReviewCard } from '@/components/ReviewCard';
import { RatingHistogram } from '@/components/RatingHistogram';
import { Button } from '@/components/ui/button';

export async function productDetailLoader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) throw new Response('Missing product id', { status: 400 });

  const authed = getToken() !== null;

  const [detail, stats, reviews, own] = await Promise.all([
    api.GET('/products/{id}', { params: { path: { id } } }),
    api.GET('/products/{id}/stats', { params: { path: { id } } }),
    api.GET('/products/{productId}/reviews', {
      params: { path: { productId: id } },
    }),
    authed
      ? api.GET('/products/{productId}/reviews', {
          params: { path: { productId: id }, query: { author: 'me' } },
        })
      : null,
  ]);

  if (detail.error || !detail.data) throw new Response('Not found', { status: 404 });
  if (stats.error || !stats.data) throw new Response('Stats failed', { status: 500 });
  if (reviews.error || !reviews.data) {
    throw new Response('Reviews failed', { status: 500 });
  }

  const ownReview = own && !own.error && own.data && own.data.length > 0 ? own.data[0]! : null;

  return {
    authed,
    product: detail.data,
    stats: stats.data,
    reviews: reviews.data,
    ownReview,
  };
}

export function ProductDetail() {
  const { authed, product, stats, reviews, ownReview } = useLoaderData<typeof productDetailLoader>();

  const publicFeed = ownReview
    ? reviews.filter((r) => r.id !== ownReview.id)
    : reviews;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 md:flex-row">
        <img
          src={product.imageUrl}
          alt=""
          className="h-32 w-32 shrink-0 rounded-md bg-muted p-4"
        />
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <Stars value={stats.avgRating} count={stats.reviewCount} size="md" />
          <p className="text-sm text-muted-foreground max-w-2xl">{product.description}</p>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Rating breakdown</h2>
        <RatingHistogram distribution={stats.distribution} total={stats.reviewCount} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Reviews</h2>
          {!authed && (
            <Button asChild variant="outline" size="sm">
              <Link to="?login=1">Log in to write a review</Link>
            </Button>
          )}
        </div>

        {ownReview && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Your review</p>
            <ReviewCard review={ownReview} showStatus />
          </div>
        )}

        {publicFeed.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {ownReview ? 'No other reviews yet.' : 'No reviews yet.'}
          </p>
        ) : (
          <div className="space-y-3">
            {publicFeed.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
