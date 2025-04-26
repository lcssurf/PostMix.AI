export const maxDuration = 300; // 60 segundos (seu plano Vercel Pro permite)

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, createUserContent } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

class FileTooLargeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "FileTooLargeError";
    }
}

async function fetchAndConvertToBase64(url: string) {
    const head = await fetch(url, { method: "HEAD" });
    if (!head.ok) {
        throw new Error(`Erro ao acessar cabeçalho do arquivo: ${url}`);
    }

    const contentLength = head.headers.get("content-length");
    const contentType = head.headers.get("content-type") || "";

    if (
        !contentType.startsWith("image/") &&
        !contentType.startsWith("video/")
    ) {
        throw new Error(`Tipo de conteúdo inválido: ${contentType}`);
    }

    if (contentLength && Number(contentLength) > 20 * 1024 * 1024) {
        throw new FileTooLargeError(
            `Arquivo muito grande (${(Number(contentLength) / 1024 / 1024).toFixed(2)} MB).`,
        );
    }

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Erro ao baixar arquivo: ${url}`);
    }
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return { base64, mimeType: contentType };
}

export async function POST(req: NextRequest) {
    try {
        const { image_url, video_url } = await req.json();

        if (!image_url && !video_url) {
            return NextResponse.json(
                { error: "Nenhuma imagem ou vídeo fornecido." },
                { status: 400 },
            );
        }

        const parts: Array<
            | { inlineData: { mimeType: string; data: string } }
            | { text: string }
        > = [];

        if (image_url) {
            const base64Image = await fetchAndConvertToBase64(image_url);

            parts.push({
                inlineData: {
                    mimeType: base64Image.mimeType,
                    data: base64Image.base64,
                },
            });

            parts.push({
                text: `Observe atentamente esta imagem e forneça uma descrição detalhada, como se estivesse explicando para alguém que não pode vê-la.  
        Inclua detalhes sobre:
        
        - As principais pessoas, objetos ou elementos visuais
        - Expressões faciais, emoções ou ações que estejam acontecendo
        - Ambiente e cenário ao redor (ex.: indoor, outdoor, natureza, cidade)
        - Estilo visual da imagem (realista, minimalista, vibrante, monocromático, etc.)
        - Sensações que a imagem transmite (ex.: calma, tensão, alegria)
        - Cores predominantes e qualquer informação adicional relevante.
        
        Seja descritivo, mas objetivo. Evite interpretações subjetivas ou suposições não visíveis.`,
            });
        } else if (video_url) {
            const base64Video = await fetchAndConvertToBase64(video_url);

            parts.push({
                inlineData: {
                    mimeType: base64Video.mimeType,
                    data: base64Video.base64,
                },
            });

            parts.push({
                text: `Assista atentamente a este vídeo e descreva de forma completa e detalhada o que acontece do início ao fim.

                  Inclua:
                  - As principais ações, eventos ou movimentos que ocorrem
                  - Quem são os participantes ou personagens visíveis (se houver)
                  - Emoções percebidas (ex.: felicidade, concentração, tensão)
                  - Cenário e ambiente (ex.: local interno, externo, natureza, cidade, ginásio)
                  - Estilo visual (ex.: cores, iluminação, clima, qualidade da gravação)
                  - Sequência dos acontecimentos (ex.: primeiro acontece X, depois Y)

                  Organize a descrição de maneira cronológica, narrando a evolução do vídeo.
                  Evite interpretações subjetivas ou adições de informações que não estejam visíveis.

                  Seja objetivo, porém detalhado.`,
            });
        }

        const result = await genAI.models.generateContent({
            model: "gemini-2.0-flash-lite",
            contents: createUserContent(parts),
        });

        const text = result.text;

        console.log("Transcrição gerada:", text);

        return NextResponse.json({ transcription: text });
    } catch (error: any) {
        console.error("Erro na API de transcrição:", error);

        if (error instanceof FileTooLargeError) {
            return NextResponse.json(
                {
                    error: "Arquivo muito grande para transcrição (limite: 20MB)",
                },
                { status: 413 },
            ); // 413 Payload Too Large
        }

        return NextResponse.json(
            { error: error.message || "Erro interno ao transcrever" },
            { status: 500 },
        );
    }
}
