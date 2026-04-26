import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  externalId: varchar('external_id', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  imageUrl: varchar('image_url', { length: 512 }).notNull(),
  category: varchar('category', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviewStatus = pgEnum('review_status', ['pending', 'approved', 'rejected']);

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    body: varchar('body', { length: 2000 }).notNull(),
    verifiedPurchase: boolean('verified_purchase').notNull().default(false),
    status: reviewStatus('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({
    oneReviewPerUserProduct: unique().on(t.productId, t.userId),
  }),
);

export const productRatingStats = pgTable('product_rating_stats', {
  productId: uuid('product_id')
    .primaryKey()
    .references(() => products.id, { onDelete: 'cascade' }),
  avgRating: numeric('avg_rating', { precision: 3, scale: 2 }).notNull().default('0'),
  reviewCount: integer('review_count').notNull().default(0),
  rating1Count: integer('rating_1_count').notNull().default(0),
  rating2Count: integer('rating_2_count').notNull().default(0),
  rating3Count: integer('rating_3_count').notNull().default(0),
  rating4Count: integer('rating_4_count').notNull().default(0),
  rating5Count: integer('rating_5_count').notNull().default(0),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
