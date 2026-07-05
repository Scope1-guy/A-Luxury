import React from 'react';
import './VariantSelector.css';

// Renders a row of pill buttons for either sizes or colors. `selected` and
// `onSelect` are passed in so this one component works for both — the
// parent (ProductDetails) is the one that knows which value is "size"
// versus "color".
function VariantSelector({ label, options, selected, onSelect }) {
  return (
    <div className="variant-selector">
      <span className="variant-label">{label}</span>
      <div className="variant-options">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`variant-pill ${selected === option ? 'active' : ''}`}
            onClick={() => onSelect(option)}
            aria-pressed={selected === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VariantSelector;
