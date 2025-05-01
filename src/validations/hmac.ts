import crypto from "crypto";

const secret = process.env.LOGIN_COOKIE_SECRET as string;
if (!secret) {
  throw new Error("LOGIN_COOKIE_SECRET environment variable is not defined");
}

export function sign(value: string): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(value);
  return `${value}.${hmac.digest("hex")}`;
}

export function verify(signedValue: string): string | null {
    const [value, signature] = signedValue.split(".");
  
    if (!value || !signature) return null;
  
    const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
    return signature === expected ? value : null;
  }
  