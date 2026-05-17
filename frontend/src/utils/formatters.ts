import type { Product } from "../types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

export function getStockStatus(product: Product) {
  if (product.quantity === 0) {
    return "Out of Stock";
  }

  if (product.quantity <= product.reorder_level) {
    return "Low Stock";
  }

  return "In Stock";
}

export function getStockBadgeClass(product: Product) {
  const status = getStockStatus(product);

  if (status === "Out of Stock") {
    return "badge badge-out";
  }

  if (status === "Low Stock") {
    return "badge badge-low";
  }

  return "badge badge-good";
}

export function formatAdjustmentType(type: string) {
  if (type === "stock_in") return "Stock In";
  if (type === "stock_out") return "Stock Out";
  if (type === "correction") return "Correction";
  return type;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleString();
}