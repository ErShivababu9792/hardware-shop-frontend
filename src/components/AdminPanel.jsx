import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProducts, saveProducts, categories } from "../shopData";
import "./AdminPanel.css";

function AdminPanel() {
  const initialProducts = getProducts().map((p) => ({
    ...p,
    images: p.images || (p.image ? [p.image] : []),
  }));

  const [productList, setProductList] = useState(initialProducts);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: categories[0].id,
    brand: "",
    price: "",
    unit: "",
    stock: "",
    images: [],
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function readFilesAsDataURLs(files) {
    const arr = Array.from(files || []);
    return Promise.all(
      arr.map(
        (file) =>
          new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(fr.result);
            fr.onerror = rej;
            fr.readAsDataURL(file);
          })
      )
    );
  }

  function handleFileChange(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    readFilesAsDataURLs(files).then((urls) => {
      setFormData((fd) => ({ ...fd, images: [...(fd.images || []), ...urls] }));
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      setProductList(
        productList.map((p) =>
          p.id === editingId
            ? { ...formData, id: editingId, price: Number(formData.price), stock: Number(formData.stock) }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      setProductList([...productList, newProduct]);
    }
    setFormData({ name: "", categoryId: categories[0].id, brand: "", price: "", unit: "", stock: "", images: [], description: "" });
  }

  function handleEdit(product) {
    setFormData(product);
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id) {
    if (window.confirm("Kya aap is product ko delete karna chahte hain?")) {
      setProductList(productList.filter((p) => p.id !== id));
    }
  }

  useEffect(() => {
    saveProducts(productList);
  }, [productList]);

  // Modal gallery state
  const [gallery, setGallery] = useState({ open: false, images: [], index: 0 });

  function openGallery(images, index = 0) {
    setGallery({ open: true, images, index });
  }

  function closeGallery() {
    setGallery({ open: false, images: [], index: 0 });
  }

  function prevImage() {
    setGallery((g) => ({ ...g, index: (g.index - 1 + g.images.length) % g.images.length }));
  }

  function nextImage() {
    setGallery((g) => ({ ...g, index: (g.index + 1) % g.images.length }));
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ name: "", categoryId: categories[0].id, brand: "", price: "", unit: "", stock: "", images: [], description: "" });
  }

  function handleLogout() {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login");
  }

  function updateStock(id, change) {
    setProductList(
      productList.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + change) } : p
      )
    );
  }

  const totalStock = productList.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = productList.filter((p) => p.stock < 10);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">Admin Panel</div>
        <nav className="sidebar-nav">
          <Link to="/admin" className={`sidebar-nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
            Products
          </Link>
          <Link to="/admin/orders" className={`sidebar-nav-item ${location.pathname === "/admin/orders" ? "active" : ""}`}>
            Orders
          </Link>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1>Products</h1>
          <p>Manage your hardware shop inventory</p>
        </div>

        {lowStockProducts.length > 0 && (
          <div className="low-stock-alert">
            ⚠️ {lowStockProducts.length} product(s) are running low on stock —{" "}
            {lowStockProducts.map((p) => p.name).join(", ")}
          </div>
        )}

        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-label">Total products</span>
            <span className="stat-value">{productList.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total stock units</span>
            <span className="stat-value">{totalStock}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Low stock (below 10)</span>
            <span className="stat-value stat-warning">{lowStockProducts.length}</span>
          </div>
        </div>

        <div className="admin-grid">
          <div className="admin-card form-card">
            <h2>{editingId ? "Edit product" : "Add new product"}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <label>Product name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />

              <label>Category</label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <label>Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} />

              <div className="form-row">
                <div>
                  <label>Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div>
                  <label>Unit</label>
                  <input type="text" name="unit" placeholder="1 piece" value={formData.unit} onChange={handleChange} />
                </div>
              </div>

              <label>Stock quantity</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />

              <label>Upload images</label>
              <input type="file" name="images" accept="image/*" multiple onChange={handleFileChange} />

              {formData.images && formData.images.length > 0 && (
                <div className="image-previews">
                  {formData.images.map((src, idx) => (
                    <div className="preview-item" key={idx}>
                      <img src={src} alt={`preview-${idx}`} />
                      <button type="button" className="remove-preview" onClick={() => {
                        setFormData((fd) => ({ ...fd, images: fd.images.filter((_, i) => i !== idx) }));
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />

              <div className="admin-form-buttons">
                <button type="submit" className="save-btn">
                  {editingId ? "Update product" : "Add product"}
                </button>
                {editingId && (
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-card list-card">
            <h2>All products ({productList.length})</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((product) => (
                    <tr key={product.id}>
                          <td>
                            <img
                              src={(product.images && product.images[0]) || product.image}
                              alt={product.name}
                              style={{ cursor: (product.images && product.images.length) ? 'pointer' : 'default' }}
                              onClick={() => {
                                if (product.images && product.images.length) openGallery(product.images, 0);
                              }}
                            />
                          </td>
                      <td>{product.name}</td>
                      <td>{categories.find((c) => c.id === product.categoryId)?.name}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <div className="stock-quick-edit">
                          <button onClick={() => updateStock(product.id, -1)}>−</button>
                          <span className={`stock-badge ${product.stock < 10 ? "low" : ""}`}>
                            {product.stock}
                          </span>
                          <button onClick={() => updateStock(product.id, 1)}>+</button>
                        </div>
                      </td>
                      <td className="actions-cell">
                        <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      {gallery.open && (
        <div className="image-modal" onClick={closeGallery}>
          <div className="image-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeGallery}>✕</button>
            <img src={gallery.images[gallery.index]} alt={`img-${gallery.index}`} />
            <div className="modal-controls">
              <button onClick={prevImage}>‹ Prev</button>
              <button onClick={nextImage}>Next ›</button>
            </div>
            <div className="modal-thumbs">
              {gallery.images.map((src, i) => (
                <img key={i} src={src} className={i === gallery.index ? 'active' : ''} onClick={() => setGallery((g) => ({ ...g, index: i }))} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;