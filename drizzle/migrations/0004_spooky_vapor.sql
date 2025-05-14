ALTER TABLE "rapidlaunch-saas-starterkit_user" ADD COLUMN "canvaAccessToken" varchar;--> statement-breakpoint
ALTER TABLE "rapidlaunch-saas-starterkit_user" ADD COLUMN "canvaRefreshToken" varchar;--> statement-breakpoint
ALTER TABLE "rapidlaunch-saas-starterkit_user" ADD COLUMN "canvaTokenExpiresAt" timestamp;