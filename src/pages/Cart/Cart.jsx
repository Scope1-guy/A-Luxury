import React, { useState } from "react";
import { Link } from "react-router-dom";
import QuantitySelector from "../../components/QuantitySelector/QuantitySelector";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";
import { formatMoney } from "../../utils/formatMoney";
import { buildOrderMessage, openWhatsApp } from "../../lib/whatsapp";
import "./Cart.css";

function Cart() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    subtotal,
  } = useCart();
  const { loading } = useProducts();

  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  if (loading) {
    return (
      <div className="container section">
        <p>Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Everything you add will show up here.</p>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  function handleOrder() {
    openWhatsApp(buildOrderMessage({ items, subtotal, name, note }));
  }

  return (
    <div className="container section cart-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Your Bag</span>
          <h1>Cart</h1>
        </div>
        <button className="btn btn-ghost" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <ul className="cart-lines">
          {items.map((item) => (
            <li key={item.key} className="cart-line">
              <Link to={`/product/${item.product.id}`} className="cart-line-image">
                {item.product.image && (
                  <img src={item.product.image} alt={item.product.name} />
                )}
              </Link>

              <div className="cart-line-info">
                <Link to={`/product/${item.product.id}`}>
                  <h3>{item.product.name}</h3>
                </Link>
                {(item.size || item.color) && (
                  <p className="cart-line-variant">
                    {[item.size, item.color].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="price">{formatMoney(item.product.price)}</p>
              </div>

              <QuantitySelector
                quantity={item.quantity}
                onIncrease={() => increaseQuantity(item.key)}
                onDecrease={() => decreaseQuantity(item.key)}
                max={item.product.stock}
              />

              <p className="cart-line-total price">
                {formatMoney(item.product.price * item.quantity)}
              </p>

              <button
                className="cart-line-remove"
                onClick={() => removeFromCart(item.key)}
                aria-label={`Remove ${item.product.name} from cart`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Delivery</span>
            <span>Confirmed on WhatsApp</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>{formatMoney(subtotal)}</span>
          </div>

          <div className="field cart-field">
            <label htmlFor="order-name">Your name (optional)</label>
            <input
              id="order-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field cart-field">
            <label htmlFor="order-note">Delivery address / note (optional)</label>
            <textarea
              id="order-note"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button className="btn btn-whatsapp btn-block" onClick={handleOrder}>
            Order via WhatsApp
          </button>
          <p className="cart-whatsapp-note">
            This opens WhatsApp with your order ready to send. Payment and
            delivery are arranged in the chat.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
