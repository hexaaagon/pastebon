import { sql } from "drizzle-orm";
import { pgTable, pgPolicy, text } from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";
import { nanoid } from "nanoid";

export const pasteTable = pgTable(
  "paste",
  {
    id: text("id")
      .primaryKey()
      .unique()
      .$defaultFn(() => nanoid()),
    adminPassword: text("admin_password").unique().notNull(),
    storagePath: text("path").notNull(),
  },
  (t) => [
    pgPolicy(`anon-readonly`, {
      as: "permissive",
      for: "select",
      to: anonRole,
      using: sql`true`,
    }),
  ],
);
