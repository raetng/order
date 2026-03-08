const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3002;
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3001';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.get('/orders', async (req, res) => {
  const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
  res.json(result.rows);
});

app.post('/orders', async (req, res) => {
  const { product_id, quantity } = req.body;
  const productRes = await axios.get(`${PRODUCT_SERVICE_URL}/products/${product_id}`);
  const product = productRes.data;
  const total = product.price * quantity;
  const result = await pool.query(
    'INSERT INTO orders (product_id, quantity, total, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [product_id, quantity, total, 'pending']
  );
  res.status(201).json(result.rows[0]);
});

app.patch('/orders/:id', async (req, res) => {
  const { status } = req.body;
  const result = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
  res.json(result.rows[0]);
});

app.listen(PORT, () => console.log(`order-service running on port ${PORT}`));

module.exports = app;
// test
// test
