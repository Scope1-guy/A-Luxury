import React from 'react';
import './QuantitySelector.css';

// Controlled component: the parent owns the `quantity` value and passes
// down onIncrease/onDecrease, rather than this component managing its own
// state. That keeps a single source of truth (e.g. the cart line's quantity).
function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1, max = 99 }) {
  return (
    <div className="quantity-selector">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
