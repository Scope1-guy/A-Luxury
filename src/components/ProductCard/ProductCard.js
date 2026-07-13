import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import "./ProductCard.css";

// A single product card, reused on Home, Shop, Categories, and the
// "related products" section of Product Details. Keeping it as one
// component means a style change here updates the whole site.
function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;

  console.log("PRODUCTCARD:", product);

  return (
    <div className="product-card">
      <div className="product-card-media">
        <Link to={`/product/${product.handle}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <span className="fold-mark card-corner" aria-hidden="true"></span>
        {onSale && <span className="badge badge-sale card-badge">Sale</span>}

        {/* stopPropagation isn't needed here since this button isn't nested
            inside the Link, but toggleWishlist itself is a good example of
            a context action a beginner component can call directly. */}
        <button
          className={`wishlist-toggle ${wishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      <Link to={`/product/${product.handle}`} className="product-card-body">
        <h3>{product.name}</h3>
        <p className="product-card-price">
          {onSale && (
            <span className="price-strike">${product.compareAtPrice}</span>
          )}
          <span className="price">${product.price}</span>
        </p>
      </Link>
    </div>
  );
}

export default ProductCard;
