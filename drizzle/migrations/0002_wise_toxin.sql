CREATE TABLE "rapidlaunch-saas-starterkit_login" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"ipAddress" varchar(255),
	"userAgent" varchar(512),
	"device" varchar(64),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rapidlaunch-saas-starterkit_login" ADD CONSTRAINT "rapidlaunch-saas-starterkit_login_userId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rapidlaunch-saas-starterkit_user"("id") ON DELETE no action ON UPDATE no action;