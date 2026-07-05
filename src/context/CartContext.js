import React, { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

// A cart line is uniquely identified by product id + size + color, since
// the same product in two different sizes needs to be two separate lines.
function lineKey(productId, size, color) {
  return `${productId}__${size}__${color}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ key, product, size, color, quantity }]

  function addToCart(product, { size, color, quantity = 1 }) {
    const key = lineKey(product.id, size, color);
    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { key, product, size, color, quantity }];
    });
  }

  function increaseQuantity(key) {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: item.quantity + 1 } : item))
    );
  }

  function decreaseQuantity(key) {
    setItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0) // dropping to 0 removes the line
    );
  }

  function removeFromCart(key) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  function clearCart() {
    setItems([]);
  }

  // useMemo avoids recalculating totals on every render — only when items change.
  const { subtotal, itemCount } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, itemCount };
  }, [items]);

  const value = {
    items,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
