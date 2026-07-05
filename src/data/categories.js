// Fake category data. Each category's `image` is a placeholder (picsum.photos
// with a fixed seed, so it stays stable across reloads). Replace this fake
// data with Shopify Storefront API collections later.
const categories = [
  {
    id: 'outerwear',
    name: 'Outerwear',
    description: 'Coats and jackets built for the long haul.',
    image: 'https://picsum.photos/seed/fold-outerwear/900/1100',
  },
  {
    id: 'knitwear',
    name: 'Knitwear',
    description: 'Sweaters and cardigans in natural fibers.',
    image: 'https://picsum.photos/seed/fold-knitwear/900/1100',
  },
  {
    id: 'shirting',
    name: 'Shirting',
    description: 'Shirts and blouses, tailored to move.',
    image: 'https://picsum.photos/seed/fold-shirting/900/1100',
  },
  {
    id: 'trousers',
    name: 'Trousers',
    description: 'Trousers and denim with a clean line.',
    image: 'https://picsum.photos/seed/fold-trousers/900/1100',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    description: 'Dresses for every register of the day.',
    image: 'https://picsum.photos/seed/fold-dresses/900/1100',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'The details that finish an outfit.',
    image: 'https://picsum.photos/seed/fold-accessories/900/1100',
  },
];

export default categories;
