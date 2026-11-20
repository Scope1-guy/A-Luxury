import React from "react";
import { Link } from "react-router-dom";
import "./CategoryGrid.css";

function CategoryGrid({ categories }) {
  return (
    <div className="category-grid">
      {categories.map((category) => (
        <Link
          to={`/shop?category=${category.id}`}
          key={category.id}
          className="category-tile"
        >
          {category.image && (
            <img src={category.image} alt={category.name} loading="lazy" />
          )}
          <div className="category-tile-overlay">
            <h3>{category.name}</h3>
            <p>
              {category.count} {category.count === 1 ? "item" : "items"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CategoryGrid;
