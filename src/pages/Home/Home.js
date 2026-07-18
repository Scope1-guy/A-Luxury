import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import Testimonials from "../../components/Testimonials/Testimonials";
import Newsletter from "../../components/Newsletter/Newsletter";
import ProductCard from "../../components/ProductCard/ProductCard";
import categories from "../../data/categories";
import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
} from "../../services/productService";
import { useCurrency } from "../../context/CurrencyContext";
import "./Home.css";

function ProductRow({ eyebrow, title, viewAllHref, products }) {
  return (
    <section className="section product-row">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <Link to={viewAllHref} className="btn btn-ghost">
            View All
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Home() {
  const { country } = useCurrency();
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  // Re-runs whenever `country` changes too, so switching currency updates
  // the prices shown in these rows.
  useEffect(() => {
    getFeaturedProducts(country).then(setFeatured);
    getNewArrivals(country).then(setNewArrivals);
    getBestSellers(country).then(setBestSellers);
  }, [country]);

  return (
    <div>
      <Hero />

      <ProductRow
        eyebrow="Editor's pick"
        title="Featured Collection"
        viewAllHref="/shop"
        products={featured}
      />

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shop by category</span>
              <h2>Categories</h2>
            </div>
            <Link to="/categories" className="btn btn-ghost">
              View All
            </Link>
          </div>
          <CategoryGrid categories={categories.slice(0, 3)} />
        </div>
      </section>

      <ProductRow
        eyebrow="Just landed"
        title="New Arrivals"
        viewAllHref="/shop?filter=new"
        products={newArrivals}
      />

      <PromoBanner />

      <ProductRow
        eyebrow="Reader favorites"
        title="Best Sellers"
        viewAllHref="/shop?filter=bestseller"
        products={bestSellers}
      />

      <Testimonials />
      <Newsletter />
    </div>
  );
}

export default Home;