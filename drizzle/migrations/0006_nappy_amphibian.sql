CREATE TABLE "rapidlaunch-saas-starterkit_project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" text NOT NULL,
	"json" text NOT NULL,
	"height" integer NOT NULL,
	"width" integer NOT NULL,
	"thumbnailUrl" text,
	"isTemplate" boolean,
	"isPro" boolean,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rapidlaunch-saas-starterkit_project" ADD CONSTRAINT "rapidlaunch-saas-starterkit_project_userId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rapidlaunch-saas-starterkit_user"("id") ON DELETE cascade ON UPDATE no action;