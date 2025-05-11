import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("canva_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Não conectado ao Canva" }, { status: 401 });
  }

  const TEMPLATE_ID = process.env.CANVA_TEMPLATE_ID!;
  const body = await req.json();

  const create = await fetch("https://api.canva.com/v1/designs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      template_id: TEMPLATE_ID,
      title: body?.titulo || "Post automático do PostMix"
    })
  });

  const created = await create.json();

  if (!created?.id) {
    return NextResponse.json({ error: "Erro ao gerar design", details: created }, { status: 500 });
  }

  const link = `https://www.canva.com/design/${created.id}/edit`;
  return NextResponse.json({ url: link });
}
