import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCart } from "./CartContext";
import { useProducts } from "./ProductsContext";

const WishlistContext = createContext(null);
const STORAGE_KEY = "aluxury_wishlist";

function readStoredIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [ids, setIds] = useState(readStoredIds);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const items = useMemo(
    () => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [ids, products]
  );

  function isWishlisted(productId) {
    return ids.includes(productId);
  }

  function addToWishlist(product) {
    setIds((prev) => (prev.includes(product.id) ? prev : [...prev, product.id]));
  }

  function removeFromWishlist(productId) {
    setIds((prev) => prev.filter((id) => id !== productId));
  }

  function toggleWishlist(product) {
    if (isWishlisted(product.id)) removeFromWishlist(product.id);
    else addToWishlist(product);
  }

  function moveToCart(product) {
    if (product.stock <= 0) return;
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

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
