import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import "./CheckoutPage.css";

const BACKEND_URL = "http://127.0.0.1:5000";

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (!customer) {
      navigate("/login");
    }
  }, [customer, navigate]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function saveOrder(paymentStatus) {
    const newOrder = {
      id: "ORD" + Date.now(),
      customerEmail: customer.email,
      customerName: formData.name || customer.name,
      phone: formData.phone || customer.phone,
      address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: cartTotal,
      paymentMethod,
      paymentStatus,
      orderStatus: "New",
      date: new Date().toISOString().split("T")[0],
      trackingId: "",
      note: "",
    };

    const existingOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    existingOrders.push(newOrder);
    localStorage.setItem("allOrders", JSON.stringify(existingOrders));

    clearCart();
    navigate("/");
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();

    if (loading) return;

    if (paymentMethod === "cod") {
      saveOrder("Pending");
      alert("Order placed successfully!");
      return;
    }

    setLoading(true);

    try {
      if (!window.Razorpay) {
        throw new Error(
          "Payment gateway is not loaded. Refresh the page and try again.",
        );
      }

      const orderResponse = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: cartTotal,
        }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(
          `Unable to create order: ${errorText || orderResponse.statusText}`,
        );
      }

      const orderData = await orderResponse.json();

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Hardware Shop",
        description: "Order Payment",
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `${BACKEND_URL}/api/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              console.error("Payment verification failed:", verifyData);
              alert("Payment Verification Failed");
              return;
            }

            saveOrder("Paid");
            alert("Payment Successful!");
          } catch (err) {
            console.error(err);
            alert("Verification Error");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
          email: customer.email,
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

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error(response.error);
        alert(response.error.description || "Payment failed.");
        setLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment error");
      setLoading(false);
    }
  }
  if (!customer) return null;

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

          <label>Payment Method</label>

          <div className="payment-method">
            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay Online
            </label>
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading
              ? "Processing..."
              : paymentMethod === "cod"
                ? "Place Order"
                : `Pay ₹${cartTotal}`}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>
                {item.name} × {item.quantity}
              </span>

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
