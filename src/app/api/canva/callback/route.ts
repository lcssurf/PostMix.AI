import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import {
    getCanvaAuthSessionData,
    saveCanvaTokensMutation,
} from "@/server/actions/user/mutations";

export async function GET(request: NextRequest) {
    try {
        // Sessão do usuário
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Usuário não autenticado." },
                { status: 401 },
            );
        }

        // Verificar parâmetros obrigatórios
        const code = request.nextUrl.searchParams.get("code");
        const returnedState = request.nextUrl.searchParams.get("state");

        if (!code || !returnedState) {
            return NextResponse.json(
                { error: 'Parâmetros "code" ou "state" ausentes.' },
                { status: 400 },
            );
        }

        // Buscar code_verifier e state do DB
        const { canvaCodeVerifier, canvaState } =
            await getCanvaAuthSessionData();

        if (returnedState !== canvaState) {
            return NextResponse.json(
                { error: "State inválido. Possível ataque CSRF." },
                { status: 403 },
            );
        }

        // Validar variáveis de ambiente
        const appURL = process.env.NEXTAUTH_URL;
        const clientId = process.env.CANVA_CLIENT_ID;
        const clientSecret = process.env.CANVA_CLIENT_SECRET;
        const redirectUri = process.env.CANVA_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            return NextResponse.json(
                { error: "Variáveis de ambiente do Canva ausentes." },
                { status: 500 },
            );
        }

        // Solicitar token
        const tokenResponse = await fetch(
            "https://api.canva.com/rest/v1/oauth/token",
            {
                method: "POST",
                headers: {
                    Authorization:
                        "Basic " +
                        Buffer.from(`${clientId}:${clientSecret}`).toString(
                            "base64",
                        ),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: redirectUri,
                    code_verifier: canvaCodeVerifier,
                }).toString(),
            },
        );

        // Lê o corpo uma única vez
        const rawBody = await tokenResponse.text();
        const contentType = tokenResponse.headers.get("content-type") || "";

        if (!tokenResponse.ok) {
            console.error("[Canva token error]", rawBody);
            return NextResponse.json(
                { error: "Erro ao trocar código por token.", raw: rawBody },
                { status: tokenResponse.status },
            );
        }

        if (!contentType.includes("application/json")) {
            console.error("[Canva token: resposta não-JSON]", rawBody);
            return NextResponse.json(
                { error: "Resposta inesperada da Canva.", raw: rawBody },
                { status: 502 },
            );
        }

        const tokenData = JSON.parse(rawBody);

        if (
            !tokenData.access_token ||
            !tokenData.refresh_token ||
            !tokenData.expires_in
        ) {
            return NextResponse.json(
                { error: "Resposta incompleta da Canva", tokenData },
                { status: 500 },
            );
        }

        await saveCanvaTokensMutation({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
        });

        return NextResponse.redirect(new URL(`${appURL}/dashboard`, request.url));
    } catch (error) {
        console.error("[Callback Canva: erro inesperado]", error);
        return NextResponse.json(
            { error: "Erro inesperado no callback da Canva." },
            { status: 500 },
        );
    }
}
