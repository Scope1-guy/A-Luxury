import React from 'react';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid';
import categories from '../../data/categories';
import './Categories.css';

function Categories() {
  return (
    <div className="container section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Browse</span>
          <h1>Categories</h1>
        </div>
      </div>
      <CategoryGrid categories={categories} />
    </div>
  );
}

export default Categories;
