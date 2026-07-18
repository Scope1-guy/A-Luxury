import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as cartService from "../services/cartService";
import { useCurrency } from "./CurrencyContext";

const CartContext = createContext(null);

function lineKey(productId, size, color) {
  return `${productId}__${size}__${color}`;
}

const CART_ID_KEY = "shopify_cart_id";

export function CartProvider({ children }) {
  const { country } = useCurrency();
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(() =>
    localStorage.getItem(CART_ID_KEY)
  );
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function restoreCart() {
      if (!cartId) return;
      try {
        const cart = await cartService.getCart(cartId);
        if (!cart) {
          localStorage.removeItem(CART_ID_KEY);
          setCartId(null);
          return;
        }
        syncFromShopifyCart(cart);
      } catch (err) {
        console.error("Failed to restore cart:", err);
      }
    }
    restoreCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function syncFromShopifyCart(cart) {
    setCartId(cart.id);
    setCheckoutUrl(cart.checkoutUrl);
    localStorage.setItem(CART_ID_KEY, cart.id);

    setItems((prevItems) => {
      return cart.lines.nodes.map((line) => {
        const variant = line.merchandise;
        const size = variant.selectedOptions.find(
          (o) => o.name.toLowerCase() === "size"
        )?.value;
        const color = variant.selectedOptions.find(
          (o) => o.name.toLowerCase() === "color"
        )?.value;

        const existing = prevItems.find(
          (item) => item.shopifyLineId === line.id
        );

        return {
          key: existing?.key || lineKey(variant.product.handle, size, color),
          shopifyLineId: line.id,
          variantId: variant.id,
          quantity: line.quantity,
          size,
          color,
          product: {
            handle: variant.product.handle,
            name: variant.product.title,
            images: [],
            ...existing?.product,
            price: parseFloat(variant.price.amount),
            currencyCode: variant.price.currencyCode,
          },
        };
      });
    });
  }

  const didMount = React.useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (!cartId) return;
    let cancelled = false;

    async function reprice() {
      setLoading(true);
      try {
        const cart = await cartService.updateBuyerIdentity(cartId, country);
        if (!cancelled) syncFromShopifyCart(cart);
      } catch (err) {
        console.error("Failed to reprice cart for new country:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    reprice();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  async function addToCart(product, { size, color, quantity = 1, variantId }) {
    if (!variantId) {
      console.error("addToCart requires a variantId to talk to Shopify");
      return;
    }

    setLoading(true);
    try {
      let cart;
      if (!cartId) {
        cart = await cartService.createCart(
          [{ merchandiseId: variantId, quantity }],
          country
        );
      } else {
        cart = await cartService.addCartLines(cartId, [
          { merchandiseId: variantId, quantity },
        ]);
      }

      syncFromShopifyCart(cart);

      setItems((prev) =>
        prev.map((item) =>
          item.variantId === variantId ? { ...item, product } : item
        )
      );
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setLoading(false);
    }
  }

  async function setLineQuantity(item, newQuantity) {
    if (!cartId) return;
    setLoading(true);
    try {
      let cart;
      if (newQuantity <= 0) {
        cart = await cartService.removeCartLines(cartId, [item.shopifyLineId]);
      } else {
        cart = await cartService.updateCartLines(cartId, [
          { id: item.shopifyLineId, quantity: newQuantity },
        ]);
      }
      syncFromShopifyCart(cart);
    } catch (err) {
      console.error("Failed to update cart:", err);
    } finally {
      setLoading(false);
    }
  }

  function increaseQuantity(key) {
    const item = items.find((i) => i.key === key);
    if (item) setLineQuantity(item, item.quantity + 1);
  }

  function decreaseQuantity(key) {
    const item = items.find((i) => i.key === key);
    if (item) setLineQuantity(item, item.quantity - 1);
  }

  async function removeFromCart(key) {
    const item = items.find((i) => i.key === key);
    if (!item || !cartId) return;
    setLoading(true);
    try {
      const cart = await cartService.removeCartLines(cartId, [
        item.shopifyLineId,
      ]);
      syncFromShopifyCart(cart);
    } catch (err) {
      console.error("Failed to remove cart line:", err);
    } finally {
      setLoading(false);
    }
  }

  async function clearCart() {
    if (!cartId || items.length === 0) return;
    setLoading(true);
    try {
      const cart = await cartService.removeCartLines(
        cartId,
        items.map((i) => i.shopifyLineId)
      );
      syncFromShopifyCart(cart);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    } finally {
      setLoading(false);
    }
  }

  function checkout() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }

  const { subtotal, itemCount } = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
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
    checkout,
    checkoutUrl,
    loading,
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