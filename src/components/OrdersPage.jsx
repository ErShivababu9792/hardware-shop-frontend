import React, { useEffect, useState } from "react";
import "./OrdersPage.css";

const STATUS_FLOW = [
  "New",
  "Accepted",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function OrdersPage() {
  const [orderList, setOrderList] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  function loadOrders() {
    const savedOrders = JSON.parse(localStorage.getItem("allOrders")) || [];

    const formattedOrders = savedOrders
      .map((o) => ({
        ...o,
        orderStatus: o.orderStatus || "New",
        trackingId: o.trackingId || "",
        note: o.note || "",
      }))
      .reverse();

    setOrderList(formattedOrders);
  }

  function saveOrders(updatedOrders) {
    setOrderList(updatedOrders);

    localStorage.setItem(
      "allOrders",
      JSON.stringify([...updatedOrders].reverse())
    );
  }

  function updateStatus(orderId, newStatus) {
    const updated = orderList.map((order) =>
      order.id === orderId
        ? {
            ...order,
            orderStatus: newStatus,
          }
        : order
    );

    saveOrders(updated);
  }

  function updateTracking(orderId, trackingId) {
    const updated = orderList.map((order) =>
      order.id === orderId
        ? {
            ...order,
            trackingId,
          }
        : order
    );

    saveOrders(updated);
  }

  function updateNote(orderId, note) {
    const updated = orderList.map((order) =>
      order.id === orderId
        ? {
            ...order,
            note,
          }
        : order
    );

    saveOrders(updated);
  }

  function rejectOrder(orderId) {
    if (!window.confirm("Kya aap order cancel karna chahte hain?")) return;

    const updated = orderList.map((order) =>
      order.id === orderId
        ? {
            ...order,
            orderStatus: "Cancelled",
          }
        : order
    );

    saveOrders(updated);
  }

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id);
  }

  const totalRevenue = orderList
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0);

  const newOrders = orderList.filter((o) => o.orderStatus === "New").length;

  return (
    <div className="orders-page">
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{orderList.length}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Payment Received</span>
          <span className="stat-value">₹{totalRevenue}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">New Orders</span>
          <span className="stat-value stat-warning">{newOrders}</span>
        </div>
      </div>

      <div className="orders-card">
        <h2>All Orders</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orderList.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    Abhi tak koi order nahi hai
                  </td>
                </tr>
              )}

              {orderList.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.date}</td>
                    <td>₹{order.total}</td>
                    <td>
                      <span
                        className={`payment-badge ${
                          order.paymentStatus === "Paid" ? "paid" : "unpaid"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {order.orderStatus === "Cancelled" ? (
                        <span className="status-select status-cancelled">
                          Cancelled
                        </span>
                      ) : (
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`status-select status-${order.orderStatus
                            .toLowerCase()
                            .replace(/ /g, "-")}`}
                        >
                          {STATUS_FLOW.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => toggleExpand(order.id)}
                      >
                        {expandedId === order.id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {expandedId === order.id && (
                    <tr className="order-details-row">
                      <td colSpan="7">
                        <div className="order-details">
                          <p>
                            <strong>Phone:</strong> {order.phone}
                          </p>
                          <p>
                            <strong>Address:</strong> {order.address}
                          </p>
                          <p>
                            <strong>Items:</strong>
                          </p>
                          <ul>
                            {order.items.map((item, idx) => (
                              <li key={idx}>
                                {item.name} x {item.quantity} — ₹
                                {item.price * item.quantity}
                              </li>
                            ))}
                          </ul>

                          <div className="order-extra-fields">
                            <div>
                              <label>Tracking ID</label>
                              <input
                                type="text"
                                placeholder="Courier tracking number"
                                value={order.trackingId}
                                onChange={(e) =>
                                  updateTracking(order.id, e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <label>Internal note</label>
                              <input
                                type="text"
                                placeholder="e.g. customer wants evening delivery"
                                value={order.note}
                                onChange={(e) =>
                                  updateNote(order.id, e.target.value)
                                }
                              />
                            </div>
                          </div>

                          {order.orderStatus !== "Cancelled" &&
                            order.orderStatus !== "Delivered" && (
                              <button
                                className="reject-btn"
                                onClick={() => rejectOrder(order.id)}
                              >
                                Reject / Cancel Order
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;