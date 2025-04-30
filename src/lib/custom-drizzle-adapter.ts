// lib/custom-drizzle-adapter.ts
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

import { db } from "@/server/db";
import { sessions } from "@/server/db/schema";

// DrizzleAdapter já define a forma correta para `createSession`
type CreateSessionData = {
  userId: string;
  expires: Date;
  sessionToken: string;
};

export function CustomDrizzleAdapter(...args: Parameters<typeof DrizzleAdapter>) {
  const base = DrizzleAdapter(...args);

  return {
    ...base,

    async createSession(data: CreateSessionData) {
      const h = headers();
      const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      const ua = h.get("user-agent") ?? "unknown";

      // Cria sessão normalmente
      if (!base.createSession) {
        throw new Error("createSession is not defined in the base adapter.");
      }
      const session = await base.createSession(data);

      // Atualiza a sessão com IP e user-agent
      await db
        .update(sessions)
        .set({
          ipAddress: ip,
          userAgent: ua,
        })
        .where(eq(sessions.sessionToken, data.sessionToken));

      return session;
    },
  };
}
