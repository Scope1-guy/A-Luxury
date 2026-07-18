// Cart service — talks to Shopify's Cart API.
//
// CartContext is the only thing that calls these functions. Every function
// here returns the raw `cart` object Shopify sends back (id, checkoutUrl,
// cost, lines) so the caller always has the freshest state after a mutation.

import { shopifyFetch } from "../graphql/client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_BUYER_IDENTITY_UPDATE_MUTATION,
  CART_QUERY,
} from "../graphql/queries/cart";

function throwOnUserErrors(userErrors) {
  if (userErrors && userErrors.length > 0) {
    throw new Error(userErrors.map((e) => e.message).join(", "));
  }
}

// lines: [{ merchandiseId, quantity }]
export async function createCart(lines, countryCode) {
  const data = await shopifyFetch(CART_CREATE_MUTATION, {
    lines,
    countryCode,
  });
  throwOnUserErrors(data.cartCreate.userErrors);
  return data.cartCreate.cart;
}

export async function addCartLines(cartId, lines) {
  const data = await shopifyFetch(CART_LINES_ADD_MUTATION, { cartId, lines });
  throwOnUserErrors(data.cartLinesAdd.userErrors);
  return data.cartLinesAdd.cart;
}

// lines: [{ id: <shopify line id>, quantity }]
export async function updateCartLines(cartId, lines) {
  const data = await shopifyFetch(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines,
  });
  throwOnUserErrors(data.cartLinesUpdate.userErrors);
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(cartId, lineIds) {
  const data = await shopifyFetch(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds,
  });
  throwOnUserErrors(data.cartLinesRemove.userErrors);
  return data.cartLinesRemove.cart;
}

// Re-prices the whole cart (and regenerates checkoutUrl) for a new
// country — called by CartContext when the user switches currency after
// already having items in their cart.
export async function updateBuyerIdentity(cartId, countryCode) {
  const data = await shopifyFetch(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
    cartId,
    countryCode,
  });
  throwOnUserErrors(data.cartBuyerIdentityUpdate.userErrors);
  return data.cartBuyerIdentityUpdate.cart;
}

export async function getCart(cartId) {
  const data = await shopifyFetch(CART_QUERY, { cartId });
  return data.cart; // null if the cart expired (Shopify carts expire after ~10 weeks)
}