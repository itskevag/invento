from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, nullable=False, index=True)
    category = Column(String, nullable=False)
    supplier = Column(String, nullable=True)
    description = Column(String, nullable=True)
    quantity = Column(Integer, default=0)
    unit_price = Column(Float, default=0)
    cost_price = Column(Float, default=0)
    reorder_level = Column(Integer, default=5)
    location = Column(String, nullable=True)
    barcode = Column(String, nullable=True)

    stock_history = relationship(
        "StockAdjustment",
        back_populates="product",
        cascade="all, delete-orphan"
    )


class StockAdjustment(Base):
    __tablename__ = "stock_adjustments"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    adjustment_type = Column(String, nullable=False)
    quantity_changed = Column(Integer, nullable=False)
    reason = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="stock_history")