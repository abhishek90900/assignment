const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
});

// API endpoint to fetch products
app.get('/products', async (req, res) => {
    let { category, cursor } = req.query;
    
    // Normalize category: Treat 'All' or empty as null to fetch all categories
    if (!category || category === "" || category === "undefined" || category === "All") {
        category = null;
    }
    
    try {
        // Query: Uses cursor (created_at) for fast, consistent pagination
        const query = `
            SELECT * FROM products 
            WHERE ($1::text IS NULL OR category = $1)
            AND ($2::timestamp IS NULL OR created_at < $2)
            ORDER BY created_at DESC 
            LIMIT 20
        `;
        
        const result = await pool.query(query, [category, cursor || null]);
        res.json(result.rows);
    } catch (err) {
        console.error('Database Error:', err);
        res.status(500).send("Error fetching data from database");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));