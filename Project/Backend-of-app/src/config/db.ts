const { Pool } = require('pg');
const dotenv = require('dotenv');
import {myerr} from '../types/index';


dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "db", // ✅ use service name in Docker
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "hospital_db",
});

// Retry connection until DB is ready
async function connectWithRetry(retries = 20, delay = 5000) {
  while (retries) {
    try {
      await pool.query("SELECT NOW()");
      console.log("✅ Connected to PostgreSQL");
      return;
    } catch (err: any) {
      retries -= 1;
      console.error(
        `❌ DB Connection Failed: ${err.message}. Retries left: ${retries}`
      );
      if (!retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// Initialize DB schema
async function initDB() {
  await connectWithRetry();

  // Create tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      age INT,
      address VARCHAR(255),
      contact VARCHAR(20)
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS details (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      symptoms TEXT,
      treatment TEXT,
      image VARCHAR(255)
    );
  `);

  console.log("✅ Tables checked/created successfully");
}

// Call initDB at startup
initDB().catch((err) => {
  console.error("❌ Failed to initialize database:", err);
  process.exit(1); // Stop app if DB setup fails
});

export default pool;