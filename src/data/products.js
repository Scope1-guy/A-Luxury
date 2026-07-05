// Fake product catalog used across Home, Shop, and Product Details.
// Images use picsum.photos placeholders with a stable seed per product.
//
// Replace this fake data with Shopify Storefront API products later.
// Keep the shape (id, name, price, images, sizes, colors, stock) close to
// what the Storefront API returns so the swap is mostly a mapping exercise.
const products = [
  {
    id: 'p01',
    name: 'Wool Overcoat',
    category: 'outerwear',
    price: 328,
    compareAtPrice: null,
    description:
      'A full-length coat in double-faced wool, cut for a straight silhouette that layers cleanly over knitwear. Horn buttons, welt pockets, and a back vent for movement.',
    images: [
      'https://picsum.photos/seed/fold-p01-a/900/1100',
      'https://picsum.photos/seed/fold-p01-b/900/1100',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Camel'],
    stock: 14,
    tags: ['featured', 'bestSeller'],
  },
  {
    id: 'p02',
    name: 'Waxed Field Jacket',
    category: 'outerwear',
    price: 245,
    compareAtPrice: 285,
    description:
      'Waxed cotton jacket with a corduroy collar and four bellow pockets. Weather-resistant finish that develops character with wear.',
    images: [
      'https://picsum.photos/seed/fold-p02-a/900/1100',
      'https://picsum.photos/seed/fold-p02-b/900/1100',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Olive', 'Black'],
    stock: 9,
    tags: ['newArrival'],
  },
  {
    id: 'p03',
    name: 'Merino Crewneck',
    category: 'knitwear',
    price: 128,
    compareAtPrice: null,
    description:
      'Fine-gauge merino wool crewneck. Lightweight enough to wear alone, warm enough to layer under a coat.',
    images: [
      'https://picsum.photos/seed/fold-p03-a/900/1100',
      'https://picsum.photos/seed/fold-p03-b/900/1100',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal', 'Forest', 'Black'],
    stock: 32,
    tags: ['featured', 'bestSeller'],
  },
  {
    id: 'p04',
    name: 'Cable Cardigan',
    category: 'knitwear',
    price: 158,
    compareAtPrice: null,
    description:
      'Chunky cable-knit cardigan in brushed lambswool, with horn toggles and deep patch pockets.',
    images: [
      'https://picsum.photos/seed/fold-p04-a/900/1100',
      'https://picsum.photos/seed/fold-p04-b/900/1100',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Charcoal'],
    stock: 18,
    tags: ['newArrival'],
  },
  {
    id: 'p05',
    name: 'Oxford Shirt',
    category: 'shirting',
    price: 98,
    compareAtPrice: null,
    description:
      'Classic button-down in brushed Oxford cotton. Slightly relaxed through the body, tapered at the cuff.',
    images: [
      'https://picsum.photos/seed/fold-p05-a/900/1100',
      'https://picsum.photos/seed/fold-p05-b/900/1100',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Sky Blue', 'Stone'],
    stock: 40,
    tags: ['bestSeller'],
  },
  {
    id: 'p06',
    name: 'Silk Blouse',
    category: 'shirting',
    price: 168,
    compareAtPrice: null,
    description:
      'Fluid silk blouse with a hidden button placket and a soft box pleat at the back yoke.',
    images: [
      'https://picsum.photos/seed/fold-p06-a/900/1100',
      'https://picsum.photos/seed/fold-p06-b/900/1100',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory', 'Blush', 'Black'],
    stock: 21,
    tags: ['featured'],
  },
  {
    id: 'p07',
    name: 'Straight-Leg Trouser',
    category: 'trousers',
    price: 138,
    compareAtPrice: null,
    description:
      'Mid-weight wool-blend trouser with a clean straight leg and a flat front. Built to hold its crease.',
    images: [
      'https://picsum.photos/seed/fold-p07-a/900/1100',
      'https://picsum.photos/seed/fold-p07-b/900/1100',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Charcoal', 'Navy', 'Stone'],
    stock: 26,
    tags: ['bestSeller'],
  },
  {
    id: 'p08',
    name: 'Selvedge Denim',
    category: 'trousers',
    price: 178,
    compareAtPrice: null,
    description:
      'Japanese selvedge denim in a straight cut, raw-hemmed and unwashed so it fades to your wear pattern.',
    images: [
      'https://picsum.photos/seed/fold-p08-a/900/1100',
      'https://picsum.photos/seed/fold-p08-b/900/1100',
    ],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Indigo'],
    stock: 15,
    tags: ['newArrival'],
  },
  {
    id: 'p09',
    name: 'Bias Slip Dress',
    category: 'dresses',
    price: 198,
    compareAtPrice: 230,
    description:
      'Bias-cut slip dress in washed satin. Adjustable straps, a fluid drape, and a hem that skims just below the knee.',
    images: [
      'https://picsum.photos/seed/fold-p09-a/900/1100',
      'https://picsum.photos/seed/fold-p09-b/900/1100',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Champagne', 'Black', 'Forest'],
    stock: 12,
    tags: ['featured', 'newArrival'],
  },
  {
    id: 'p10',
    name: 'Wrap Midi Dress',
    category: 'dresses',
    price: 212,
    compareAtPrice: null,
    description:
      'Wrap-front midi dress in a textured crepe. A self-tie waist and a fluid A-line skirt.',
    images: [
      'https://picsum.photos/seed/fold-p10-a/900/1100',
      'https://picsum.photos/seed/fold-p10-b/900/1100',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Terracotta', 'Navy'],
    stock: 17,
    tags: ['bestSeller'],
  },
  {
    id: 'p11',
    name: 'Leather Belt',
    category: 'accessories',
    price: 68,
    compareAtPrice: null,
    description:
      'Full-grain leather belt with a solid brass buckle. Develops a deep patina over time.',
    images: [
      'https://picsum.photos/seed/fold-p11-a/900/1100',
      'https://picsum.photos/seed/fold-p11-b/900/1100',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Cognac', 'Black'],
    stock: 44,
    tags: [],
  },
  {
    id: 'p12',
    name: 'Merino Scarf',
    category: 'accessories',
    price: 78,
    compareAtPrice: null,
    description:
      'Oversized scarf in a lofty merino weave. Fringed edges, generous length for wrapping twice.',
    images: [
      'https://picsum.photos/seed/fold-p12-a/900/1100',
      'https://picsum.photos/seed/fold-p12-b/900/1100',
    ],
    sizes: ['One Size'],
    colors: ['Camel', 'Charcoal', 'Forest'],
    stock: 30,
    tags: ['newArrival'],
  },
];

export default products;
