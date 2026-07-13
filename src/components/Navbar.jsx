import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shopInfo, categories } from "../shopData";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();
  const { customer, logout } = useCustomerAuth();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (searchText.trim() !== "") {
      navigate(`/search?q=${searchText}`);
    }
  }

  function handleCustomerLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <img src={shopInfo.logo} alt={shopInfo.name} className="navbar-logo" />

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>

        <div className="navbar-actions">
          <a href="tel:+911234567890" className="navbar-help">
            📞 Help: +91-1234567890
          </a>

          {customer ? (
            <div className="navbar-customer">
              <span>Hi, {customer.name.split(" ")[0]}</span>
              <button className="navbar-logout-btn" onClick={handleCustomerLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login" className="navbar-login-link">Login</Link>
          )}

          <Link to="/cart" className="navbar-cart">
            🛒 Cart <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>

      <div className="navbar-categories">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="navbar-category-item"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;