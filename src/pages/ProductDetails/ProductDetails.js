import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VariantSelector from "../../components/VariantSelector/VariantSelector";
import QuantitySelector from "../../components/QuantitySelector/QuantitySelector";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/productService";
import "./ProductDetails.css";
import { useAuth } from "../../context/AuthContext";
import { useCurrency } from "../../context/CurrencyContext";
import { formatMoney } from "../../utils/formatMoney";
import { useNavigate, useLocation } from "react-router-dom";

function ProductDetails() {
  const { handle } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const { user } = useAuth();
  const { country } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Re-runs whenever `handle` changes (new product) OR `country` changes
  // (user switched currency) — both should re-fetch with fresh prices.
  useEffect(() => {
    setJustAdded(false);
    getProductById(handle, country).then((data) => {
      setProduct(data);
      if (data) {
        setSize(data.sizes[0]);
        setColor(data.colors[0]);
        setActiveImage(0);
        setQuantity(1);
      }
      getRelatedProducts(data, 4, country).then(setRelated);
    });
  }, [handle, country]);

  if (!product) {
    return (
      <div className="container section">
        <p>Loading…</p>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const onSale =
    product.compareAtPrice && product.compareAtPrice > product.price;

  function findSelectedVariant() {
    return product.variants.find((v) => {
      const sizeMatches = !size || v.options.size === size;
      const colorMatches = !color || v.options.color === color;
      return sizeMatches && colorMatches;
    });
  }

  const selectedVariant = findSelectedVariant();
  const canAddToCart = !!selectedVariant && selectedVariant.available;

  function handleAddToCart() {
    if (!user) {
      navigate("/login", {
        state: { from: location },
      });
      return;
    }

    if (!selectedVariant) {
      return;
    }

    addToCart(product, {
      size,
      color,
      quantity,
      variantId: selectedVariant.id,
    });
    setJustAdded(true);
  }

  return (
    <div className="container section product-details">
      <div className="pd-gallery">
        <div className="pd-main-image">
          <img src={product.images[activeImage]} alt={product.name} />
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
        <span className="eyebrow">{product.category}</span>
        <h1>{product.name}</h1>
        <p className="pd-price">
          {onSale && (
            <span className="price-strike">
              {formatMoney(product.compareAtPrice, product.currencyCode)}
            </span>
          )}
          <span className="price">
            {formatMoney(product.price, product.currencyCode)}
          </span>
        </p>
        <p className="pd-description">{product.description}</p>

        <VariantSelector
          label="Size"
          options={product.sizes}
          selected={size}
          onSelect={setSize}
        />
        <VariantSelector
          label="Color"
          options={product.colors}
          selected={color}
          onSelect={setColor}
        />

        <div className="pd-quantity-row">
          <span className="variant-label">Quantity</span>
          <QuantitySelector
            quantity={quantity}
            onIncrease={() =>
              setQuantity((q) => Math.min(q + 1, product.stock))
            }
            onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
            max={product.stock}
          />
        </div>

        <div className="pd-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
          >
            {selectedVariant && !selectedVariant.available
              ? "Out of Stock"
              : "Add to Cart"}
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

        <p className="pd-stock">{product.stock} in stock</p>
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