import { NextResponse } from "next/server";
import crypto from "crypto";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth/next";
import { updateStateAndCodeVerifierMutation } from "@/server/actions/user/mutations";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  const canvaClientId = process.env.CANVA_CLIENT_ID;
  const canvaRedirectURL = process.env.CANVA_REDIRECT_URI;

  if (!canvaClientId || !canvaRedirectURL) {
    return NextResponse.json(
      { error: "CANVA_CLIENT_ID ou CANVA_REDIRECT_URI não configurados." },
      { status: 500 }
    );
  }

  try {
    const canvaCodeVerifier = crypto.randomBytes(96).toString("base64url");
    const codeChallenge = crypto
      .createHash("sha256")
      .update(canvaCodeVerifier)
      .digest("base64url");

    const canvaState = crypto.randomBytes(96).toString("base64url");

    // ✅ Chamada à mutation centralizada
    await updateStateAndCodeVerifierMutation({
      canvaState,
      canvaCodeVerifier,
    });

    const uri = `https://www.canva.com/api/oauth/authorize?code_challenge=${encodeURIComponent(
      codeChallenge
    )}&code_challenge_method=s256&scope=${encodeURIComponent(
      "design:content:read design:meta:read design:content:write asset:read asset:write profile:read"
    )}&response_type=code&client_id=${encodeURIComponent(
      canvaClientId
    )}&state=${encodeURIComponent(canvaState)}&redirect_uri=${encodeURIComponent(
      canvaRedirectURL
    )}`;

    return NextResponse.redirect(uri);
  } catch (error) {
    console.error("Erro ao processar autorização:", error);
    return NextResponse.json(
      { error: "Erro ao gerar URL de autorização." },
      { status: 500 }
    );
  }
}
