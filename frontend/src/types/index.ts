export type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  supplier?: string | null;
  description?: string | null;
  quantity: number;
  unit_price: number;
  cost_price: number;
  reorder_level: number;
  location?: string | null;
  barcode?: string | null;
};

export type ProductFormData = {
  name: string;
  sku: string;
  category: string;
  supplier: string;
  description: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
  reorder_level: number;
  location: string;
  barcode: string;
};

export type DashboardStats = {
  total_products: number;
  total_quantity: number;
  low_stock_count: number;
  out_of_stock_count: number;
  total_inventory_value: number;
};

export type StockAdjustment = {
  id: number;
  product_id: number;
  adjustment_type: string;
  quantity_changed: number;
  reason: string;
  date: string;
  product?: Product;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export const CATEGORIES = [
  "Electronics",
  "Office Supplies",
  "Clothing",
  "Food & Beverage",
  "Tools",
  "Health & Beauty",
  "Other",
];