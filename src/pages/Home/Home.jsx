import React from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import Testimonials from "../../components/Testimonials/Testimonials";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useProducts } from "../../context/ProductsContext";
import "./Home.css";

function ProductRow({ eyebrow, title, viewAllHref, products }) {
  if (products.length === 0) return null;
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
  const { products, categories } = useProducts();

  const withTag = (tag) =>
    products.filter((p) => p.tags.includes(tag)).slice(0, 4);

  return (
    <div>
      <Hero />

      <ProductRow
        eyebrow="Editor's pick"
        title="Featured Collection"
        viewAllHref="/shop"
        products={withTag("featured")}
      />

      {categories.length > 0 && (
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
      )}

      {/* <ProductRow
        eyebrow="Just landed"
        title="New Arrivals"
        viewAllHref="/shop?filter=new"
        products={withTag("newarrival")}
      />

      <PromoBanner />

      <ProductRow
        eyebrow="Reader favorites"
        title="Best Sellers"
        viewAllHref="/shop?filter=bestseller"
        products={withTag("bestseller")}
      />

      <Testimonials /> */}
    </div>
  );
}

export default Home;
