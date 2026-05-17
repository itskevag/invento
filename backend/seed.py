from database import SessionLocal, Base, engine
from models import Product, StockAdjustment

Base.metadata.create_all(bind=engine)

db = SessionLocal()

sample_products = [
    {
        "name": "Wireless Mouse",
        "sku": "INV-MOUSE-001",
        "category": "Electronics",
        "supplier": "Tech Supplier Ltd",
        "description": "Basic wireless mouse for office and student use.",
        "quantity": 25,
        "unit_price": 79.99,
        "cost_price": 42.00,
        "reorder_level": 5,
        "location": "Shelf A1",
        "barcode": "INV-MOUSE-001",
    },
    {
        "name": "Wireless Keyboard",
        "sku": "INV-KEY-001",
        "category": "Electronics",
        "supplier": "Tech Supplier Ltd",
        "description": "Compact wireless keyboard.",
        "quantity": 12,
        "unit_price": 119.99,
        "cost_price": 65.00,
        "reorder_level": 5,
        "location": "Shelf B2",
        "barcode": "INV-KEY-001",
    },
    {
        "name": "Notebook",
        "sku": "INV-NOTE-001",
        "category": "Office Supplies",
        "supplier": "Campus Stationery",
        "description": "Pack of A4 notebooks for students and office use.",
        "quantity": 4,
        "unit_price": 24.99,
        "cost_price": 12.50,
        "reorder_level": 10,
        "location": "Shelf C1",
        "barcode": "INV-NOTE-001",
    },
    {
        "name": "USB-C Cable",
        "sku": "INV-CABLE-001",
        "category": "Electronics",
        "supplier": "Digital Hub",
        "description": "1 meter USB-C charging cable.",
        "quantity": 0,
        "unit_price": 34.99,
        "cost_price": 15.00,
        "reorder_level": 8,
        "location": "Shelf A3",
        "barcode": "INV-CABLE-001",
    },
    {
        "name": "Safety Gloves",
        "sku": "INV-GLOVE-001",
        "category": "Tools",
        "supplier": "WorkSafe Supplies",
        "description": "Protective gloves for workshop use.",
        "quantity": 18,
        "unit_price": 19.99,
        "cost_price": 8.00,
        "reorder_level": 6,
        "location": "Storage Room 1",
        "barcode": "INV-GLOVE-001",
    },
    {
        "name": "Reusable Water Bottle",
        "sku": "INV-BOTTLE-001",
        "category": "Health & Beauty",
        "supplier": "Eco Goods",
        "description": "Reusable plastic water bottle.",
        "quantity": 9,
        "unit_price": 39.99,
        "cost_price": 18.00,
        "reorder_level": 10,
        "location": "Shelf D4",
        "barcode": "INV-BOTTLE-001",
    },
]

existing_count = db.query(Product).count()

if existing_count > 0:
    print("Database already has products. Seed skipped.")
    db.close()
    exit()

created_products = []

for product_data in sample_products:
    product = Product(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    created_products.append(product)

sample_adjustments = [
    {
        "product_id": created_products[0].id,
        "adjustment_type": "stock_in",
        "quantity_changed": 25,
        "reason": "Initial stock added",
    },
    {
        "product_id": created_products[1].id,
        "adjustment_type": "stock_in",
        "quantity_changed": 12,
        "reason": "Initial stock added",
    },
    {
        "product_id": created_products[2].id,
        "adjustment_type": "stock_out",
        "quantity_changed": 6,
        "reason": "Sold items during the week",
    },
    {
        "product_id": created_products[3].id,
        "adjustment_type": "correction",
        "quantity_changed": 0,
        "reason": "Physical count confirmed out of stock",
    },
    {
        "product_id": created_products[5].id,
        "adjustment_type": "stock_out",
        "quantity_changed": 3,
        "reason": "Customer sale",
    },
]

for adjustment_data in sample_adjustments:
    adjustment = StockAdjustment(**adjustment_data)
    db.add(adjustment)

db.commit()
db.close()

print("Sample Invento data added successfully.")