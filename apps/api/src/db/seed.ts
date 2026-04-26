import 'dotenv/config';
import bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { createDbClient } from './client';
import { productRatingStats, products, users } from './schema';

const SEED_PRODUCTS = [
  {
    externalId: 'cpu-ryzen-7-7800x3d',
    name: 'AMD Ryzen 7 7800X3D',
    description:
      '8-core, 16-thread desktop CPU with 3D V-Cache. Designed for high-end gaming and productivity workloads on the AM5 platform.',
    imageUrl: 'https://api.iconify.design/mdi/cpu-64-bit.svg',
    category: 'cpu',
  },
  {
    externalId: 'cpu-intel-i7-14700k',
    name: 'Intel Core i7-14700K',
    description:
      '20-core (8P + 12E) hybrid desktop CPU with a 5.6 GHz boost. Drop-in upgrade for LGA1700 boards.',
    imageUrl: 'https://api.iconify.design/mdi/cpu-64-bit.svg',
    category: 'cpu',
  },
  {
    externalId: 'laptop-thinkpad-x1-carbon-g12',
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    description:
      '14" business ultrabook with Intel Core Ultra, 32 GB LPDDR5x, and a magnesium chassis under 1.1 kg.',
    imageUrl: 'https://api.iconify.design/mdi/laptop.svg',
    category: 'laptop',
  },
  {
    externalId: 'laptop-macbook-pro-14-m4',
    name: 'Apple MacBook Pro 14" M4',
    description:
      '14.2" Liquid Retina XDR laptop with Apple M4 silicon, up to 22-hour battery life, and three Thunderbolt 4 ports.',
    imageUrl: 'https://api.iconify.design/mdi/laptop.svg',
    category: 'laptop',
  },
  {
    externalId: 'keyboard-keychron-q1-pro',
    name: 'Keychron Q1 Pro',
    description:
      '75% wireless mechanical keyboard with a CNC aluminium body, hot-swap PCB, and full QMK/VIA support.',
    imageUrl: 'https://api.iconify.design/mdi/keyboard.svg',
    category: 'keyboard',
  },
  {
    externalId: 'mouse-logitech-mx-master-3s',
    name: 'Logitech MX Master 3s',
    description:
      'Ergonomic wireless productivity mouse with an 8K DPI optical sensor and silent click switches.',
    imageUrl: 'https://api.iconify.design/mdi/mouse.svg',
    category: 'mouse',
  },
  {
    externalId: 'monitor-dell-u2725qe',
    name: 'Dell UltraSharp U2725QE',
    description:
      '27" 4K IPS Black panel with Thunderbolt 4 hub, KVM, and 120 Hz refresh — built for desk-side single-cable docking.',
    imageUrl: 'https://api.iconify.design/mdi/monitor.svg',
    category: 'monitor',
  },
  {
    externalId: 'monitor-lg-27gp950',
    name: 'LG UltraGear 27GP950-B',
    description:
      '27" 4K Nano IPS gaming monitor at 144 Hz with G-Sync and FreeSync Premium Pro support.',
    imageUrl: 'https://api.iconify.design/mdi/monitor.svg',
    category: 'monitor',
  },
  {
    externalId: 'headphones-sony-wh-1000xm5',
    name: 'Sony WH-1000XM5',
    description:
      'Over-ear active-noise-cancelling headphones with 30-hour battery and multipoint Bluetooth.',
    imageUrl: 'https://api.iconify.design/mdi/headphones.svg',
    category: 'headphones',
  },
  {
    externalId: 'tablet-ipad-air-m2',
    name: 'Apple iPad Air 13" M2',
    description:
      '13" Liquid Retina tablet with Apple M2, Apple Pencil Pro support, and a Magic Keyboard accessory ecosystem.',
    imageUrl: 'https://api.iconify.design/mdi/tablet.svg',
    category: 'tablet',
  },
];

const SEED_CUSTOMERS = [
  { email: 'alice@example.com', password: 'password123' },
  { email: 'bob@example.com', password: 'password123' },
  { email: 'carol@example.com', password: 'password123' },
];

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required');

  const db = createDbClient(url);

  await db.transaction(async (tx) => {
    await tx.execute(sql`TRUNCATE TABLE reviews, product_rating_stats, products, users RESTART IDENTITY CASCADE`);

    const insertedProducts = await tx.insert(products).values(SEED_PRODUCTS).returning({ id: products.id });

    await tx.insert(productRatingStats).values(
      insertedProducts.map((p) => ({ productId: p.id })),
    );

    const hashed = await Promise.all(
      SEED_CUSTOMERS.map(async (c) => ({
        email: c.email,
        passwordHash: await bcrypt.hash(c.password, 10),
      })),
    );
    await tx.insert(users).values(hashed);
  });

  console.log(`Seeded ${SEED_PRODUCTS.length} products and ${SEED_CUSTOMERS.length} customers.`);
  console.log('Customer logins (all use password "password123"):');
  for (const c of SEED_CUSTOMERS) console.log(`  - ${c.email}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
