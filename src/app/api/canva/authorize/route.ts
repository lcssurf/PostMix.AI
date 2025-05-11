import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const OAUTH_STATE_COOKIE = "canva_oauth_state";
const OAUTH_VERIFIER_COOKIE = "canva_oauth_code_verifier";

export async function GET(req: NextRequest) {
  const clientId = process.env.CANVA_CLIENT_ID!;
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/canva/callback`;
  const scope = "design:content asset design:meta profile";

  // 1. Gera código de verificação (PKCE)
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest()
    .toString("base64url");

  // 2. Gera o estado (anti-CSRF)
  const state = crypto.randomBytes(16).toString("hex");

  // 3. Cria a URL de autorização com PKCE
  const url = new URL("https://www.canva.com/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  // 4. Salva cookies
  const response = NextResponse.redirect(url.toString());
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });
  response.cookies.set(OAUTH_VERIFIER_COOKIE, codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });

  return response;
}

