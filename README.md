# Product Browser Backend

This is a backend assignment for CodeVector Internship, focusing on efficient data handling and cursor-based pagination.

## Features
- **Scalable Data Handling**: Seeded 200,000 products using batch insertion.
- **Efficient Querying**: Used PostgreSQL indexing for fast filtering by category and date.
- **Cursor-based Pagination**: Ensures consistent data browsing without duplicates or missing items, even while data is changing.

## Technologies Used
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Neon)
- **Frontend**: HTML5, Tailwind CSS
- **Deployment**: Render

## Engineering Decisions
- **Why Cursor-based Pagination?**: Unlike traditional offset pagination, cursor-based pagination uses a timestamp to track progress. This is crucial for large datasets where new items are frequently added, as it prevents data duplication or gaps.
- **Why Indexing?**: Added indexes on `category` and `created_at` to ensure that filtering and sorting operations remain fast, even with 200,000 rows.

## How to Run Locally
1. Clone this repository.
2. Create a `.env` file and add your `DATABASE_URL`.
3. Install dependencies: `npm install`
4. Run the server: `node server.js`
5. Visit `http://localhost:3000` to browse.
6.