import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import CartPage from "./components/CartPage";
import ProductDetail from "./components/ProductDetail";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import CategoryPage from "./components/CategoryPage";
import SearchPage from "./components/SearchPage";
import CheckoutPage from "./components/CheckoutPage";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import OrdersPage from "./components/OrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";

function App() {
  return (
    <CustomerAuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/admin" element={<AdminPanel />} />
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
        </BrowserRouter>
      </CartProvider>
    </CustomerAuthProvider>
  );
}

export default App;