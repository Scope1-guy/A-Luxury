import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import categories from "../../data/categories";
import { getAllProducts } from "../../services/productService";
import { useCurrency } from "../../context/CurrencyContext";
import { formatMoney } from "../../utils/formatMoney";
import "./Shop.css";

const PAGE_SIZE = 8;
const PRICE_MAX = 100350;

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { country } = useCurrency();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);

  // Re-runs whenever `country` changes, so switching currency re-fetches
  // with fresh prices.
  useEffect(() => {
    setLoading(true);
    getAllProducts(country).then((data) => {
      setAllProducts(data);
      setLoading(false);
    });
  }, [country]);

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    const filterParam = searchParams.get("filter");
    // productService lowercases every tag, so these checks must be
    // lowercase too, or they'll never match.
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
    result = result.filter((p) => p.price <= maxPrice);

    const sorted = [...result];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc")
      sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [allProducts, category, search, maxPrice, sortBy, searchParams]);

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
  }, [category, search, maxPrice, sortBy]);

  function handleCategoryChange(value) {
    setCategory(value);
    setSearchParams(value === "all" ? {} : { category: value });
  }

  // The price slider works in raw numbers regardless of currency, but its
  // label should still show the right symbol — borrow the currency code
  // off whatever product happens to be loaded, since Shopify only sends
  // currencyCode alongside an actual product, not as a standalone value.
  const displayCurrency = allProducts[0]?.currencyCode || "CAD";

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
              Max Price: {formatMoney(maxPrice, displayCurrency)}
            </label>
            <input
              id="shop-price"
              type="range"
              min="1020"
              max={PRICE_MAX}
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="filter-group">
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
          </div>
        </aside>

        <div className="shop-results">
          {loading ? (
            <p>Loading products…</p>
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