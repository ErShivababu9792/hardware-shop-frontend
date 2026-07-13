import { useCustomerAuth } from "../context/CustomerAuthContext";
import { Link } from "react-router-dom";
import "./MyOrders.css";

function MyOrders() {
  const { customer } = useCustomerAuth();

  if (!customer) {
    return (
      <div className="my-orders-page">
        <h2>My Orders</h2>
        <p>Order history dekhne ke liye pehle login karein.</p>
        <Link to="/login" className="login-redirect-link">Login karein</Link>
      </div>
    );
  }

  const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
  const myOrders = allOrders
    .filter((o) => o.customerEmail === customer.email)
    .reverse();

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>

      {myOrders.length === 0 ? (
        <p>Abhi tak koi order nahi kiya hai.</p>
      ) : (
        <div className="my-orders-list">
          {myOrders.map((order) => (
            <div key={order.id} className="my-order-card">
              <div className="my-order-header">
                <span className="my-order-id">{order.id}</span>
                <span className={`my-order-status status-${order.orderStatus.toLowerCase().replace(/ /g, "-")}`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="my-order-date">Placed on {order.date}</p>
              <ul className="my-order-items">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} x {item.quantity} — ₹{item.price * item.quantity}</li>
                ))}
              </ul>
              {order.trackingId && (
                <p className="my-order-tracking">Tracking ID: {order.trackingId}</p>
              )}
              <p className="my-order-total">Total: ₹{order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;