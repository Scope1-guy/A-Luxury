import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import './Wishlist.css';

function Wishlist() {
  const { items, removeFromWishlist, moveToCart } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Your wishlist is empty</h2>
          <p>Save products you're not ready to buy yet — they'll show up here.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section wishlist-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Saved for later</span>
          <h1>Wishlist</h1>
        </div>
      </div>

      <ul className="wishlist-grid">
        {items.map((product) => (
          <li key={product.id} className="wishlist-card">
            <Link to={`/product/${product.id}`} className="wishlist-card-image">
              <img src={product.images[0]} alt={product.name} />
            </Link>
            <div className="wishlist-card-body">
              <Link to={`/product/${product.id}`}><h3>{product.name}</h3></Link>
              <p className="price">${product.price}</p>
              <div className="wishlist-card-actions">
                <button className="btn btn-primary" onClick={() => moveToCart(product)}>
                  Move to Cart
                </button>
                <button className="btn btn-ghost" onClick={() => removeFromWishlist(product.id)}>
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wishlist;
