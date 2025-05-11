import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("canva_token");

  return NextResponse.json({
    connected: !!token?.value
  });
}
