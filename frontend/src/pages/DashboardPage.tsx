import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import type { DashboardStats, Product } from "../types";
import {
  formatCurrency,
  getStockBadgeClass,
  getStockStatus,
} from "../utils/formatters";
import "./DashboardPages.css";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      const [statsResponse, productsResponse] = await Promise.all([
        api.get<DashboardStats>("/api/products/dashboard"),
        api.get<Product[]>("/api/products/"),
      ]);

      setStats(statsResponse.data);
      setProducts(productsResponse.data);
    } catch {
      setError("Could not load dashboard data.");
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const lowStockProducts = products.filter(
    (product) =>
      product.quantity <= product.reorder_level && product.quantity > 0
  );

  const categorySummary = useMemo(() => {
    const result: Record<string, number> = {};

    products.forEach((product) => {
      result[product.category] = (result[product.category] || 0) + 1;
    });

    return Object.entries(result).map(([category, count]) => ({
      category,
      count,
    }));
  }, [products]);

  const maxCategoryCount = Math.max(
    ...categorySummary.map((item) => item.count),
    1
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Real-time overview of your inventory performance.</p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="stats-grid stats-grid-five">
        <div className="card stat-card">
          <span>Total Products</span>
          <strong>{stats?.total_products ?? 0}</strong>
        </div>

        <div className="card stat-card">
          <span>Total Quantity</span>
          <strong>{stats?.total_quantity ?? 0}</strong>
        </div>

        <div className="card stat-card">
          <span>Low Stock</span>
          <strong>{stats?.low_stock_count ?? 0}</strong>
        </div>

        <div className="card stat-card">
          <span>Out of Stock</span>
          <strong>{stats?.out_of_stock_count ?? 0}</strong>
        </div>

        <div className="card stat-card">
          <span>Inventory Value</span>
          <strong>{formatCurrency(stats?.total_inventory_value ?? 0)}</strong>
        </div>
      </div>

      <div className="content-grid">
        <div className="card section-card">
          <h2>Low Stock Alerts</h2>

          {lowStockProducts.length === 0 ? (
            <div className="empty-state">No low-stock products right now.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Reorder Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.quantity}</td>
                      <td>{product.reorder_level}</td>
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

        <div className="card section-card">
          <h2>Products by Category</h2>

          {categorySummary.length === 0 ? (
            <div className="empty-state">No product data yet.</div>
          ) : (
            <div className="chart-list">
              {categorySummary.map((item) => (
                <div className="chart-row" key={item.category}>
                  <div className="chart-label">{item.category}</div>
                  <div className="chart-bar">
                    <span
                      style={{
                        width: `${(item.count / maxCategoryCount) * 100}%`,
                      }}
                    />
                  </div>
                  <strong>{item.count}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}