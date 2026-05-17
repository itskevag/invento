from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database import get_db
from models import Product, StockAdjustment
from schemas import StockAdjustmentCreate, StockAdjustmentResponse
from auth import get_current_admin

router = APIRouter(
    prefix="/api/stock",
    tags=["Stock Adjustments"]
)


@router.get("/history", response_model=list[StockAdjustmentResponse])
def get_stock_history(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    history = db.query(StockAdjustment).options(
        joinedload(StockAdjustment.product)
    ).order_by(StockAdjustment.date.desc()).all()

    return history


@router.get("/history/{product_id}", response_model=list[StockAdjustmentResponse])
def get_product_stock_history(
    product_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    history = db.query(StockAdjustment).filter(
        StockAdjustment.product_id == product_id
    ).order_by(StockAdjustment.date.desc()).all()

    return history


@router.post("/adjust", response_model=StockAdjustmentResponse)
def adjust_stock(
    adjustment_data: StockAdjustmentCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    product = db.query(Product).filter(
        Product.id == adjustment_data.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if adjustment_data.quantity_changed <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity changed must be greater than zero"
        )

    reason = adjustment_data.reason.strip() if adjustment_data.reason else None

    adjustment_type = adjustment_data.adjustment_type.lower()

    if adjustment_type not in ["stock_in", "stock_out", "correction"]:
        raise HTTPException(
            status_code=400,
            detail="Adjustment type must be stock_in, stock_out, or correction"
        )

    if adjustment_type == "stock_in":
        product.quantity += adjustment_data.quantity_changed

    elif adjustment_type == "stock_out":
        if product.quantity < adjustment_data.quantity_changed:
            raise HTTPException(
                status_code=400,
                detail="Not enough stock available"
            )
        product.quantity -= adjustment_data.quantity_changed

    elif adjustment_type == "correction":
        product.quantity = adjustment_data.quantity_changed

    stock_adjustment = StockAdjustment(
        product_id=adjustment_data.product_id,
        adjustment_type=adjustment_type,
        quantity_changed=adjustment_data.quantity_changed,
        reason=reason or "No reason provided"
    )

    db.add(stock_adjustment)
    db.commit()
    db.refresh(stock_adjustment)

    return stock_adjustment