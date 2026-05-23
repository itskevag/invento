# Invento

**Invento** is a simple inventory management web application designed for small businesses. It helps users manage products, monitor stock levels, generate barcodes, and track stock adjustment history.

## Project Title

Invento — Simple Inventory Management

## Main Features

- Admin login
- Protected dashboard and inventory pages
- Product management: create, view, edit, and delete products
- Inventory table with search and category filtering
- Low-stock and out-of-stock warnings
- Stock adjustment: stock in, stock out, and correction
- Stock adjustment history
- Barcode generation using product SKU
- Dashboard reports with inventory statistics

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

## How to Run the Project

Requirements:

- Docker Desktop or Docker Engine
- Git

```bash
git clone https://github.com/itskevag/invento.git
cd invento
docker compose up --build
```

On Linux, use `sudo` if Docker requires permission

Application URLs:

```text
Frontend: http://localhost:5173
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
```

## How to Use the App

1. Open `http://localhost:5173`.
2. Log in with the demo admin account.
3. Use the dashboard to view inventory statistics.
4. Use the inventory page to create, edit, delete, and search products.
5. Open a product to generate a barcode or adjust stock.
6. Use the stock history page to review inventory changes.

## Notes

- Barcodes are generated from product SKU values.
- Stock adjustment supports stock in, stock out, and correction.
- Product categories are predefined.


## Author

Kaleab Girmay Gebresilassie