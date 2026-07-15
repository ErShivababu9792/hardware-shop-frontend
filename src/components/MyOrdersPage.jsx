import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import "./MyOrdersPage.css";

const BACKEND_URL = "";

function MyOrdersPage() {
  const { customer } = useCustomerAuth();
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customer) {
      setLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/api/orders/customer/${customer.id}`)
      .then((res) => res.json())
      .then((data) => {
        setMyOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [customer]);

  if (!customer) {
    return (
      <div className="my-orders-page">
        <h2>Please login to view your orders</h2>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : myOrders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {myOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">{order.id}</span>
                <span className={`order-status-badge status-${order.orderStatus.toLowerCase().replace(/ /g, "-")}`}>
                  {order.orderStatus}
                </span>
              </div>

              <p className="order-date">Placed on {order.date}</p>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span>Payment: {order.paymentStatus}</span>
                <span className="order-total">Total: ₹{order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;