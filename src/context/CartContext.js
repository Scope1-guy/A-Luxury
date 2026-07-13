import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as cartService from "../services/cartService";

const CartContext = createContext(null);

// A cart line is uniquely identified by product id + size + color, since
// the same product in two different sizes needs to be two separate lines.
function lineKey(productId, size, color) {
  return `${productId}__${size}__${color}`;
}

// Shopify carts persist for ~10 weeks server-side, so we remember the
// cart id across page reloads/tab closes rather than starting a new
// cart every visit.
const CART_ID_KEY = "shopify_cart_id";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ key, product, size, color, quantity, variantId, shopifyLineId }]
  const [cartId, setCartId] = useState(() => localStorage.getItem(CART_ID_KEY));
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // On first load, if we have a remembered cart id, pull the live cart
  // from Shopify so a refresh doesn't lose what's in the bag. If the cart
  // has expired or was completed, Shopify returns null and we start clean.
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

  // Takes whatever Shopify hands back after any mutation and rebuilds our
  // local `items` list from it, so local state never drifts from what
  // Shopify actually has.
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

        // Try to keep the richer local `product` object (images, price,
        // description, etc. — Shopify's cart response only gives us the
        // variant/product title) if we already had this line locally.
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
          product: existing?.product || {
            handle: variant.product.handle,
            name: variant.product.title,
            images: [],
            price: parseFloat(variant.price.amount),
          },
        };
      });
    });
  }

  async function addToCart(product, { size, color, quantity = 1, variantId }) {
    if (!variantId) {
      console.error("addToCart requires a variantId to talk to Shopify");
      return;
    }

    setLoading(true);
    try {
      let cart;
      if (!cartId) {
        cart = await cartService.createCart([
          { merchandiseId: variantId, quantity },
        ]);
      } else {
        // If this exact variant is already a line in the cart, Shopify
        // merges quantities automatically on cartLinesAdd.
        cart = await cartService.addCartLines(cartId, [
          { merchandiseId: variantId, quantity },
        ]);
      }

      syncFromShopifyCart(cart);

      // Attach the full local product (images, description, etc.) to the
      // line we just touched, since Shopify's response doesn't include it.
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

  // Sends the user to Shopify's hosted checkout page. This is the entire
  // "handle payment" step — Shopify collects address/shipping/payment on
  // its own page, then returns the user to your storefront afterward.
  function checkout() {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      // console.log(checkoutUrl);
    }
  }

  // useMemo avoids recalculating totals on every render — only when items change.
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
