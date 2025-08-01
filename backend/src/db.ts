// src/db.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DB_URL) {
  throw new Error("DB_URL environment variable is not set");
}

const pool = new Pool({ 
  connectionString: process.env.DB_URL,
});

console.log("Neon Database Connection Pool created successfully.");

export default pool;