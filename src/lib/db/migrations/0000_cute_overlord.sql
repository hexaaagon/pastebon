CREATE TABLE "paste" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_password" text NOT NULL,
	"path" text NOT NULL,
	"language" text DEFAULT 'plaintext',
	CONSTRAINT "paste_id_unique" UNIQUE("id"),
	CONSTRAINT "paste_admin_password_unique" UNIQUE("admin_password")
);
--> statement-breakpoint
ALTER TABLE "paste" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "anon-readonly" ON "paste" AS PERMISSIVE FOR SELECT TO "anon" USING (true);