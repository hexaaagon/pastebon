ALTER TABLE "paste" RENAME COLUMN "viewed" TO "views";--> statement-breakpoint
ALTER TABLE "paste" ADD COLUMN "max_views" integer DEFAULT -1;--> statement-breakpoint
ALTER TABLE "paste" ADD COLUMN "access_password" text;--> statement-breakpoint
ALTER TABLE "paste" ADD CONSTRAINT "paste_access_password_unique" UNIQUE("access_password");