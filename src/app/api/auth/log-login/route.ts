// app/api/log-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { logins } from "@/server/db/schema";
import { getToken } from "next-auth/jwt";
import { parse } from "cookie";
import { verify } from "@/validations/hmac";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  if (!token || !token.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieHeader = req.headers.get("cookie") ?? "";
  const parsed = parse(cookieHeader);

  const ip = parsed["client-ip"] ? verify(parsed["client-ip"]) : null;
  const userAgent = parsed["client-ua"] ? verify(parsed["client-ua"]) : null;
  const device = userAgent?.includes("Mobile") ? "mobile" : "desktop";

  if (!ip || !userAgent) {
    console.warn("Login log rejeitado: cookies inválidos.");
    console.warn("Cookies:", { ip, userAgent });
    console.warn("Parsed cookies:", parsed);
    return NextResponse.json({ error: "Invalid cookies" }, { status: 400 });
  }

  await db.insert(logins).values({
    userId: token.id,
    ipAddress: ip,
    userAgent,
    device,
  });

  return NextResponse.json({ ok: true });
}
