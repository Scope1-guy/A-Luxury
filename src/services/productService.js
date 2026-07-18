// Product service.
//
// Every function below now accepts an optional `country` (an ISO country
// code like "US", "GB", "CA" — see CurrencyContext). It's passed straight
// through to Shopify's @inContext directive, which returns prices already
// converted to that country's currency. If you don't pass one, Shopify
// just uses the store's default currency.

import { shopifyFetch } from "../graphql/client";
import { PRODUCTS_QUERY, PRODUCT_QUERY } from "../graphql/queries/products";

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
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
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
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
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
    stock: variantNodes.filter((v) => v.availableForSale).length * 10,
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

export async function getAllProducts(country) {
  let allNodes = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await shopifyFetch(PRODUCTS_QUERY, { cursor, country });
    allNodes = allNodes.concat(data.products.nodes);
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allNodes.map(normalizeListProduct);
}

export async function getProductById(handle, country) {
  const data = await shopifyFetch(PRODUCT_QUERY, { handle, country });
  return normalizeDetailProduct(data.product);
}

export async function getProductsByCategory(categoryId, country) {
  const all = await getAllProducts(country);
  return all.filter((p) => p.category === categoryId);
}

export async function getFeaturedProducts(country) {
  const all = await getAllProducts(country);
  return all.filter((p) => p.tags.includes("featured"));
}

export async function getNewArrivals(country) {
  const all = await getAllProducts(country);
  return all.filter((p) => p.tags.includes("newarrival"));
}

export async function getBestSellers(country) {
  const all = await getAllProducts(country);
  return all.filter((p) => p.tags.includes("bestseller"));
}

export async function searchProducts(term, country) {
  const all = await getAllProducts(country);
  const lower = term.trim().toLowerCase();
  if (!lower) return all;
  return all.filter((p) => p.name.toLowerCase().includes(lower));
}

export async function getRelatedProducts(product, limit = 4, country) {
  if (!product) return [];
  const all = await getAllProducts(country);
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}