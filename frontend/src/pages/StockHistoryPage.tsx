import { useEffect, useState } from "react";
import { api } from "../api/api";
import type { StockAdjustment } from "../types";
import { formatAdjustmentType, formatDate } from "../utils/formatters";
import "./DashboardPages.css";

export default function StockHistoryPage() {
  const [history, setHistory] = useState<StockAdjustment[]>([]);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      const response = await api.get<StockAdjustment[]>("/api/stock/history");
      setHistory(response.data);
    } catch {
      setError("Could not load stock adjustment history.");
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Stock History</h1>
          <p>Track every stock-in, stock-out, and correction adjustment.</p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="card section-card">
        {history.length === 0 ? (
          <div className="empty-state">
            No stock adjustments have been recorded yet.
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.product?.name || "-"}</td>
                    <td>{item.product?.sku || "-"}</td>
                    <td>{formatAdjustmentType(item.adjustment_type)}</td>
                    <td>{item.quantity_changed}</td>
                    <td>{item.reason}</td>
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