// app/api/auth/canva/route.ts

import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.CANVA_CLIENT_ID!;
  const uri = process.env.NEXTAUTH_URL!;
  const redirectUri = encodeURIComponent(`${uri}/api/canva/callback`);
  const scopes = encodeURIComponent("design:content asset design:meta profile");

  const url = `https://www.canva.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`; //&scope=${scopes}`;

  return NextResponse.redirect(url);
}
