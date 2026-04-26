import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { DrizzleTx } from '../db/client';

@Injectable()
export class AggregatesService {
  async recompute(tx: DrizzleTx, productId: string): Promise<void> {
    await tx.execute(sql`
      INSERT INTO product_rating_stats (
        product_id, avg_rating, review_count,
        rating_1_count, rating_2_count, rating_3_count, rating_4_count, rating_5_count, updated_at
      )
      SELECT
        ${productId}::uuid,
        COALESCE(AVG(rating)::numeric(3,2), 0),
        COUNT(*),
        COUNT(*) FILTER (WHERE rating = 1),
        COUNT(*) FILTER (WHERE rating = 2),
        COUNT(*) FILTER (WHERE rating = 3),
        COUNT(*) FILTER (WHERE rating = 4),
        COUNT(*) FILTER (WHERE rating = 5),
        NOW()
      FROM reviews
      WHERE product_id = ${productId}::uuid AND status = 'approved'
      ON CONFLICT (product_id) DO UPDATE SET
        avg_rating     = EXCLUDED.avg_rating,
        review_count   = EXCLUDED.review_count,
        rating_1_count = EXCLUDED.rating_1_count,
        rating_2_count = EXCLUDED.rating_2_count,
        rating_3_count = EXCLUDED.rating_3_count,
        rating_4_count = EXCLUDED.rating_4_count,
        rating_5_count = EXCLUDED.rating_5_count,
        updated_at     = EXCLUDED.updated_at
    `);
  }
}
