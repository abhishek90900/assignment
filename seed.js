require('dotenv').config();
const { Pool } = require('pg');

// Create a pool using the connection string from your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedProducts() {
  const client = await pool.connect();
  const totalProducts = 200000;
  const batchSize = 1000; // Insert 1000 records at a time

  console.log("Starting to seed 200,000 products...");

  try {
    for (let i = 0; i < totalProducts / batchSize; i++) {
      let values = [];
      let placeholders = [];
      
      for (let j = 0; j < batchSize; j++) {
        const offset = i * batchSize + j;
        const name = `Product ${offset + 1}`;
        const category = `Category ${Math.floor(Math.random() * 10) + 1}`;
        const price = (Math.random() * 1000).toFixed(2);
        
        // Push placeholders for the query: ($1, $2, $3, $4), ($5, $6, $7, $8)...
        const base = j * 4;
        placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`);
        values.push(name, category, price, new Date());
      }

      const query = `INSERT INTO products (name, category, price, created_at) VALUES ${placeholders.join(',')}`;
      await client.query(query, values);
      
      console.log(`Inserted batch ${i + 1}/${totalProducts / batchSize}`);
    }
    console.log("Successfully seeded 200,000 products!");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedProducts();