export class ReviewDto {
  id!: string;
  productId!: string;
  userId!: string;
  rating!: number;
  title!: string;
  body!: string;
  verifiedPurchase!: boolean;
  status!: 'pending' | 'approved' | 'rejected';
  createdAt!: string;
  updatedAt!: string;
}
