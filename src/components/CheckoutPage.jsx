import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import "./CheckoutPage.css";

const BACKEND_URL = "";

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
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!customer) {
      navigate("/login");
    }
  }, [customer]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function saveOrder(paymentStatus, selectedMethod = paymentMethod) {
    const orderPayload = {
      customerId: customer.id,
      customerName: formData.name,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cartTotal,
      paymentStatus: selectedMethod === "cod" ? "Cash on Delivery" : paymentStatus,
      paymentMethod: selectedMethod,
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      clearCart();
      navigate("/my-orders");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("We could not save your order. Please try again.");
    }
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === "cod") {
      try {
        await saveOrder("Pending", "cod");
        alert("Order placed successfully. Pay cash on delivery.");
        setLoading(false);
      } catch (error) {
        console.error("COD order error:", error);
        alert("We could not place your order. Please try again.");
        setLoading(false);
      }
      return;
    }

    try {
      const orderResponse = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.order_id) {
        alert("We could not create your order. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your Hardware Store",
        description: "Order Payment",
        order_id: orderData.order_id,
        handler: async function (response) {
          const verifyResponse = await fetch(`${BACKEND_URL}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            await saveOrder("Paid");
            alert("Payment successful! Order placed.");
          } else {
            alert("Payment could not be verified. Please contact support.");
          }
          setLoading(false);
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: "#2c7a2c",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (!customer) {
    return null;
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

      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Phone Number</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

          <label>Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} required />

          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />

          <label>Pincode</label>
          <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />

          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="payment-method-select"
          >
            <option value="online">Online Payment</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? "Processing..." : paymentMethod === "cod" ? `Place Order • ₹${cartTotal}` : `Pay ₹${cartTotal}`}
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