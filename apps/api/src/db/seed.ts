import 'dotenv/config';
import bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { createDbClient } from './client';
import { products, reviews, users } from './schema';

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

type SeedReview = {
  productExternalId: string;
  email: string;
  rating: number;
  title: string;
  body: string;
};

const SEED_REVIEWS: SeedReview[] = [
  {
    productExternalId: 'cpu-ryzen-7-7800x3d',
    email: 'alice@example.com',
    rating: 5,
    title: 'Gaming flagship that just works',
    body: 'Dropped it into my AM5 board, enabled EXPO, and saw a clean 20–30% uplift in frametimes vs. my old 5800X. Runs cool under the U12A.',
  },
  {
    productExternalId: 'cpu-ryzen-7-7800x3d',
    email: 'bob@example.com',
    rating: 4,
    title: 'Great gaming, mediocre productivity',
    body: 'For pure gaming it is incredible. For Blender and code compiles I miss the extra cores of a 7950X — pick it for what it is.',
  },
  {
    productExternalId: 'cpu-ryzen-7-7800x3d',
    email: 'carol@example.com',
    rating: 5,
    title: 'Quietest gaming build I have ever owned',
    body: 'The 3D V-Cache makes this thing sip power for the framerate it pushes. Fans barely spin up during long sessions.',
  },
  {
    productExternalId: 'cpu-intel-i7-14700k',
    email: 'alice@example.com',
    rating: 4,
    title: 'Solid LGA1700 send-off',
    body: 'Plenty of multi-thread headroom from the extra E-cores. Power draw is what you expect — make sure your cooler can handle 250W+.',
  },
  {
    productExternalId: 'cpu-intel-i7-14700k',
    email: 'bob@example.com',
    rating: 3,
    title: 'Good chip, hot platform',
    body: 'Performance is there, but I had to undervolt to keep temps reasonable. AM5 feels like the better long-term bet now.',
  },
  {
    productExternalId: 'laptop-thinkpad-x1-carbon-g12',
    email: 'alice@example.com',
    rating: 5,
    title: 'My favourite work laptop in years',
    body: 'Keyboard is still the best in the class, the chassis is genuinely under 1.1 kg, and battery life finally lasts a full meeting day.',
  },
  {
    productExternalId: 'laptop-macbook-pro-14-m4',
    email: 'alice@example.com',
    rating: 5,
    title: 'Silent, fast, all-day battery',
    body: 'M4 handles my Xcode + Docker workload without ever spinning the fans. Display is gorgeous, speakers are surprisingly good.',
  },
  {
    productExternalId: 'laptop-macbook-pro-14-m4',
    email: 'bob@example.com',
    rating: 5,
    title: 'Replaced my desktop with this',
    body: 'Plug in a single Thunderbolt cable at the desk and I am running two 4K monitors plus charging. No regrets after three months.',
  },
  {
    productExternalId: 'laptop-macbook-pro-14-m4',
    email: 'carol@example.com',
    rating: 4,
    title: 'Excellent — but pricey base RAM',
    body: 'Performance and build quality are top tier. I wish the base config came with more than 16 GB given how long people keep these.',
  },
  {
    productExternalId: 'keyboard-keychron-q1-pro',
    email: 'alice@example.com',
    rating: 5,
    title: 'Endgame for most people',
    body: 'CNC aluminium feels like a desk anchor, hot-swap means I can change switches on a whim, and QMK/VIA are first-class.',
  },
  {
    productExternalId: 'keyboard-keychron-q1-pro',
    email: 'bob@example.com',
    rating: 4,
    title: 'Wonderful typing, heavy as a brick',
    body: 'It is genuinely fantastic to type on, but if you commute with your keyboard the weight will get old fast.',
  },
  {
    productExternalId: 'mouse-logitech-mx-master-3s',
    email: 'alice@example.com',
    rating: 5,
    title: 'The productivity standard',
    body: 'Silent clicks are a revelation in a shared office and the magnetic scroll wheel still has no peer. Easy daily driver.',
  },
  {
    productExternalId: 'mouse-logitech-mx-master-3s',
    email: 'bob@example.com',
    rating: 5,
    title: 'Replaced three other mice with this one',
    body: 'Pairs to three machines, switches with a button, and the side scroll wheel is genuinely useful in spreadsheets.',
  },
  {
    productExternalId: 'mouse-logitech-mx-master-3s',
    email: 'carol@example.com',
    rating: 5,
    title: 'Comfortable for long sessions',
    body: 'My wrist used to complain after long days — this shape solved it. Battery lasts weeks between charges.',
  },
  {
    productExternalId: 'monitor-dell-u2725qe',
    email: 'bob@example.com',
    rating: 4,
    title: 'Single-cable docking finally works',
    body: 'Thunderbolt 4 + KVM + 120 Hz at 4K is the combo I have been waiting on from Dell. IPS Black blacks are a real upgrade.',
  },
  {
    productExternalId: 'monitor-lg-27gp950',
    email: 'alice@example.com',
    rating: 3,
    title: 'Great panel, fiddly firmware',
    body: 'The image is gorgeous when it works, but I have hit handshake issues over DisplayPort that needed a firmware update to resolve.',
  },
  {
    productExternalId: 'monitor-lg-27gp950',
    email: 'carol@example.com',
    rating: 4,
    title: 'Excellent for fast-paced games',
    body: '144 Hz at native 4K with G-Sync is a treat. HDR is just okay — buy it for the response time, not the HDR sticker.',
  },
  {
    productExternalId: 'headphones-sony-wh-1000xm5',
    email: 'alice@example.com',
    rating: 5,
    title: 'Best ANC I have ever worn',
    body: 'Open-plan office disappears the moment I put these on. Multipoint between laptop and phone has been rock solid.',
  },
  {
    productExternalId: 'headphones-sony-wh-1000xm5',
    email: 'bob@example.com',
    rating: 4,
    title: 'Comfortable, but I miss the foldable hinge',
    body: 'Sound and ANC are excellent. The new case is bulkier than the XM4 because these no longer fold — annoying for travel.',
  },
  {
    productExternalId: 'headphones-sony-wh-1000xm5',
    email: 'carol@example.com',
    rating: 5,
    title: '30 hours is not a lie',
    body: 'I charge them once a week with daily commute use. Call quality is finally good enough to take meetings on the move.',
  },
];

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is required');

  const db = createDbClient(url);

  await db.transaction(async (tx) => {
    await tx.execute(sql`TRUNCATE TABLE reviews, product_rating_stats, products, users RESTART IDENTITY CASCADE`);

    const insertedProducts = await tx
      .insert(products)
      .values(SEED_PRODUCTS)
      .returning({ id: products.id, externalId: products.externalId });
    const productIdByExternalId = new Map(insertedProducts.map((p) => [p.externalId, p.id]));

    const hashed = await Promise.all(
      SEED_CUSTOMERS.map(async (c) => ({
        email: c.email,
        passwordHash: await bcrypt.hash(c.password, 10),
      })),
    );
    const insertedUsers = await tx
      .insert(users)
      .values(hashed)
      .returning({ id: users.id, email: users.email });
    const userIdByEmail = new Map(insertedUsers.map((u) => [u.email, u.id]));

    await tx.insert(reviews).values(
      SEED_REVIEWS.map((r) => {
        const productId = productIdByExternalId.get(r.productExternalId);
        if (!productId) throw new Error(`Unknown seed product: ${r.productExternalId}`);
        const userId = userIdByEmail.get(r.email);
        if (!userId) throw new Error(`Unknown seed user: ${r.email}`);
        return {
          productId,
          userId,
          rating: r.rating,
          title: r.title,
          body: r.body,
          status: 'approved' as const,
          verifiedPurchase: true,
        };
      }),
    );

    await tx.execute(sql`
      INSERT INTO product_rating_stats (
        product_id, avg_rating, review_count,
        rating_1_count, rating_2_count, rating_3_count, rating_4_count, rating_5_count, updated_at
      )
      SELECT
        p.id,
        COALESCE(AVG(r.rating)::numeric(3,2), 0),
        COUNT(r.id),
        COUNT(r.id) FILTER (WHERE r.rating = 1),
        COUNT(r.id) FILTER (WHERE r.rating = 2),
        COUNT(r.id) FILTER (WHERE r.rating = 3),
        COUNT(r.id) FILTER (WHERE r.rating = 4),
        COUNT(r.id) FILTER (WHERE r.rating = 5),
        NOW()
      FROM products p
      LEFT JOIN reviews r ON r.product_id = p.id AND r.status = 'approved'
      GROUP BY p.id
    `);
  });

  console.log(
    `Seeded ${SEED_PRODUCTS.length} products, ${SEED_CUSTOMERS.length} customers, and ${SEED_REVIEWS.length} approved reviews.`,
  );
  console.log('Customer logins (all use password "password123"):');
  for (const c of SEED_CUSTOMERS) console.log(`  - ${c.email}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
