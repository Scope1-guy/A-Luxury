import React, { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';
import { useCurrency } from './CurrencyContext';
import { getProductById } from '../services/productService';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();
  const { country } = useCurrency();

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

  async function moveToCart(product) {
    const detail = await getProductById(product.handle, country);
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