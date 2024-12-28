import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import postgres from "postgres";

import { createServiceServer } from "@/lib/supabase/service-server";

import path from "node:path";
import { glob } from "glob";
import fs from "fs-extra";
import { absoluteUrl } from "../utils";

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

  // Supabase Extensions check
  console.log("⏳ Checking Supabase Extensions...");
  const isExtensionsEnabled = await checkExtensions(db, supabase);
  if (!isExtensionsEnabled)
    return () => {
      const end = Date.now();
      console.log("❌ Migrations completed in", end - start, "ms with errors.");
      process.exit(0);
    };

  // Supabase Cron setup
  console.log("⏳ Setup Supabase crons...");
  await EnableSupabaseCron(db, supabase);

  const end = Date.now();
  console.log("✅ Migrations completed in", end - start, "ms");

  process.exit(0);
};

async function checkExtensions(
  db: PostgresJsDatabase,
  supabase: SupabaseClient<Database>,
) {
  const checkPgNetQuery =
    "SELECT * FROM pg_available_extensions WHERE name = 'pg_net' AND installed_version IS NOT NULL";
  const checkCronQuery =
    "SELECT * FROM pg_available_extensions WHERE name = 'pg_cron' AND installed_version IS NOT NULL";

  const pgNetResult = await db.execute(checkPgNetQuery);
  const cronResult = await db.execute(checkCronQuery);

  const isPgNetEnabled = pgNetResult.length > 0;
  const isPgCronEnabled = cronResult.length > 0;

  console.log(
    isPgNetEnabled
      ? "  ✅ 'pg_net' extension installed."
      : "  ⚠️  WARNING : 'pg_net' extension not found. Please install the extension first.",
  );
  console.log(
    isPgCronEnabled
      ? "  ✅ 'pg_cron' extension installed."
      : "  ⚠️  WARNING : 'pg_cron' extension not found. Please install the extension first.",
  );

  return isPgNetEnabled && isPgCronEnabled;
}

async function EnableSupabaseCron(
  db: PostgresJsDatabase,
  supabase: SupabaseClient<Database>,
) {
  const files = (await glob(`src/lib/db/scripts/crons/*.sql`)).map((filePath) =>
    path.resolve(filePath),
  );

  const file: boolean[] = await Promise.all(
    files.map(async (file) => {
      let script = await fs.readFile(file, "utf8");

      if (!script) return false;

      script = script
        .replaceAll("{{APP_URL}}", absoluteUrl().slice(0, -1))
        .replaceAll(
          "{{REST_API_PASSWORD}}",
          `Bearer ${process.env.POSTGRES_PASSWORD}`,
        );

      const args = (file.startsWith("/") ? file.replace("/", "") : file).split(
        "/",
      );

      try {
        await new Promise((res) =>
          setTimeout(() => res(null), Math.floor(Math.random() * 5 * 1000)),
        );
        await db.execute(script);
      } catch (e) {
        console.log(file, `Error while enabling ${args.slice(-1)}: ` + e);

        return false;
      }

      return true;
    }),
  );

  const total = file.length;
  const success = file.filter((v) => v === true);
  const failed = file.filter((v) => v === false);

  console.log(`  ✅ ${success.length}/${total} crons enabled`);
  console.log(`  ❌ ${failed.length}/${total} crons failed`);
  return;
}

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
