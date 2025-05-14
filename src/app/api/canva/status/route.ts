import { getCanvaAuthSessionData, saveCanvaTokensMutation } from "@/server/actions/user/mutations";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ status: "unauthenticated" });
    }

    const canvaAuth = await getCanvaAuthSessionData();

    if (!canvaAuth || !canvaAuth.canvaAccessToken) {
      return NextResponse.json({ status: "not_connected" });
    }

    const now = new Date();
    const expiresAt = canvaAuth.canvaTokenExpiresAt ? new Date(canvaAuth.canvaTokenExpiresAt) : null;

    if (expiresAt && now < expiresAt) {
      return NextResponse.json({ status: "connected", expiresAt });
    }

    // 👇 Se estiver expirado, tenta renovar com refresh_token
    if (canvaAuth.canvaRefreshToken) {
      const refreshed = await refreshCanvaToken(canvaAuth.canvaRefreshToken);

      if (refreshed?.access_token) {
        await saveCanvaTokensMutation(refreshed);
        return NextResponse.json({
          status: "connected",
          expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
        });
      }
    }

    return NextResponse.json({ status: "expired" });
    
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ status: "error", message: "An unexpected error occurred." });
  }
}

export async function refreshCanvaToken(refreshToken: string) {
  const clientId = process.env.CANVA_CLIENT_ID!;
  const clientSecret = process.env.CANVA_CLIENT_SECRET!;

  const res = await fetch("https://api.canva.com/rest/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  const raw = await res.text();

  if (!res.ok) {
    console.error("[Canva refresh token error]", raw);
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("[Canva refresh parse error]", e, raw);
    return null;
  }
}

