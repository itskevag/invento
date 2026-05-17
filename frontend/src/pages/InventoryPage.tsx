import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import type { Product } from "../types";
import { CATEGORIES } from "../types";
import {
  formatCurrency,
  getStockBadgeClass,
  getStockStatus,
} from "../utils/formatters";
import "./DashboardPages.css";

export default function InventoryPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      const response = await api.get<Product[]>("/api/products/");
      setProducts(response.data);
    } catch {
      setError("Could not load inventory.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.supplier?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>Manage products, stock levels, prices, and barcodes.</p>
        </div>

        <Link to="/inventory/create" className="btn btn-primary">
          + Create Item
        </Link>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card section-card">
        <div className="toolbar">
          <input
            className="input"
            placeholder="Search by name, SKU, or supplier..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            No products found. Create your first inventory item.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Supplier</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="clickable-row"
                    onClick={() => navigate(`/inventory/${product.id}`)}
                  >
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>{product.supplier || "-"}</td>
                    <td>{product.quantity}</td>
                    <td>{formatCurrency(product.unit_price)}</td>
                    <td>{product.location || "-"}</td>
                    <td>
                      <span className={getStockBadgeClass(product)}>
                        {getStockStatus(product)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}