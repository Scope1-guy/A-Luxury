import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import CurrencySelector from "../CurrencySelector/CurrencySelector";
import "./Header.css";

const navLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <span className="fold-mark" aria-hidden="true">
            <img src="/IMG-20260704-WA0028.jpg" alt="a-luxury-logo" />
          </span>
          A-LUXURY
        </Link>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Only visible inside the mobile dropdown (hidden on desktop via
              CSS) — Wishlist and Profile/Login move here on small screens
              so the top bar can stay short. */}
          <div className="mobile-extra-links">
            <Link
              to="/wishlist"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Wishlist
              {wishlistItems.length > 0 && (
                <span className="count-badge">{wishlistItems.length}</span>
              )}
            </Link>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {isAuthenticated ? "Profile" : "Login"}
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <CurrencySelector />

          {/* Mobile-only quick link — hidden on desktop via CSS, since
              "Shop" is already reachable there through the main nav. */}
          <Link to="/shop" className="icon-link shop-quicklink">
            Shop
          </Link>

          <Link to="/wishlist" className="icon-link-wish" aria-label="Wishlist">
            Wishlist
            {wishlistItems.length > 0 && (
              <span className="count-badge">{wishlistItems.length}</span>
            )}
          </Link>
          <Link to="/cart" className="icon-link" aria-label="Cart">
            Cart
            {itemCount > 0 && <span className="count-badge">{itemCount}</span>}
          </Link>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className="icon-link-account"
          >
            {isAuthenticated ? "Profile" : "Login"}
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
