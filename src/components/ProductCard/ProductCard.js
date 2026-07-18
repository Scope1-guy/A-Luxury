import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { formatMoney } from "../../utils/formatMoney";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <div className="product-card">
      <div className="product-card-media">
        <Link to={`/product/${product.handle}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>
        <span className="fold-mark card-corner" aria-hidden="true"></span>
        {onSale && <span className="badge badge-sale card-badge">Sale</span>}

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
            <span className="price-strike">
              {formatMoney(product.compareAtPrice, product.currencyCode)}
            </span>
          )}
          <span className="price">
            {formatMoney(product.price, product.currencyCode)}
          </span>
        </p>
      </Link>
    </div>
  );
}

export default ProductCard;