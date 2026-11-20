import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import { useProducts } from "../../context/ProductsContext";
import { formatMoney } from "../../utils/formatMoney";
import "./Shop.css";

const PAGE_SIZE = 8;

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, loading, error, reload } = useProducts();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [maxPrice, setMaxPrice] = useState(null); // null = "no limit yet"
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);

  // Keep the category dropdown in sync when the URL changes (e.g. clicking a
  // category tile while already on the shop page).
  const categoryParam = searchParams.get("category");
  useEffect(() => {
    setCategory(categoryParam || "all");
  }, [categoryParam]);

  // The price slider's top end is the most expensive product in the catalog.
  const priceCeiling = useMemo(
    () => Math.ceil(products.reduce((max, p) => Math.max(max, p.price), 0)),
    [products]
  );
  const activeMax =
    maxPrice === null ? priceCeiling : Math.min(maxPrice, priceCeiling);
  const priceStep = Math.max(1, Math.round(priceCeiling / 50));

  const filteredProducts = useMemo(() => {
    let result = products;

    const filterParam = searchParams.get("filter");
    if (filterParam === "new")
      result = result.filter((p) => p.tags.includes("newarrival"));
    if (filterParam === "bestseller")
      result = result.filter((p) => p.tags.includes("bestseller"));

    if (category !== "all")
      result = result.filter((p) => p.category === category);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(term));
    }
    result = result.filter((p) => p.price <= activeMax);

    const sorted = [...result];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc")
      sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [products, category, search, activeMax, sortBy, searchParams]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );
  const pageProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [category, search, activeMax, sortBy]);

  function handleCategoryChange(value) {
    setCategory(value);
    setSearchParams(value === "all" ? {} : { category: value });
  }

  return (
    <div className="container shop-page section">
      <div className="section-head">
        <div>
          <span className="eyebrow">Shop</span>
          <h1>All Products</h1>
        </div>
      </div>

      <div className="shop-layout">
        <aside className="shop-filters">
          <div className="filter-group">
            <label htmlFor="shop-search">Search</label>
            <input
              id="shop-search"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="shop-category">Category</label>
            <select
              id="shop-category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="shop-price">
              Max Price: {formatMoney(activeMax)}
            </label>
            <input
              id="shop-price"
              type="range"
              min="0"
              max={priceCeiling}
              step={priceStep}
              value={activeMax}
              disabled={priceCeiling === 0}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          {/* <div className="filter-group">
            <label htmlFor="shop-sort">Sort By</label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div> */}
        </aside>

        <div className="shop-results">
          {loading ? (
            <p>Loading products…</p>
          ) : error ? (
            <div className="empty-state">
              <h2>We couldn't load the products</h2>
              <p>Please check your connection and try again.</p>
              <button className="btn btn-primary" onClick={reload}>
                Try again
              </button>
            </div>
          ) : pageProducts.length === 0 ? (
            <div className="empty-state">
              <h2>No products match your filters</h2>
              <p>Try widening your price range or clearing the search.</p>
            </div>
          ) : (
            <>
              <p className="shop-result-count">
                {filteredProducts.length} products
              </p>
              <div className="product-grid">
                {pageProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
