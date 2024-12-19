CREATE TABLE "paste" (
	"id" text PRIMARY KEY NOT NULL,
	"password" text NOT NULL,
	"path" text NOT NULL,
	CONSTRAINT "paste_id_unique" UNIQUE("id"),
	CONSTRAINT "paste_password_unique" UNIQUE("password")
);
--> statement-breakpoint
ALTER TABLE "paste" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "anon-readonly" ON "paste" AS PERMISSIVE FOR SELECT TO "anon" USING (true);