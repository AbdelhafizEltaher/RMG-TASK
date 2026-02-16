# RMG Task — Sample SPA

A single-page application (SPA) with **user authentication**, **product management**, and **invoice creation**, using a **fake API** (json-server) for data—no real backend required.

## Features

- **Login** — Simulated auth with hardcoded credentials; redirects to Home on success.
- **Home** — Dashboard with navigation to Products and Invoices.
- **Product management** — Create, list, edit, and delete products (full CRUD).
- **Invoices** — Create invoices with line items (products, quantity, price) and view the list.

## Tech Stack

- **Angular 21** (standalone components, signals where used)
- **Tailwind CSS** for styling
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

After login you’ll be redirected to the Home page. From there you can open **Products** and **Invoices**.

## Scripts

| Command     | Description                          |
|------------|--------------------------------------|
| `npm start`| Run the Angular app (dev server)     |
| `npm run api` | Run json-server (mock API) on port 3000 |
| `npm run build` | Production build                  |
| `npm test` | Run unit tests                       |

## Project Structure

```
src/
├── app/
│   ├── core/                 # Auth, API config
│   │   ├── api/
│   │   └── auth/
│   ├── features/
│   │   ├── login/
│   │   ├── home/
│   │   ├── products/        # Product CRUD
│   │   └── invoices/        # Invoice list & create
│   └── layout/              # Shell with nav and outlet
├── styles.css               # Global styles and CSS variables
db.json                      # Mock data for json-server
proxy.conf.json              # Optional proxy (see below)
```

## Mock API (json-server)

- **Base URL:** `http://localhost:3000`
- **Endpoints:**
  - `GET/POST /products` — list and create products
  - `GET/PATCH/DELETE /products/:id` — get, update, delete a product
  - `GET/POST /invoices` — list and create invoices
  - `GET /invoices/:id` — get one invoice

Data is stored in `db.json` and persisted by json-server while it’s running. Restarting `npm run api` resets data to the initial `db.json` content.

## Responsiveness

The UI is responsive: layout, tables, and forms adapt to small screens (e.g. stacked fields, simplified tables).

## Design Notes

- Clean, minimal UI with a consistent color palette (CSS variables in `styles.css`).
- Primary actions use a blue accent; errors use red; success states use green.
- Navigation is in the header when logged in; “Log out” clears the session and redirects to Login.

## License

MIT.
