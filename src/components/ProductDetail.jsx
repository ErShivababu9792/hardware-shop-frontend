import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../shopData";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const products = getProducts();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="product-detail">Product not found.</div>;
  }

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-detail-content">
        <img src={product.image} alt={product.name} className="product-detail-image" />

        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="product-detail-brand">Brand: {product.brand}</p>
          <p className="product-detail-price">₹{product.price} / {product.unit}</p>
          <p className="product-detail-stock">
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>
          <p className="product-detail-description">{product.description}</p>

          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;