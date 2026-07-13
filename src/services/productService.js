// Product service.
//
// Every page reads products through this file rather than importing
// `data/products.js` directly. That indirection is the whole point:
// when you're ready to connect Shopify, this is the ONLY file you should
// need to rewrite — every component that calls these functions can stay
// exactly as it is, because the function signatures (inputs/outputs)
// won't change, only what happens inside them.
//
// Replace this fake data with Shopify Storefront API calls later.
// Each function below is a natural match for a Storefront GraphQL query:
//   getAllProducts()        -> products(first: N) query
//   getProductById(id)      -> product(id: ...) query
//   getProductsByCategory() -> products(query: "product_type:...")
//   searchProducts(term)    -> products(query: term)
//   getRelatedProducts()    -> products in the same collection/tags

import products from "../data/products";
import { shopifyFetch } from "../graphql/client";
import { PRODUCTS_QUERY, PRODUCT_QUERY } from "../graphql/queries/products";

// Simulates network latency so loading states can be built and tested
// the same way they will need to work once real API calls are in place.
const FAKE_DELAY_MS = 250;

function delay(value) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), FAKE_DELAY_MS)
  );
}

function normalizeProduct(product) {
  if (!p) return null;
  return {
    id: product.id,
    name: product.title,
    handle: product.handle,
    image: product.images.nodes.map((img) => img.url),
    description: product.description,
    price: parseFloat(product.priceRange.minVariantPrice.amount),
    compareAtPrice: product.compareAtPriceRange?.maxVariantPrice?.amount
      ? parseFloat(product.compareAtPriceRange.maxVariantPrice.amount)
      : null,
    sizes:
      product.options.find((option) => option.name === "size")?.values || [],
    colors:
      product.options.find((option) => option.name === "color")?.values || [],
    // variants: product.variants.nodes,
    // stock: product.variants.nodes.length,
    stock: 99,
  };
}

// function formatSingleProduct(product) {
//   if (!product) return null;

//   return {
//     id: product.id,
//     name: product.title,
//     handle: product.handle,
//     description: product.description,
//     images: product.images.nodes.map((img) => img.url),
//     category: product.collections?.nodes[0]?.title || "Uncategorized",
//     price: Number(product.priceRange.minVariantPrice.amount),
//     compareAtPrice: Number(
//       product.compareAtPriceRange?.maxVariantPrice?.amount || 0
//     ),
//     sizes:
//       product.options.find((option) => option.name.toLowerCase() === "size")
//         ?.values || [],
//     colors:
//       product.options.find((option) => option.name.toLowerCase() === "color")
//         ?.values || [],
//     variants: product.variants.nodes,
//     stock: product.variants.nodes.length,
//   };
// }

// export function getAllProducts() {
//   return delay(products);
// }

export async function getAllProducts() {
  const data = await shopifyFetch(PRODUCTS_QUERY);

  console.log("RAW SHOPIFY PRODUCTS:", data.products.nodes);

  return data.products.nodes.map(formatProduct);
}

// export function getProductById(id) {
//   const product = products.find((p) => p.id === id) || null;
//   return delay(product);
// }

export async function getProductById(handle) {
  const data = await shopifyFetch(PRODUCT_QUERY, {
    handle,
  });

  console.log("SHOPIFY SINGLE PRODUCT:", data);
  if (!data.product) {
    return null;
  }

  return normalizeProduct(data.product);
}

export function getProductsByCategory(categoryId) {
  const filtered = products.filter((p) => p.category === categoryId);
  return delay(filtered);
}

export function getFeaturedProducts() {
  return delay(products.filter((p) => p.tags.includes("featured")));
}

export function getNewArrivals() {
  return delay(products.filter((p) => p.tags.includes("newArrival")));
}

export function getBestSellers() {
  return delay(products.filter((p) => p.tags.includes("bestSeller")));
}

export function searchProducts(term) {
  const lower = term.trim().toLowerCase();
  if (!lower) return delay(products);
  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
  );
  return delay(results);
}

export function getRelatedProducts(product, limit = 4) {
  if (!product) return delay([]);
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
  return delay(related);
}
