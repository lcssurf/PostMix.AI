// app/api/instagram/route.ts
export const maxDuration = 300; // 60 segundos (seu plano Vercel Pro permite)

import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { BrightDataService } from "@/server/brightdata";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  console.log("📸 Iniciando busca de perfil do Instagram... ", new Date().toISOString());
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "username obrigatório" }, { status: 400 });
  }

  try {
    const data = await BrightDataService.fetchInstagramProfileWithPolling(username);

    console.log("📸 Busca de perfil do Instagram concluída: ", new Date().toISOString());
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Erro na API /instagram:", error);
    return NextResponse.json(
      { error: error?.message || "Erro interno ao buscar perfil" },
      { status: 500 }
    );
  }
}