import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { getCanvaAuthSessionData } from "@/server/actions/user/mutations";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado." }, { status: 401 });
    }

    const tokens = await getCanvaAuthSessionData();
    if (!tokens?.canvaAccessToken) {
      return NextResponse.json({ error: "Conta do Canva não conectada." }, { status: 401 });
    }

    const body = await req.json();

    const canvaResponse = await fetch("https://api.canva.com/rest/v1/designs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokens.canvaAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        design_type: {
          type: "preset", // ou "custom"
          name: body?.designType || "doc", // "presentation", "whiteboard", etc.
          // width: 1080, height: 1920, // se for custom
        },
        title: body?.titulo || "Design do PostMix",
        asset_id: body?.assetId || undefined
      })
    });

    const rawBody = await canvaResponse.text();
    const contentType = canvaResponse.headers.get("content-type") || "";

    if (!canvaResponse.ok) {
      console.error("[Canva API Error]", rawBody);
      return NextResponse.json(
        { error: "Erro ao criar design.", raw: rawBody },
        { status: canvaResponse.status }
      );
    }

    if (!contentType.includes("application/json")) {
      console.error("[Resposta não-JSON da Canva]", rawBody);
      return NextResponse.json(
        { error: "Resposta inesperada da Canva.", raw: rawBody },
        { status: 502 }
      );
    }

    const result = JSON.parse(rawBody);
    const editUrl = result?.design?.urls?.edit_url;

    if (!editUrl) {
      return NextResponse.json(
        { error: "Design criado, mas URL de edição ausente.", design: result.design },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: editUrl });
  } catch (err) {
    console.error("[Erro inesperado ao criar design no Canva]", err);
    return NextResponse.json({ error: "Erro inesperado ao criar design." }, { status: 500 });
  }
}
