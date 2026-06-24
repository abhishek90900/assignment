const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Database connection using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Serve static files from the 'public' folder located one level above 'src'
app.use(express.static(path.join(__dirname, '../public')));

// Example API endpoint for cursor-based pagination
app.get('/api/products', async (req, res) => {
  try {
    const { cursor, limit = 10 } = req.query;
    
    // Query logic for cursor-based pagination
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