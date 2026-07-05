import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="container not-found">
      <span className="fold-mark not-found-mark" aria-hidden="true"></span>
      <h1>404</h1>
      <p>This page has been folded away. Let's get you back on track.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}

export default NotFound;
