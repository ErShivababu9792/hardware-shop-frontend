import { useState, useEffect } from "react";
import "./ContentPage.css";

const BACKEND_URL = "http://127.0.0.1:5000";

function ContentPage() {
  const [banners, setBanners] = useState([]);
  const [offers, setOffers] = useState([]);
  const [bannerForm, setBannerForm] = useState({ image: "", title: "", subtitle: "" });
  const [offerForm, setOfferForm] = useState({ text: "" });

  useEffect(() => {
    fetchContent();
  }, []);

  function fetchContent() {
    fetch(`${BACKEND_URL}/api/banners`).then((res) => res.json()).then(setBanners);
    fetch(`${BACKEND_URL}/api/offers`).then((res) => res.json()).then(setOffers);
  }

  async function handleAddBanner(e) {
    e.preventDefault();
    await fetch(`${BACKEND_URL}/api/banners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bannerForm),
    });
    setBannerForm({ image: "", title: "", subtitle: "" });
    fetchContent();
  }

  async function handleDeleteBanner(id) {
    if (window.confirm("Delete this banner?")) {
      await fetch(`${BACKEND_URL}/api/banners/${id}`, { method: "DELETE" });
      fetchContent();
    }
  }

  async function handleAddOffer(e) {
    e.preventDefault();
    await fetch(`${BACKEND_URL}/api/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offerForm),
    });
    setOfferForm({ text: "" });
    fetchContent();
  }

  async function handleDeleteOffer(id) {
    if (window.confirm("Delete this offer?")) {
      await fetch(`${BACKEND_URL}/api/offers/${id}`, { method: "DELETE" });
      fetchContent();
    }
  }

  return (
    <div className="content-page">
      <h1>Homepage Content</h1>
      <p className="content-subtitle">Manage banners and offers shown on the homepage</p>

      <div className="content-grid">
        <div className="content-card">
          <h2>Banners</h2>
          <form className="content-form" onSubmit={handleAddBanner}>
            <label>Image URL</label>
            <input
              type="text"
              value={bannerForm.image}
              onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
              required
            />
            <label>Title</label>
            <input
              type="text"
              value={bannerForm.title}
              onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
              required
            />
            <label>Subtitle</label>
            <input
              type="text"
              value={bannerForm.subtitle}
              onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
            />
            <button type="submit" className="save-btn">Add Banner</button>
          </form>

          <div className="content-list">
            {banners.map((b) => (
              <div key={b.id} className="content-item">
                <img src={b.image} alt={b.title} />
                <div className="content-item-info">
                  <strong>{b.title}</strong>
                  <span>{b.subtitle}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteBanner(b.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h2>Offers</h2>
          <form className="content-form" onSubmit={handleAddOffer}>
            <label>Offer text</label>
            <input
              type="text"
              value={offerForm.text}
              onChange={(e) => setOfferForm({ text: e.target.value })}
              required
            />
            <button type="submit" className="save-btn">Add Offer</button>
          </form>

          <div className="content-list">
            {offers.map((o) => (
              <div key={o.id} className="content-item">
                <div className="content-item-info">
                  <span>{o.text}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteOffer(o.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentPage;