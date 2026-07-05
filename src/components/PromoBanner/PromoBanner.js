import React from 'react';
import { Link } from 'react-router-dom';
import './PromoBanner.css';

function PromoBanner() {
  return (
    <section className="promo-banner">
      <div className="container promo-inner">
        <img src="https://picsum.photos/seed/fold-promo/1400/500" alt="" className="promo-bg" />
        <div className="promo-content">
          <span className="eyebrow">Limited run</span>
          <h2>Selvedge denim, back in stock.</h2>
          <Link to="/shop?category=trousers" className="btn btn-primary">Shop Denim</Link>
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
