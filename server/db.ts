import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set. Database features will be disabled.",
  );
}

// Minimal mock to prevent crash if not used. 
// If used, it will throw specific errors, which is better than crashing on boot.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://dummy:dummy@localhost:5432/dummy" });
export const db = drizzle(pool, { schema });
