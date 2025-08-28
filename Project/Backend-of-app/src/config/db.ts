const { Pool } = require('pg');
const dotenv = require('dotenv');
import {myerr} from '../types/index';


dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Create tables if not exist
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INT,
        address TEXT,
        contact VARCHAR(20)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS details (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        symptoms TEXT,
        treatment TEXT,
        image TEXT
      );
    `);

    console.log("✅ Tables are ready");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
};

pool.connect()
  .then(async () => {
    console.log("✅ Connected to PostgreSQL");
     await initDB();
  })
  .catch((error: myerr) => console.error("❌ DB Connection Error:", error));

export default pool;