CREATE TABLE IF NOT EXISTS "airports" (
	"id" serial PRIMARY KEY NOT NULL,
	"cityname" text,
	"airportcode" text,
	"country" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookedflights" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" text,
	"origin" text,
	"destination" text,
	"clublevel" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flights" (
	"id" serial PRIMARY KEY NOT NULL,
	"flight_number" text,
	"origin" text,
	"destination" text,
	"duration" text,
	"flight_status" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" text,
	"merchant" text,
	"status" text,
	"amount" numeric,
	"accounttype" text,
	"user" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text,
	"password" text,
	"email" text,
	"preferredseating" text,
	"mealoption" text,
	"toggleclub" boolean,
	"statuslevel" text,
	"flights" integer
);
