import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import type { Product, ProductFormData, StockAdjustment } from "../types";
import { CATEGORIES } from "../types";
import BarcodePreview from "../components/BarcodePreview";
import {
  formatAdjustmentType,
  formatDate,
  getStockBadgeClass,
  getStockStatus,
} from "../utils/formatters";


const emptyForm: ProductFormData = {
  name: "",
  sku: "",
  category: "Electronics",
  supplier: "",
  description: "",
  quantity: 0,
  unit_price: 0,
  cost_price: 0,
  reorder_level: 5,
  location: "",
  barcode: "",
};

export default function ProductFormPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(productId);

  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [product, setProduct] = useState<Product | null>(null);
  const [stockHistory, setStockHistory] = useState<StockAdjustment[]>([]);
  const [showBarcode, setShowBarcode] = useState(false);

  const [adjustmentType, setAdjustmentType] = useState("stock_in");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(1);
  const [adjustmentReason, setAdjustmentReason] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadProduct() {
    if (!productId) return;

    try {
      const response = await api.get<Product>(`/api/products/${productId}`);
      const item = response.data;

      setProduct(item);
      setFormData({
        name: item.name,
        sku: item.sku,
        category: item.category,
        supplier: item.supplier || "",
        description: item.description || "",
        quantity: item.quantity,
        unit_price: item.unit_price,
        cost_price: item.cost_price,
        reorder_level: item.reorder_level,
        location: item.location || "",
        barcode: item.barcode || item.sku,
      });

      const historyResponse = await api.get<StockAdjustment[]>(
        `/api/stock/history/${productId}`
      );
      setStockHistory(historyResponse.data);
    } catch {
      setError("Could not load product.");
    }
  }

  useEffect(() => {
    loadProduct();
  }, [productId]);

  function updateField(
    field: keyof ProductFormData,
    value: string | number
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.sku.trim()) {
      setError("SKU is required.");
      return;
    }

    try {
      const payload = {
        ...formData,
        barcode: formData.sku,
      };

      if (isEditMode) {
        await api.put(`/api/products/${productId}`, payload);
        setSuccess("Product updated successfully.");
        loadProduct();
      } else {
        const response = await api.post<Product>("/api/products/", payload);
        navigate(`/inventory/${response.data.id}`);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.detail || "Could not save product.";
      setError(message);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed || !productId) return;

    try {
      await api.delete(`/api/products/${productId}`);
      navigate("/inventory");
    } catch {
      setError("Could not delete product.");
    }
  }

  async function handleStockAdjustment(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!productId) return;


    if (adjustmentQuantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    try {
      await api.post("/api/stock/adjust", {
        product_id: Number(productId),
        adjustment_type: adjustmentType,
        quantity_changed: adjustmentQuantity,
        reason: adjustmentReason,
      });

      setAdjustmentReason("");
      setAdjustmentQuantity(1);
      setSuccess("Stock adjusted successfully.");
      loadProduct();
    } catch (error: any) {
      const message =
        error?.response?.data?.detail || "Could not adjust stock.";
      setError(message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEditMode ? "Edit Product" : "Create Product"}</h1>
          <p>
            {isEditMode
              ? "Update product details, adjust stock, or generate barcode."
              : "Add a new item to the inventory."}
          </p>
        </div>

        <Link to="/inventory" className="btn btn-secondary">
          Back to Inventory
        </Link>
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <div className="content-grid" style={{ marginTop: 18 }}>
        <div className="card section-card">
          <h2>Product Details</h2>

          {product && (
            <p>
              Current Status:{" "}
              <span className={getStockBadgeClass(product)}>
                {getStockStatus(product)}
              </span>
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Product Name
                <input
                  className="input"
                  value={formData.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                SKU
                <input
                  className="input"
                  value={formData.sku}
                  onChange={(event) => {
                    updateField("sku", event.target.value);
                    updateField("barcode", event.target.value);
                  }}
                  required
                />
              </label>

              <label>
                Category
                <select
                  className="select"
                  value={formData.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Supplier
                <input
                  className="input"
                  value={formData.supplier}
                  onChange={(event) =>
                    updateField("supplier", event.target.value)
                  }
                />
              </label>

              <label>
                Quantity
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(event) =>
                    updateField("quantity", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Unit Price
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(event) =>
                    updateField("unit_price", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Cost Price
                <input
                  className="input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(event) =>
                    updateField("cost_price", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Reorder Level
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={formData.reorder_level}
                  onChange={(event) =>
                    updateField("reorder_level", Number(event.target.value))
                  }
                />
              </label>

              <label>
                Location / Shelf / Bin
                <input
                  className="input"
                  value={formData.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="form-full">
              <label>
                Description
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {isEditMode ? "Save Changes" : "Create Product"}
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setShowBarcode((current) => !current)}
              >
                {showBarcode ? "Hide Barcode" : "Generate Barcode"}
              </button>

              {isEditMode && (
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleDelete}
                >
                  Delete Product
                </button>
              )}
            </div>

            {showBarcode && <BarcodePreview value={formData.sku} />}
          </form>
        </div>

        {isEditMode && (
          <div>
            <div className="card section-card">
              <h2>Adjust Stock</h2>

              <form
                onSubmit={handleStockAdjustment}
                className="adjustment-form"
              >
                <label>
                  Adjustment Type
                  <select
                    className="select"
                    value={adjustmentType}
                    onChange={(event) =>
                      setAdjustmentType(event.target.value)
                    }
                  >
                    <option value="stock_in">Stock In</option>
                    <option value="stock_out">Stock Out</option>
                    <option value="correction">Correction</option>
                  </select>
                </label>

                <label>
                  Quantity
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={adjustmentQuantity}
                    onChange={(event) =>
                      setAdjustmentQuantity(Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Reason Reason <span style={{ color: "#64748b", fontWeight: 600 }}>(optional)</span>
                  <textarea
                    className="textarea"
                    value={adjustmentReason}
                    onChange={(event) =>
                      setAdjustmentReason(event.target.value)
                    }
                    placeholder="Example: Received new stock from supplier"
                  />
                </label>

                <button className="btn btn-primary" type="submit">
                  Apply Adjustment
                </button>
              </form>
            </div>

            <div className="card section-card" style={{ marginTop: 18 }}>
              <h2>Product Stock History</h2>

              {stockHistory.length === 0 ? (
                <div className="empty-state">
                  No adjustments recorded for this product.
                </div>
              ) : (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockHistory.map((item) => (
                        <tr key={item.id}>
                          <td>{formatDate(item.date)}</td>
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
        )}
      </div>
    </div>
  );
}