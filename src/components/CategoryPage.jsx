import { useParams, Link } from "react-router-dom";
import { getProducts, categories } from "../shopData";
import { useCart } from "../context/CartContext";
import "./CategoryPage.css";

function CategoryPage() {
  const { categoryId } = useParams();
  const { addToCart } = useCart();

  const products = getProducts();
  const category = categories.find((c) => c.id === categoryId);
  const filteredProducts = products.filter((p) => p.categoryId === categoryId);

  return (
    <div className="category-page">
      <h2>{category ? category.name : "Category"}</h2>

      {filteredProducts.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
              </Link>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">
                ₹{product.price} / {product.unit}
              </p>
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

export default CategoryPage;
