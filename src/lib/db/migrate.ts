import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { createServiceServer } from "@/lib/supabase/service-server";

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });

  const db = drizzle(connection);

  console.log("⏳ Running Database migrations...");
  const start = Date.now();

  // Database Migration
  await migrate(db, { migrationsFolder: "src/lib/db/migrations" });

  // Storage Bucket Create
  console.log("⏳ Creating Supabase Bucket...");
  const supabase = createServiceServer();
  if (!(await supabase.storage.getBucket("paste")).data)
    await supabase.storage.createBucket("paste");

  const end = Date.now();
  console.log("✅ Migrations completed in", end - start, "ms");

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
