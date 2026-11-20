import React from "react";
import { Link } from "react-router-dom";
import { isWhatsAppConfigured, whatsappLink } from "../../lib/whatsapp";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="logo">
            A-LUXURY
          </Link>
          <p>Considered clothing, made to last.</p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>
              <Link to="/shop">All Products</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/shop?filter=new">New Arrivals</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Order</h4>
          <ul>
            <li>
              <Link to="/cart">Your Cart</Link>
            </li>
            {isWhatsAppConfigured() && (
              <li>
                <a
                  href={whatsappLink("Hello A-LUXURY, I have a question.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} A-LUXURY. All rights reserved.</span>
      </div>
    </footer>
  );
}

export default Footer;
