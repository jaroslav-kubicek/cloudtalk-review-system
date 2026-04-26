import { ApiProperty } from '@nestjs/swagger';

export const REVIEW_STATUSES = ['pending', 'approved', 'rejected'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export class ReviewDto {
  id!: string;
  productId!: string;
  userId!: string;
  rating!: number;
  title!: string;
  body!: string;
  verifiedPurchase!: boolean;

  @ApiProperty({ enum: REVIEW_STATUSES, enumName: 'ReviewStatus' })
  status!: ReviewStatus;

  createdAt!: string;
  updatedAt!: string;
}
