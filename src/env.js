import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        DATABASE_URL: z
            .string()
            .url()
            .refine(
                (str) => !str.includes("YOUR_MYSQL_URL_HERE"),
                "You forgot to change the default URL",
            ),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        NEXTAUTH_SECRET:
            process.env.NODE_ENV === "production"
                ? z.string()
                : z.string().optional(),
        NEXTAUTH_URL: z.string().url(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        GITHUB_CLIENT_ID: z.string(),
        GITHUB_CLIENT_SECRET: z.string(),
        RESEND_API_KEY: z.string(),
        UPLOADTHING_SECRET: z.string(),
        UPLOADTHING_ID: z.string(),
        LEMONSQUEEZY_API_KEY: z.string(),
        LEMONSQUEEZY_STORE_ID: z.string(),
        LEMONSQUEEZY_WEBHOOK_SECRET: z.string(),
        BRIGHTDATA_API_KEY: z.string(),
        BRIGHTDATA_DATASET_ID: z.string(),
        DATASET_ID_INSTAGRAM: z.string(),
        DATASET_ID_TIKTOK: z.string(),
        OPENROUTER_API_KEY:z.string(),
        GEMINI_API_KEY: z.string(),
        LOGIN_COOKIE_SECRET: z.string(),
        CANVA_CLIENT_ID: z.string(),
        CANVA_CLIENT_SECRET: z.string(),
        CANVA_TEMPLATE_ID: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
        NEXT_PUBLIC_POSTHOG_KEY: z.string(),
        NEXT_PUBLIC_WAITLIST_MODE: z.enum(["on", "off"]).default("off"),
        NEXT_PUBLIC_MAINTENANCE_MODE: z.enum(["on", "off"]).default("off"),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
        UPLOADTHING_ID: process.env.UPLOADTHING_ID,
        LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY,
        LEMONSQUEEZY_STORE_ID: process.env.LEMONSQUEEZY_STORE_ID,
        LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        NEXT_PUBLIC_WAITLIST_MODE: process.env.NEXT_PUBLIC_WAITLIST_MODE,
        NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,

        BRIGHTDATA_API_KEY: process.env.BRIGHTDATA_API_KEY,
        BRIGHTDATA_DATASET_ID: process.env.BRIGHTDATA_DATASET_ID,
        DATASET_ID_INSTAGRAM: process.env.DATASET_ID_INSTAGRAM,
        DATASET_ID_TIKTOK: process.env.DATASET_ID_TIKTOK,

        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,

        GEMINI_API_KEY: process.env.GEMINI_API_KEY,

        LOGIN_COOKIE_SECRET: process.env.LOGIN_COOKIE_SECRET,

        CANVA_CLIENT_ID: process.env.CANVA_CLIENT_ID,
        CANVA_CLIENT_SECRET: process.env.CANVA_CLIENT_SECRET,
        CANVA_TEMPLATE_ID: process.env.CANVA_TEMPLATE_ID,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
