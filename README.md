# RMG Task — Sample SPA

A single-page application (SPA) with **user authentication**, **product management**, and **invoice creation**, using a **fake API** (json-server) for data—no real backend required.

## Features

- **Login** — Simulated auth with hardcoded credentials; redirects to Dashboard on success.
- **Dashboard (Home)** — Statistics overview: total products, total invoices, revenue, low-stock count, and invoice breakdown by status (draft/sent/paid). Quick actions to add a product or create an invoice.
- **Products**
  - **List** — Table with name, SKU, description, price, stock; low-stock badge; View / Edit / Delete.
  - **View** — Product detail page (name, SKU, description, price, stock, actions).
  - **Create** — New product form with basic details and pricing & inventory sections.
  - **Edit** — Edit existing product with link to view.
- **Invoices**
  - **List** — Cards with invoice number, customer, due date, item count, total, status; click to view.
  - **View** — Invoice detail page (header, line items table, subtotal, tax, total).
  - **Create** — New invoice with customer, due date, tax, and line items (product picker, qty, unit price).
- **Shared UI** — Reusable **custom dropdown** (filter, clear, optional label) and **custom calendar** (date picker) used in forms.
- **Layout** — Sticky header with logo, nav (Home, Products, Invoices), and Log out.

## Tech Stack

- **Angular 21** (standalone components, signals)
- **Tailwind CSS** for styling (no component CSS files)
- **json-server** as mock REST API
- **RxJS** for async data

## Prerequisites

- Node.js 18+
- npm 10+

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the mock API

In a **separate terminal**, run:

```bash
npm run api
```

This starts json-server on **http://localhost:3000** and serves data from `db.json` (products and invoices). Keep this terminal open.

### 3. Start the Angular app

```bash
npm start
```

Open **http://localhost:4200** in your browser.

### 4. Log in

Use these demo credentials:

- **Username:** `admin`
- **Password:** `admin123`

After login you’ll be redirected to the Dashboard. From there you can open **Products** and **Invoices**, or use the quick actions to add a product or create an invoice.

## Scripts

| Command        | Description                              |
|----------------|------------------------------------------|
| `npm start`    | Run the Angular app (dev server)         |
| `npm run api`  | Run json-server (mock API) on port 3000   |
| `npm run build`| Production build                         |
| `npm test`     | Run unit tests                           |

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── common/           # Reusable: custom-dropdown, custom-calendar
│   │   └── layout/           # Shell: header, main, layout
│   ├── enums/                # HTTP paths, etc.
│   ├── features/
│   │   ├── login/
│   │   ├── home/             # Dashboard with stats
│   │   ├── products/         # List, view, new, edit, form
│   │   └── invoices/         # List, view, create
│   ├── guards/               # auth.guard
│   ├── interfaces/           # Product, invoice, shared types
│   ├── services/             # Auth, product, invoice API
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── ...
├── environment/              # API URL config
├── styles.css                # Global styles + Tailwind
db.json                       # Mock data for json-server
proxy.conf.json               # Proxy /api to json-server (if used)
```

## Mock API (json-server)

- **Base URL:** `http://localhost:3000`
- **Endpoints:**
  - `GET/POST /products` — list and create products
  - `GET/PATCH/DELETE /products/:id` — get, update, delete a product
  - `GET/POST /invoices` — list and create invoices
  - `GET /invoices/:id` — get one invoice

Data is stored in `db.json` and persisted by json-server while it’s running. Restarting `npm run api` resets data to the initial `db.json` content.

## Routes

| Path                    | Description        |
|-------------------------|--------------------|
| `/login`                | Login page         |
| `/home`                 | Dashboard          |
| `/products`             | Product list       |
| `/products/new`         | New product        |
| `/products/:id`        | Product detail     |
| `/products/:id/edit`   | Edit product       |
| `/invoices`             | Invoice list       |
| `/invoices/new`        | Create invoice     |
| `/invoices/:id`        | Invoice detail     |

## Responsiveness

The UI is responsive: dashboard grid, tables (e.g. SKU/description columns hidden on small screens), and forms adapt to mobile. Header nav wraps; sticky header with backdrop blur.

## Design Notes

- **Tailwind CSS** used across all features (no component `.css` files).
- Consistent palette: slate for text/backgrounds, blue for primary actions, amber for warnings (low stock), emerald for success/paid.
- Dashboard uses KPI cards, status pills, and quick actions.
- Product and invoice lists show key details and link to view/detail pages.

## License

MIT.
