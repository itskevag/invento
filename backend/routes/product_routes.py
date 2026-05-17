from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models import Product
from schemas import ProductCreate, ProductUpdate, ProductResponse, DashboardStats
from auth import get_current_admin

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.get("/", response_model=list[ProductResponse])
def get_products(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    products = db.query(Product).order_by(Product.id.desc()).all()
    return products


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    products = db.query(Product).all()

    total_products = len(products)
    total_quantity = sum(product.quantity for product in products)
    low_stock_count = sum(
        1 for product in products
        if product.quantity <= product.reorder_level and product.quantity > 0
    )
    out_of_stock_count = sum(
        1 for product in products
        if product.quantity == 0
    )
    total_inventory_value = sum(
        product.quantity * product.unit_price
        for product in products
    )

    return {
        "total_products": total_products,
        "total_quantity": total_quantity,
        "low_stock_count": low_stock_count,
        "out_of_stock_count": out_of_stock_count,
        "total_inventory_value": total_inventory_value
    }


@router.post("/", response_model=ProductResponse)
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    existing_product = db.query(Product).filter(
        Product.sku == product_data.sku
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="A product with this SKU already exists"
        )

    new_product = Product(
        name=product_data.name,
        sku=product_data.sku,
        category=product_data.category,
        supplier=product_data.supplier,
        description=product_data.description,
        quantity=product_data.quantity,
        unit_price=product_data.unit_price,
        cost_price=product_data.cost_price,
        reorder_level=product_data.reorder_level,
        location=product_data.location,
        barcode=product_data.sku
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_product = db.query(Product).filter(
        Product.sku == product_data.sku,
        Product.id != product_id
    ).first()

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="Another product with this SKU already exists"
        )

    product.name = product_data.name
    product.sku = product_data.sku
    product.category = product_data.category
    product.supplier = product_data.supplier
    product.description = product_data.description
    product.quantity = product_data.quantity
    product.unit_price = product_data.unit_price
    product.cost_price = product_data.cost_price
    product.reorder_level = product_data.reorder_level
    product.location = product_data.location
    product.barcode = product_data.sku

    db.commit()
    db.refresh(product)

    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: dict = Depends(get_current_admin)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}