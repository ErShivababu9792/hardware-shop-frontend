import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./SearchPage.css";

const BACKEND_URL = "";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(
          data.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="search-page">
      <h2>Search results for "{query}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
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
    </div>
  );
}

export default SearchPage;