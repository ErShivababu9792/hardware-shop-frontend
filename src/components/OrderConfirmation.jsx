import { useLocation, Link } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || "N/A";

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your order. We've received it and will process it shortly.</p>
        <p className="confirmation-order-id">Order ID: {orderId}</p>

        <div className="confirmation-actions">
          <Link to="/my-orders" className="confirmation-btn primary">View My Orders</Link>
          <Link to="/" className="confirmation-btn secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;