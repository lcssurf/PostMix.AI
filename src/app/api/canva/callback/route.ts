import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const uri = process.env.NEXTAUTH_URL!;

  const tokenRes = await fetch("https://api.canva.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code ?? "",
      client_id: process.env.CANVA_CLIENT_ID!,
      client_secret: process.env.CANVA_CLIENT_SECRET!,
      redirect_uri: `${uri}/api/canva/callback`
    }).toString()
  });

  const token = await tokenRes.json();

  if (!token.access_token) {
    return NextResponse.json({ error: "Erro ao conectar com Canva" }, { status: 400 });
  }

  const response = NextResponse.redirect(`${uri}/dashboard?canva_connected=true`);

  // ⚠️ Apenas para testes — ideal é salvar via session/jwt/db
  response.cookies.set("canva_token", token.access_token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge:  7 * 24 * 60 * 60, // 7 dias
  });

  return response;
}
