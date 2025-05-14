// lib/canva-auth-utils.ts
import crypto from "crypto";

export const CANVA_CODE_VERIFIER_COOKIE = "canva_code_verifier";
export const CANVA_OAUTH_STATE_COOKIE = "canva_oauth_state";

export const SHORT_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  maxAge: 300, // 5 minutos
  path: "/"
};

export function generateCodeVerifier() {
  return crypto.randomBytes(64).toString("base64url");
}

export function generateCodeChallenge(codeVerifier: string) {
  return crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest()
    .toString("base64url");
}

export function generateState() {
  return crypto.randomBytes(16).toString("hex");
}
