ALTER TABLE "paste" ADD COLUMN "viewed" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "paste" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "paste" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "paste" ADD COLUMN "expires_at" timestamp DEFAULT NOW() + INTERVAL '7 days';