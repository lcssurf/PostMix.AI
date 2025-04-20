DO $$ BEGIN
 CREATE TYPE "feedback-label" AS ENUM('Issue', 'Idea', 'Question', 'Complaint', 'Feature Request', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "feedback-status" AS ENUM('Open', 'In Progress', 'Closed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "org-member-role" AS ENUM('Viewer', 'Developer', 'Billing', 'Admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('User', 'Admin', 'Super Admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "rapidlaunch-saas-starterkit_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_feedback" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"title" varchar(255),
	"message" text NOT NULL,
	"label" "feedback-label" NOT NULL,
	"status" "feedback-status" DEFAULT 'Open' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_membersToOrganizations" (
	"id" varchar(255) DEFAULT gen_random_uuid(),
	"memberId" varchar(255) NOT NULL,
	"memberEmail" varchar(255) NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"role" "org-member-role" DEFAULT 'Viewer' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rapidlaunch-saas-starterkit_membersToOrganizations_id_memberId_organizationId_pk" PRIMARY KEY("id","memberId","organizationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_orgRequest" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"organizationId" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_organization" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"image" varchar(255),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"ownerId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_subscription" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lemonSqueezyId" text NOT NULL,
	"orderId" integer NOT NULL,
	"orgId" text NOT NULL,
	"variantId" integer NOT NULL,
	CONSTRAINT "rapidlaunch-saas-starterkit_subscription_lemonSqueezyId_unique" UNIQUE("lemonSqueezyId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"role" "role" DEFAULT 'User' NOT NULL,
	"isNewUser" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "rapidlaunch-saas-starterkit_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_waitlistUser" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rapidlaunch-saas-starterkit_waitlistUser_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rapidlaunch-saas-starterkit_webhookEvent" (
	"id" varchar(255) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"eventName" text NOT NULL,
	"processed" boolean DEFAULT false,
	"body" jsonb NOT NULL,
	"processingError" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "rapidlaunch-saas-starterkit_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orgRequest_organizationId_idx" ON "rapidlaunch-saas-starterkit_orgRequest" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "rapidlaunch-saas-starterkit_session" ("userId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_account" ADD CONSTRAINT "rapidlaunch-saas-starterkit_account_userId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "rapidlaunch-saas-starterkit_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_feedback" ADD CONSTRAINT "rapidlaunch-saas-starterkit_feedback_userId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "rapidlaunch-saas-starterkit_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_membersToOrganizations" ADD CONSTRAINT "rapidlaunch-saas-starterkit_membersToOrganizations_memberId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("memberId") REFERENCES "rapidlaunch-saas-starterkit_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_membersToOrganizations" ADD CONSTRAINT "rapidlaunch-saas-starterkit_membersToOrganizations_organizationId_rapidlaunch-saas-starterkit_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "rapidlaunch-saas-starterkit_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_orgRequest" ADD CONSTRAINT "rapidlaunch-saas-starterkit_orgRequest_userId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "rapidlaunch-saas-starterkit_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_orgRequest" ADD CONSTRAINT "rapidlaunch-saas-starterkit_orgRequest_organizationId_rapidlaunch-saas-starterkit_organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "rapidlaunch-saas-starterkit_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_organization" ADD CONSTRAINT "rapidlaunch-saas-starterkit_organization_ownerId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "rapidlaunch-saas-starterkit_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_session" ADD CONSTRAINT "rapidlaunch-saas-starterkit_session_userId_rapidlaunch-saas-starterkit_user_id_fk" FOREIGN KEY ("userId") REFERENCES "rapidlaunch-saas-starterkit_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rapidlaunch-saas-starterkit_subscription" ADD CONSTRAINT "rapidlaunch-saas-starterkit_subscription_orgId_rapidlaunch-saas-starterkit_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "rapidlaunch-saas-starterkit_organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
