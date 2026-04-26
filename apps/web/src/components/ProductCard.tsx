import type { ProductListItemDto } from '@reviews/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stars } from '@/components/Stars';

interface ProductCardProps {
  product: ProductListItemDto;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full transition-colors hover:border-primary/40">
      <CardHeader className="flex flex-row items-start gap-4">
        <img
          src={product.imageUrl}
          alt=""
          className="h-16 w-16 shrink-0 rounded-md bg-muted p-2"
          loading="lazy"
        />
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base leading-tight">{product.name}</CardTitle>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Stars value={product.avgRating} count={product.reviewCount} />
      </CardContent>
    </Card>
  );
}
