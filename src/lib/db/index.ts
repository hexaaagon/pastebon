import {
  neon,
  neonConfig,
  NeonQueryFunction,
  Pool,
} from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

export const sql: NeonQueryFunction<boolean, boolean> = neon(
  process.env.DATABASE_URL!
);
export const db = drizzle(sql);

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
