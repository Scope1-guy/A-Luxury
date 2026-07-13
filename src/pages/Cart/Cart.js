import React from 'react';
import { Link } from 'react-router-dom';
import QuantitySelector from '../../components/QuantitySelector/QuantitySelector';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const SHIPPING_FLAT_RATE = 12;

function Cart() {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, checkout, loading, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Everything you add will show up here.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const shipping = SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  return (
    <div className="container section cart-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Your Bag</span>
          <h1>Cart</h1>
        </div>
        <button className="btn btn-ghost" onClick={clearCart}>Clear Cart</button>
      </div>

      <div className="cart-layout">
        <ul className="cart-lines">
          {items.map((item) => (
            <li key={item.key} className="cart-line">
              <Link to={`/product/${item.product.handle}`} className="cart-line-image">
                <img src={item.product.images[0]} alt={item.product.name} />
              </Link>

              <div className="cart-line-info">
                <Link to={`/product/${item.product.handle}`}>
                  <h3>{item.product.name}</h3>
                </Link>
                <p className="cart-line-variant">{item.size} · {item.color}</p>
                <p className="price">${item.product.price}</p>
              </div>

              <QuantitySelector
                quantity={item.quantity}
                onIncrease={() => increaseQuantity(item.key)}
                onDecrease={() => decreaseQuantity(item.key)}
                max={item.product.stock}
              />

              <p className="cart-line-total price">
                ${(item.product.price * item.quantity).toFixed(2)}
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
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-primary btn-block"
            onClick={checkout}
            disabled={loading}
          >
            {loading ? "Please wait…" : "Checkout"}
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
