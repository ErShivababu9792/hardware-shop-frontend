import { useState } from "react";
import { banners, offers, categories, products } from "../shopData";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Homepage.css";

function Homepage() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState("");

  function handleAddToCart(product) {
    addToCart(product);
    setToastMessage(`✅ ${product.name} added to cart`);

    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  }

  return (
    <div className="homepage">
      {toastMessage && <div className="cart-toast">{toastMessage}</div>}

      {/* Banner */}
      <section className="banner-section">
        {banners.map((banner) => (
          <div key={banner.id} className="banner-card">
            <img src={banner.image} alt={banner.title} />
            <div className="banner-text">
              <h2>{banner.title}</h2>
              <p>{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Offers */}
      <section className="offers-section">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-badge">
            {offer.text}
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="category-list">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="category-card">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <h2>All Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
              </Link>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">₹{product.price} / {product.unit}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Homepage;