import React, { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';
import { getProductById } from '../services/productService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]); // array of product objects
  const { addToCart } = useCart();

  function isWishlisted(productId) {
    return items.some((p) => p.id === productId);
  }

  function addToWishlist(product) {
    setItems((prev) => (isWishlisted(product.id) ? prev : [...prev, product]));
  }

  function removeFromWishlist(productId) {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }

  function toggleWishlist(product) {
    isWishlisted(product.id) ? removeFromWishlist(product.id) : addToWishlist(product);
  }

  // Wishlist items are the "list" shape (from ProductCard: id, handle,
  // name, image, price — no sizes/colors/variants). To add to cart we
  // need a real Shopify variant id, so we re-fetch the full product
  // detail first, then pick its first available size/color combo.
  async function moveToCart(product) {
    const detail = await getProductById(product.handle);
    if (!detail) return;

    const size = detail.sizes[0];
    const color = detail.colors[0];
    const variant = detail.variants.find(
      (v) =>
        (!size || v.options.size === size) &&
        (!color || v.options.color === color)
    );

    if (variant) {
      addToCart(detail, { size, color, quantity: 1, variantId: variant.id });
      removeFromWishlist(product.id);
    }
  }

  const value = {
    items,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    moveToCart,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
