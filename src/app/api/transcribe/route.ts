import { NextRequest, NextResponse } from "next/server";
import {
    GoogleGenAI,
    createUserContent,
    createPartFromUri,
  } from "@google/genai";

const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!}); // usa chave segura

export async function POST(req: NextRequest) {
  try {
    const { image_url, video_url, post_url } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Aqui você faria a chamada para gerar a transcrição (texto baseado na imagem/video)

    const prompt = `Analise este conteúdo e tente transcrever ou descrever o que vê: ${post_url || image_url || video_url}`;

    const result = await model.generateContent([prompt]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ transcription: text });
  } catch (error) {
    console.error("Erro na API de transcrição:", error);
    return NextResponse.json({ error: "Erro interno ao transcrever" }, { status: 500 });
  }
}
