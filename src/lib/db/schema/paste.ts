import { sql } from "drizzle-orm";
import {
  pgTable,
  pgPolicy,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { anonRole } from "drizzle-orm/supabase";
import { nanoid } from "@/lib/utils";

export const pasteTable = pgTable(
  "paste",
  {
    id: text("id")
      .primaryKey()
      .unique()
      .$defaultFn(() => nanoid()),
    adminPassword: text("admin_password").unique().notNull(),
    storagePath: text("path").notNull(),
    language: text("language").default("plaintext"),
    viewed: integer("viewed").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    expiresAt: timestamp("expires_at").default(sql`NOW() + INTERVAL '7 days'`),
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
