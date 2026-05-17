from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class ProductBase(BaseModel):
    name: str
    sku: str
    category: str
    supplier: Optional[str] = None
    description: Optional[str] = None
    quantity: int
    unit_price: float
    cost_price: float
    reorder_level: int
    location: Optional[str] = None
    barcode: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True


class StockAdjustmentCreate(BaseModel):
    product_id: int
    adjustment_type: str
    quantity_changed: int
    reason: Optional[str] = None


class StockAdjustmentResponse(BaseModel):
    id: int
    product_id: int
    adjustment_type: str
    quantity_changed: int
    reason: str
    date: datetime
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_products: int
    total_quantity: int
    low_stock_count: int
    out_of_stock_count: int
    total_inventory_value: float