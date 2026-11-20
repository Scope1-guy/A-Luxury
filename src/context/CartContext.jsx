import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProducts } from "./ProductsContext";

const CartContext = createContext(null);
const STORAGE_KEY = "aluxury_cart";

function lineKey(productId, size, color) {
  return `${productId}__${size || ""}__${color || ""}`;
}

function readStoredLines() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// The cart only stores { productId, size, color, quantity }. Names, images and
// prices are looked up from the live product list every time, so if the client
// changes a price in the Google Sheet the cart never shows a stale one.
export function CartProvider({ children }) {
  const { products } = useProducts();
  const [lines, setLines] = useState(readStoredLines);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart just won't persist */
    }
  }, [lines]);

  const items = useMemo(() => {
    return lines
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        return {
          key: lineKey(line.productId, line.size, line.color),
          product,
          size: line.size,
          color: line.color,
          quantity: Math.min(line.quantity, Math.max(product.stock, 1)),
        };
      })
      .filter(Boolean);
  }, [lines, products]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines]
  );

  function addToCart(product, { size, color, quantity = 1 }) {
    if (product.stock <= 0) return;
    const key = lineKey(product.id, size, color);

    setLines((prev) => {
      const existing = prev.find(
        (l) => lineKey(l.productId, l.size, l.color) === key
      );
      if (existing) {
        return prev.map((l) =>
          lineKey(l.productId, l.size, l.color) === key
            ? { ...l, quantity: Math.min(l.quantity + quantity, product.stock) }
            : l
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          size,
          color,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    });
  }

  function changeQuantity(key, delta) {
    setLines((prev) =>
      prev
        .map((l) => {
          if (lineKey(l.productId, l.size, l.color) !== key) return l;
          const product = products.find((p) => p.id === l.productId);
          const max = product ? product.stock : 99;
          return { ...l, quantity: Math.min(l.quantity + delta, max) };
        })
        .filter((l) => l.quantity > 0)
    );
  }

  const increaseQuantity = (key) => changeQuantity(key, 1);
  const decreaseQuantity = (key) => changeQuantity(key, -1);

  function removeFromCart(key) {
    setLines((prev) =>
      prev.filter((l) => lineKey(l.productId, l.size, l.color) !== key)
    );
  }

  function clearCart() {
    setLines([]);
  }

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
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
