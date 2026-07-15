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
const BACKEND_URL = "";

function OrdersPage() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/orders`)
      .then((res) => res.json())
      .then((data) => {
        const formattedOrders = (Array.isArray(data) ? data : []).map((order) => ({
          ...order,
          orderStatus: order.orderStatus || "New",
          trackingId: order.trackingId || "",
          note: order.note || "",
        }));
        setOrderList(formattedOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }

  async function updateStatus(orderId, newStatus) {
    const order = orderList.find((item) => item.id === orderId);
    if (!order) return;

    try {
      await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...order, orderStatus: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  async function updateTracking(orderId, trackingId) {
    setOrderList((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, trackingId } : order))
    );
  }

  async function saveTracking(orderId) {
    const order = orderList.find((item) => item.id === orderId);
    if (!order) return;

    try {
      await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch (err) {
      console.error("Error saving tracking:", err);
    }
  }

  async function updateNote(orderId, note) {
    setOrderList((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, note } : order))
    );
  }

  async function saveNote(orderId) {
    const order = orderList.find((item) => item.id === orderId);
    if (!order) return;

    try {
      await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch (err) {
      console.error("Error saving note:", err);
    }
  }

  async function rejectOrder(orderId) {
    if (window.confirm("Do you want to reject or cancel this order?")) {
      await updateStatus(orderId, "Cancelled");
    }
  }

  function toggleExpand(orderId) {
    setExpandedId((prev) => (prev === orderId ? null : orderId));
  }

  const totalRevenue = orderList
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const newOrdersCount = orderList.filter((order) => order.orderStatus === "New").length;

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
          <span className="stat-value stat-warning">{newOrdersCount}</span>
        </div>
      </div>

      <div className="orders-card">
        <h2>All Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
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
                      No orders yet.
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
                          className={`payment-badge ${order.paymentStatus === "Paid" ? "paid" : "unpaid"}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        {order.orderStatus === "Cancelled" ? (
                          <span className="status-select status-cancelled">Cancelled</span>
                        ) : (
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`status-select status-${order.orderStatus.toLowerCase().replace(/ /g, "-")}`}
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
                        <button className="view-btn" onClick={() => toggleExpand(order.id)}>
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
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.name} x {item.quantity} — ₹{item.price * item.quantity}
                                </li>
                              ))}
                            </ul>

                            <div className="order-extra-fields">
                              <div>
                                <label>Tracking ID</label>
                                <input
                                  type="text"
                                  placeholder="Courier tracking number"
                                  value={order.trackingId || ""}
                                  onChange={(e) => updateTracking(order.id, e.target.value)}
                                  onBlur={() => saveTracking(order.id)}
                                />
                              </div>
                              <div>
                                <label>Internal note</label>
                                <input
                                  type="text"
                                  placeholder="e.g. customer wants evening delivery"
                                  value={order.note || ""}
                                  onChange={(e) => updateNote(order.id, e.target.value)}
                                  onBlur={() => saveNote(order.id)}
                                />
                              </div>
                            </div>

                            {order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                              <button className="reject-btn" onClick={() => rejectOrder(order.id)}>
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
        )}
      </div>
    </div>
  );
}

export default OrdersPage;