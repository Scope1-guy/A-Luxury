import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { useAuth } from "../../context/AuthContext";

function Footer() {
  const { user } = useAuth();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="logo">
            {/* <span className="fold-mark" aria-hidden="true"></span> */}
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
          <h4>Account</h4>
          <ul>
            <li>{!user && <Link to="/login">Login</Link>}</li>
            <li>{!user && <Link to="/register">Register</Link>}</li>
            <li>{user && <Link to="/profile">Profile</Link>}</li>
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
