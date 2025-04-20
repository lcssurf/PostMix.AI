// drizzle.config.ts
// import { defineConfig } from "drizzle-kit";
import { type Config } from "drizzle-kit";
import { env } from "@/env.js";

export default {
  // Caminho para seu schema Drizzle em TS
  schema: "./src/server/db/schema.ts",

  // Dialeto do banco – aqui PostgreSQL
  dialect: "postgresql",

  // String de conexão via seu .env
  dbCredentials: {
    url: env.DATABASE_URL,
  },

  // Diretório onde serão geradas as migrations SQL
  out: "./drizzle/migrations",

  // (Opcional) Filtrar tabelas que começam com esse prefixo
  tablesFilter: ["rapidlaunch-saas-starterkit_*"],
} satisfies Config;
