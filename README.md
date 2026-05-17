# Invento

**Invento** is a simple inventory management web application designed for small businesses. It helps users manage products, monitor stock levels, generate barcodes, and track stock adjustment history.

## Project Title

Invento — Simple Inventory Management

## Main Features

- Admin login using JWT authentication
- Protected dashboard and inventory pages
- Product management: create, view, edit, and delete products
- Inventory table with search and category filtering
- Low-stock and out-of-stock warnings
- Stock adjustment: stock in, stock out, and correction
- Stock adjustment history
- Barcode generation using product SKU
- Dashboard reports with inventory statistics
- SQLite database
- Clean blue and white user interface
- Currency displayed in PLN

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- JsBarcode

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- JWT authentication

## Demo Login

```text
Email: admin@invento.com
Password: admin123
```

## Project Structure

```text
invento/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── auth.py
│   ├── seed.py
│   ├── requirements.txt
│   └── routes/
│       ├── __init__.py
│       ├── auth_routes.py
│       ├── product_routes.py
│       └── stock_routes.py
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── types/
    │   ├── utils/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## How to Run the Project

This project has two parts:

1. Backend API
2. Frontend web app

Both parts must be running at the same time.

## Backend Setup

Open a terminal from the main project folder and run:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation will be available at:

```text
http://127.0.0.1:8000/docs
```

## Frontend Setup

Open another terminal from the main project folder and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

## How to Use the App

1. Open the frontend in the browser.
2. Click **Login**.
3. Use the demo admin account.
4. Open the **Dashboard** to view inventory reports.
5. Open **Inventory** to create, edit, or delete products.
6. Click a product row to edit item details.
7. Generate a barcode from the product SKU.
8. Use stock adjustment to receive stock, remove stock, or correct stock quantity.
9. View all stock changes in the **Stock History** page.

## Product Fields

Each product includes the following fields:

- Product name
- SKU
- Category
- Supplier
- Description
- Quantity
- Unit price
- Cost price
- Reorder level
- Location / shelf / bin
- Barcode

## Predefined Categories

- Electronics
- Office Supplies
- Clothing
- Food & Beverage
- Tools
- Health & Beauty
- Other

## Stock Adjustment Types

### Stock In

Used when new inventory is received.

Example:

```text
Current quantity: 10
Stock in quantity: 5
Final quantity: 15
```

### Stock Out

Used when inventory is removed or sold.

Example:

```text
Current quantity: 10
Stock out quantity: 3
Final quantity: 7
```

### Correction

Used when the system quantity needs to be corrected after a physical count.

Example:

```text
Current quantity: 10
Correction quantity: 6
Final quantity: 6
```

## Barcode Generation

Invento generates barcodes using the product SKU.

Example:

```text
SKU: INV-MOUSE-001
Barcode value: INV-MOUSE-001
```

## Author

Kaleab Girmay Gebresilassie