import React, { createContext, useContext, useState } from 'react';
import { useCart } from './CartContext';

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

  // Moves a product from the wishlist into the cart using a default
  // size/color (the first available option) since the wishlist itself
  // doesn't track a chosen variant.
  function moveToCart(product) {
    addToCart(product, {
      size: product.sizes[0],
      color: product.colors[0],
      quantity: 1,
    });
    removeFromWishlist(product.id);
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
