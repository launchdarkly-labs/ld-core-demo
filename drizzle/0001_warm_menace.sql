CREATE TABLE IF NOT EXISTS "macrocenterstore" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" text,
	"cost" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vrgalaxystore" (
	"id" serial PRIMARY KEY NOT NULL,
	"item" text,
	"cost" text
);
