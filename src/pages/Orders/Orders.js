import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../services/authService";
import { formatMoney } from "../../utils/formatMoney";
import "./Orders.css";

function statusLabel(status) {
  if (!status) return "—";
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function Orders() {
  const [orders, setOrders] = useState(null); // null = still loading
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders(10)
      .then(setOrders)
      .catch((err) => setError(err.message || "Could not load your orders."));
  }, []);

  return (
    <div className="container section orders-page">
      <div className="section-head">
        <div>
          <span className="eyebrow">Account</span>
          <h1>Order History</h1>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      {!error && orders === null && <p>Loading your orders…</p>}

      {orders && orders.length === 0 && (
        <div className="empty-state">
          <h2>No orders yet</h2>
          <p>Everything you order will show up here.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-card-header">
                <div>
                  <h3>{order.name}</h3>
                  <p className="order-date">
                    {new Date(order.processedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="order-card-status">
                  <span className="badge">
                    {statusLabel(order.financialStatus)}
                  </span>
                  <span className="badge">
                    {statusLabel(order.fulfillmentStatus)}
                  </span>
                </div>
              </div>

              <ul className="order-line-items">
                {order.lineItems.map((item, index) => (
                  <li key={index} className="order-line-item">
                    {item.image && <img src={item.image} alt={item.title} />}
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>
                      {formatMoney(item.totalPrice, order.currencyCode)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="order-card-footer">
                <strong>
                  Total: {formatMoney(order.totalPrice, order.currencyCode)}
                </strong>
                {order.statusPageUrl && (
                  <a
                    href={order.statusPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View order details
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Orders;
