import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import CartPage from "./components/CartPage";
import ProductDetail from "./components/ProductDetail";
import CategoryPage from "./components/CategoryPage";
import SearchPage from "./components/SearchPage";
import CheckoutPage from "./components/CheckoutPage";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import OrdersPage from "./components/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerSignup from "./components/CustomerSignup";
import CustomerLogin from "./components/CustomerLogin";

import { CartProvider } from "./context/CartContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/login" element={<CustomerLogin />} />

        <Route path="/admin-login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </CustomerAuthProvider>
  );
}