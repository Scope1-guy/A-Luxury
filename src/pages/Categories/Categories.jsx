import React from "react";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import { useProducts } from "../../context/ProductsContext";
import "./Categories.css";

function Categories() {
  const { categories, loading } = useProducts();

  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Browse</span>
          <h1>Categories</h1>
        </div>
      </div>
      {loading ? <p>Loading…</p> : <CategoryGrid categories={categories} />}
    </div>
  );
}

export default Categories;
