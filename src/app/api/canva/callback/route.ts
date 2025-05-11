import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = req.cookies.get("canva_oauth_state")?.value;
  const codeVerifier = req.cookies.get("canva_oauth_code_verifier")?.value;

  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.json({ error: "Invalid OAuth callback." }, { status: 400 });
  }

  const tokenRes = await fetch("https://api.canva.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/canva/callback`,
      client_id: process.env.CANVA_CLIENT_ID!,
      code_verifier: codeVerifier,
    }).toString(),
  });

  const token = await tokenRes.json();

  if (!token.access_token) {
    return NextResponse.json({ error: "Token exchange failed", details: token }, { status: 500 });
  }

  // ✅ Salva o token como cookie
  const res = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?canva_connected=true`);
  res.cookies.set("canva_token", token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: token.expires_in ?? 3600,
  });

  return res;
}
