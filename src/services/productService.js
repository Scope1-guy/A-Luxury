// Product service.
//
// Every page reads products through this file rather than importing
// `data/products.js` directly. That indirection is the whole point:
// when you're ready to connect Shopify, this is the ONLY file you should
// need to rewrite — every component that calls these functions can stay
// exactly as it is, because the function signatures (inputs/outputs)
// won't change, only what happens inside them.
//
// This file now talks to Shopify's Storefront API. Two shapes come back
// from Shopify and get normalized separately:
//   - "list" shape (from PRODUCTS_QUERY / getAllProducts): used by
//     ProductCard, so it exposes a single `image` string.
//   - "detail" shape (from PRODUCT_QUERY / getProductById): used by
//     ProductDetails, so it exposes an `images` array and `variants`.

import { shopifyFetch } from "../graphql/client";
import { PRODUCTS_QUERY, PRODUCT_QUERY } from "../graphql/queries/products";

// Matches a product's first collection handle against data/categories.js
// ids (outerwear, knitwear, shirting, trousers, dresses, accessories).
// IMPORTANT: for category filtering to work, each Shopify collection's
// "handle" (Admin > Collections > that collection > URL/handle field)
// must match one of those category ids.
function resolveCategory(collectionsNodes) {
  return collectionsNodes?.[0]?.handle || null;
}

function normalizeListProduct(node) {
  return {
    id: node.id,
    handle: node.handle,
    name: node.title,
    image: node.featuredImage?.url || null,
    price: parseFloat(node.priceRange.minVariantPrice.amount),
    compareAtPrice: node.compareAtPriceRange?.maxVariantPrice?.amount
      ? parseFloat(node.compareAtPriceRange.maxVariantPrice.amount)
      : null,
    category: resolveCategory(node.collections?.nodes),
    tags: (node.tags || []).map((t) => t.toLowerCase()),
  };
}

function normalizeDetailProduct(product) {
  if (!product) return null;

  const variantNodes = product.variants?.nodes || [];

  return {
    id: product.id,
    handle: product.handle,
    name: product.title,
    description: product.description,
    images: product.images.nodes.map((img) => img.url),
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    compareAtPrice: product.compareAtPriceRange?.maxVariantPrice?.amount
      ? parseFloat(product.compareAtPriceRange.maxVariantPrice.amount)
      : null,
    category: resolveCategory(product.collections?.nodes),
    tags: (product.tags || []).map((t) => t.toLowerCase()),
    sizes:
      product.options.find((o) => o.name.toLowerCase() === "size")?.values ||
      [],
    colors:
      product.options.find((o) => o.name.toLowerCase() === "color")?.values ||
      [],
    // Shopify's exact inventory count (quantityAvailable) requires the
    // "unauthenticated_read_product_inventory" scope, which most Storefront
    // tokens don't have. availableForSale (in stock: yes/no) doesn't need
    // that scope, so stock here is a rough "how many variants are in
    // stock" count rather than a true unit count. If you want real
    // numbers, enable that scope for your app in Shopify admin, then add
    // quantityAvailable back into PRODUCT_QUERY.
    stock: variantNodes.filter((v) => v.availableForSale).length * 10,
    // Needed at checkout time: each variant's own id (a different GID from
    // the product's id) is what Shopify's Cart API expects as merchandiseId.
    variants: variantNodes.map((v) => ({
      id: v.id,
      available: v.availableForSale,
      options: v.selectedOptions.reduce((acc, o) => {
        acc[o.name.toLowerCase()] = o.value;
        return acc;
      }, {}),
    })),
  };
}

// Fetches the FULL catalog by following Shopify's cursor pagination until
// there are no more pages. Every other list-style function below
// (featured/new/bestsellers/category/search) filters this in memory,
// which is fine for a catalog in the tens-to-low-hundreds of products.
export async function getAllProducts() {
  let allNodes = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await shopifyFetch(PRODUCTS_QUERY, { cursor });
    allNodes = allNodes.concat(data.products.nodes);
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allNodes.map(normalizeListProduct);
}

export async function getProductById(handle) {
  const data = await shopifyFetch(PRODUCT_QUERY, { handle });
  return normalizeDetailProduct(data.product);
}

export async function getProductsByCategory(categoryId) {
  const all = await getAllProducts();
  return all.filter((p) => p.category === categoryId);
}

// NOTE: these three rely on the merchant tagging products in Shopify
// admin with the exact tags "featured", "newArrival", "bestSeller".
// Without those tags, these rows will come back empty — that's expected,
// not a bug, until products are tagged in Shopify.
export async function getFeaturedProducts() {
  const all = await getAllProducts();
  return all.filter((p) => p.tags.includes("featured"));
}

export async function getNewArrivals() {
  const all = await getAllProducts();
  return all.filter((p) => p.tags.includes("newarrival"));
}

export async function getBestSellers() {
  const all = await getAllProducts();
  return all.filter((p) => p.tags.includes("bestseller"));
}

export async function searchProducts(term) {
  const all = await getAllProducts();
  const lower = term.trim().toLowerCase();
  if (!lower) return all;
  return all.filter((p) => p.name.toLowerCase().includes(lower));
}

export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  const all = await getAllProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}
