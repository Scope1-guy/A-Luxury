// Turns raw rows (from the Google Sheet CSV or the sample data) into the
// product objects the rest of the app uses.

import Papa from "papaparse";
import { SHEET_CSV_URL } from "../config";
import sampleProducts from "../data/sampleProducts";

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return NaN;
  if (typeof value === "number") return value;
  return parseFloat(String(value).replace(/[^0-9.]/g, ""));
}

// "S, M, L" -> ["S", "M", "L"]
function splitList(value) {
  if (Array.isArray(value)) return value;
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Image links can be separated by a "|", a space, or a new line. (A comma is
// NOT a separator because Cloudinary links can contain commas.)
function splitImages(value) {
  if (Array.isArray(value)) return value;
  return String(value || "")
    .split(/[\s|]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Sheet column headers are matched loosely: "Compare At Price",
// "compare_at_price" and "compare-at-price" are all the same column.
function normalizeKeys(row) {
  const out = {};
  Object.keys(row).forEach((key) => {
    const clean = key
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, "_");
    out[clean] = row[key];
  });
  return out;
}

export function rowToProduct(rawRow) {
  const row = normalizeKeys(rawRow);

  const name = String(row.name || "").trim();
  const price = toNumber(row.price);
  if (!name || Number.isNaN(price)) return null;

  const compareAt = toNumber(row.compare_at_price);
  const images = splitImages(row.images);
  const categoryName = String(row.category || "").trim();
  const stockNumber = toNumber(row.stock);

  return {
    id: slugify(row.id || name),
    name,
    category: slugify(categoryName),
    categoryName,
    price,
    compareAtPrice: !Number.isNaN(compareAt) && compareAt > price ? compareAt : null,
    description: String(row.description || "").trim(),
    images,
    image: images[0] || "",
    sizes: splitList(row.sizes),
    colors: splitList(row.colors),
    // Blank stock = available. 0 = out of stock.
    stock: Number.isNaN(stockNumber) ? 99 : Math.max(0, Math.floor(stockNumber)),
    tags: splitList(row.tags).map((t) => t.toLowerCase()),
  };
}

function finalize(products) {
  // Make sure every id is unique (it is used in the product page URL).
  const seen = new Map();
  return products.map((p) => {
    const count = (seen.get(p.id) || 0) + 1;
    seen.set(p.id, count);
    return count === 1 ? p : { ...p, id: `${p.id}-${count}` };
  });
}

export function parseCsv(text) {
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
  return finalize(data.map(rowToProduct).filter(Boolean));
}

function prettyCategory(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function loadSample() {
  return finalize(
    sampleProducts
      .map((p) =>
        rowToProduct({
          ...p,
          category: prettyCategory(p.category),
          tags: p.tags.join(","),
          sizes: p.sizes.join(","),
          colors: p.colors.join(","),
          images: p.images.join("|"),
          compare_at_price: p.compareAtPrice ?? "",
        })
      )
      .filter(Boolean)
  );
}

export async function fetchProducts() {
  // No sheet configured yet -> use the built-in sample products.
  if (!SHEET_CSV_URL) return loadSample();

  const response = await fetch(SHEET_CSV_URL);
  if (!response.ok) {
    throw new Error(`Could not load products (HTTP ${response.status})`);
  }
  const text = await response.text();
  return parseCsv(text);
}

// Categories are built from the products themselves, so the client creates a
// new category just by typing it in the "category" column of the sheet.
export function buildCategories(products) {
  const map = new Map();
  products.forEach((p) => {
    if (!p.category) return;
    if (!map.has(p.category)) {
      map.set(p.category, {
        id: p.category,
        name: p.categoryName,
        image: p.image,
        count: 0,
      });
    }
    const entry = map.get(p.category);
    entry.count += 1;
    if (!entry.image && p.image) entry.image = p.image;
  });
  return Array.from(map.values());
}
