import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import "./CheckoutPage.css";

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        name: customer.name || "",
        phone: customer.phone || "",
      }));
    }
  }, [customer]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handlePlaceOrder(e) {
    e.preventDefault();

    const existingOrders = JSON.parse(localStorage.getItem("allOrders")) || [];

    const newOrder = {
      id: "ORD" + Date.now(),
      customerName: formData.name,
      customerEmail: customer ? customer.email : null,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      date: new Date().toLocaleDateString("en-IN"),
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cartTotal,
      paymentStatus: "Paid",
      orderStatus: "New",
      trackingId: "",
      note: "",
    };

    existingOrders.push(newOrder);
    localStorage.setItem("allOrders", JSON.stringify(existingOrders));

    clearCart();

    alert("Order placed! (Payment integration baad mein add hoga)");
    navigate("/");
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Your cart is empty</h2>
        <p>Add some products before checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {customer && (
        <p className="checkout-logged-in-note">
          Logged in as <strong>{customer.email}</strong> — details auto-filled hain, chaho to edit kar sakte ho.
        </p>
      )}

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <label>City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />

          <button type="submit" className="place-order-btn">
            Place Order (₹{cartTotal})
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;