import { useState, useEffect } from "react";
import { categories } from "../shopData";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Homepage.css";

const BACKEND_URL = "http://127.0.0.1:5000";

function Homepage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));

    fetch(`${BACKEND_URL}/api/banners`)
      .then((res) => res.json())
      .then((data) => setBanners(data))
      .catch((err) => console.error("Error fetching banners:", err));

    fetch(`${BACKEND_URL}/api/offers`)
      .then((res) => res.json())
      .then((data) => setOffers(data))
      .catch((err) => console.error("Error fetching offers:", err));
  }, []);

  return (
    <div className="homepage">
      {/* Banner */}
      {banners.length > 0 && (
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
      )}

      {/* Offers */}
      {offers.length > 0 && (
        <section className="offers-section">
          {offers.map((offer) => (
            <div key={offer.id} className="offer-badge">
              {offer.text}
            </div>
          ))}
        </section>
      )}

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
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found. Add some from the Admin Panel.</p>
        ) : (
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
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Homepage;