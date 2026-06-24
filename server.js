const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Root route to fix "Cannot GET /"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API endpoint
app.get('/api/products', async (req, res) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const query = cursor 
      ? 'SELECT * FROM products WHERE created_at < $1 ORDER BY created_at DESC LIMIT $2'
      : 'SELECT * FROM products ORDER BY created_at DESC LIMIT $1';
    
    const params = cursor ? [cursor, limit] : [limit];
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is successfully running on port ${port}`);
});