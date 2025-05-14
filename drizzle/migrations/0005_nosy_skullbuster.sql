CREATE TYPE "public"."content_type" AS ENUM('legenda', 'reels', 'carrossel', 'tiktok', 'whatsapp');--> statement-breakpoint
CREATE TABLE "rapidlaunch-saas-starterkit_generatedContents" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"contentType" "content_type" NOT NULL,
	"content" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rapidlaunch-saas-starterkit_generatedContents" ADD CONSTRAINT "rapidlaunch-saas-starterkit_generatedContents_userId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."rapidlaunch-saas-starterkit_user"("id") ON DELETE cascade ON UPDATE no action;