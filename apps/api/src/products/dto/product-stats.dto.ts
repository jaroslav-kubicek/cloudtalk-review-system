export class RatingDistribution {
  '1'!: number;
  '2'!: number;
  '3'!: number;
  '4'!: number;
  '5'!: number;
}

export class ProductStatsDto {
  productId!: string;
  avgRating!: number;
  reviewCount!: number;
  distribution!: RatingDistribution;
}
