# order-service

REST API for order management. Built with Node.js + Express, backed by PostgreSQL. Calls `product-service` to validate products before creating orders.

## Prerequisites

- Node.js 18+
- PostgreSQL running with the `ecommerce` database initialized (see `database/`)
- `product-service` running and reachable

## Local Development

```bash
npm install
npm start        # runs on http://localhost:3002
```

## Testing

```bash
npm test         # interactive watch mode
npm run test:ci  # single-run with coverage (used in CI)
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/orders` | List all orders |
| `POST` | `/orders` | Create an order |
| `PATCH` | `/orders/:id` | Update order status |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3002` | Port to listen on |
| `PRODUCT_SERVICE_URL` | `http://product-service:3001` | Product service URL |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_NAME` | `ecommerce` | Database name |
| `DB_USER` | `postgres` | Database user |
| `DB_PASSWORD` | `password` | Database password |

## Tech Stack

- Node.js 18, Express 4
- pg (node-postgres), axios (inter-service calls)
- Jest for testing
