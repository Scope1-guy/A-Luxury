import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VariantSelector from "../../components/VariantSelector/VariantSelector";
import QuantitySelector from "../../components/QuantitySelector/QuantitySelector";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProducts } from "../../context/ProductsContext";
import { formatMoney } from "../../utils/formatMoney";
import "./ProductDetails.css";

function stockLabel(stock) {
  if (stock <= 0) return "Out of stock";
  if (stock < 10) return `Only ${stock} left`;
  return "In stock";
}

function ProductDetails() {
  const { handle } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const product = useMemo(
    () => products.find((p) => p.id === handle) || null,
    [products, handle]
  );

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Reset the selections whenever a different product is opened.
  useEffect(() => {
    setJustAdded(false);
    setActiveImage(0);
    setQuantity(1);
    setSize(product?.sizes[0] ?? null);
    setColor(product?.colors[0] ?? null);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="container section">
        <p>Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Product not found</h2>
          <p>This item may have been removed.</p>
          <Link to="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const wishlisted = isWishlisted(product.id);
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const inStock = product.stock > 0;

  function handleAddToCart() {
    addToCart(product, { size, color, quantity });
    setJustAdded(true);
  }

  return (
    <div className="container section product-details">
      <div className="pd-gallery">
        <div className="pd-main-image">
          {product.images[activeImage] && (
            <img src={product.images[activeImage]} alt={product.name} />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="pd-thumbnails">
            {product.images.map((img, index) => (
              <button
                key={img}
                className={`pd-thumb ${activeImage === index ? "active" : ""}`}
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pd-info">
        <span className="eyebrow">{product.categoryName}</span>
        <h1>{product.name}</h1>
        <p className="pd-price">
          {onSale && (
            <span className="price-strike">
              {formatMoney(product.compareAtPrice)}
            </span>
          )}
          <span className="price">{formatMoney(product.price)}</span>
        </p>
        <p className="pd-description">{product.description}</p>

        {product.sizes.length > 0 && (
          <VariantSelector
            label="Size"
            options={product.sizes}
            selected={size}
            onSelect={setSize}
          />
        )}
        {product.colors.length > 0 && (
          <VariantSelector
            label="Color"
            options={product.colors}
            selected={color}
            onSelect={setColor}
          />
        )}

        <div className="pd-quantity-row">
          <span className="variant-label">Quantity</span>
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))}
            onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
            max={product.stock}
          />
        </div>

        <div className="pd-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            {inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          <button
            className={`btn btn-ghost btn-block ${wishlisted ? "active" : ""}`}
            onClick={() => toggleWishlist(product)}
          >
            {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>

        {justAdded && (
          <p className="pd-confirmation">
            Added to your <Link to="/cart">cart</Link>.
          </p>
        )}

        <p className="pd-stock">{stockLabel(product.stock)}</p>
      </div>

      {related.length > 0 && (
        <div className="pd-related">
          <h2>You may also like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
