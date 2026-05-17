import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-logo">
          <span>I</span>
          <strong>Invento</strong>
        </div>

        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </header>

      <section className="hero-section">
        <div className="hero-text">
          <div className="hero-tag">Built for small businesses</div>
          <h1>Simple Inventory Management</h1>
          <p>
            Invento helps small teams track products, monitor stock levels,
            generate barcodes, and manage inventory without expensive or complex
            enterprise software.
          </p>

          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="hero-card card">
          <div className="hero-card-top">
            <span>Total Products</span>
            <strong>1,248</strong>
          </div>
          <div className="hero-card-grid">
            <div>
              <span>Low Stock</span>
              <strong>23</strong>
            </div>
            <div>
              <span>Inventory Value</span>
              <strong>$84.5k</strong>
            </div>
          </div>
          <div className="hero-bars">
            <span style={{ height: "65%" }}></span>
            <span style={{ height: "45%" }}></span>
            <span style={{ height: "78%" }}></span>
            <span style={{ height: "35%" }}></span>
            <span style={{ height: "90%" }}></span>
            <span style={{ height: "55%" }}></span>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="feature-card card">
          <h3>Product Management</h3>
          <p>Add, edit, delete, and search products from one clean inventory table.</p>
        </div>

        <div className="feature-card card">
          <h3>Stock Adjustment</h3>
          <p>Receive stock, reduce stock, and record corrections with a required reason.</p>
        </div>

        <div className="feature-card card">
          <h3>Barcode Generation</h3>
          <p>Generate product barcodes using SKU numbers directly from the item page.</p>
        </div>
      </section>
    </div>
  );
}