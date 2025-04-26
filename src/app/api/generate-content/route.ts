import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

export const maxDuration = 300; // 5 minutos

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://postmix.zanapp.com.br",
    "X-Title": "PostMix.AI",
  },
});

const RequestSchema = z.object({
  referenceUsername: z.string(),
  referenceProfile: z.object({
    full_name: z.string().optional(),
    biography: z.string().optional(),
    followers: z.number().optional(),
    profile_url: z.string().optional(),
  }),
  selectedPosts: z.array(
    z.object({
      caption: z.string(),
      transcription: z.array(z.string()).optional(),
      likes: z.number().optional(),
      comments: z.number().optional(),
      datetime: z.string().optional(),
      url: z.string().optional(),
      image_url: z.string().nullable().optional(),
      video_url: z.string().nullable().optional(),
    })
  ),
  goal: z.string(),
  niche: z.string(),
  audience: z.string(),
  tone: z.string(),
  format: z.string(),
});

export async function POST(req: Request) {
  console.log("📝 Iniciando geração de conteúdo...", new Date().toISOString());

  try {
    const body = await req.json();
    const {
      referenceUsername,
      referenceProfile,
      selectedPosts,
      goal,
      niche,
      audience,
      tone,
      format,
    } = RequestSchema.parse(body);

    console.log("📦 Dados recebidos:", { referenceUsername, selectedPosts });

    const postsResumo = selectedPosts.map((post, i) => {
      const texto = post.transcription
        ? post.transcription.join(" ").slice(0, 300)
        : post.caption.slice(0, 300);

      return `# POST ${i + 1}
- Texto: "${texto}"
- ❤️ ${post.likes || 0} | 💬 ${post.comments || 0}
- Link: ${post.url || "não informado"}`;
    }).join("\n");

    const hasManyEmptyCaptions = selectedPosts.filter(p => p.caption === "Sem legenda").length > 1;

    const prompt = `
<expert_prompt>
Você é um especialista em criação de conteúdo de alto impacto para Instagram, com foco no nicho de **${niche.toUpperCase()}**.

Utilize as transcrições e legendas fornecidas para criar um novo conteúdo único, original e adaptado conforme as orientações abaixo.

## Perfil de Referência:
- Nome: ${referenceUsername}
- Bio: ${referenceProfile.biography || "Não disponível"}
- Seguidores: ${referenceProfile.followers || "?"}
- Link: ${referenceProfile.profile_url || "Não informado"}

## Resumo dos Posts de Referência:
${postsResumo}

## Instruções:
🎯 Objetivo: ${goal}
🧠 Público-Alvo: ${audience}
🎙️ Tom: ${tone}
📲 Formato: ${format.toUpperCase()}
${hasManyEmptyCaptions ? "⚡ Atenção: Vários posts sem legenda. Foque nas mídias e no estilo geral do perfil." : ""}

## Regras:
- NÃO explique o que está fazendo.
- NÃO ofereça variações alternativas.
- Gere apenas o conteúdo final, pronto para publicação.

## Estrutura Esperada:
- Para **REELS**: roteiro dividido em blocos de tempo (ex: 0–5s, 5–10s...), fala, texto na tela, sugestões visuais e música.
- Para **CARROSSEL**: slides em sequência com storytelling e CTA final.
- Para **LEGENDA**: texto emocional e gatilhos + hashtags.

</expert_prompt>
    `.trim();

    let caption: string | null = null;

    try {
      console.log("🚀 Tentando gerar com modelo principal");
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-4-maverick:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      });

      caption = completion.choices[0]?.message?.content?.trim() ?? null;
      if (!caption) throw new Error("Resposta da IA veio vazia.");

    } catch (error) {
      console.warn("⚠️ A geração principal falhou. Tentando fallback com outro modelo...");

      const fallback = await openai.chat.completions.create({
        model: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      });

      caption = fallback.choices[0]?.message?.content?.trim() ?? null;
      if (!caption) throw new Error("Fallback também falhou.");
    }

    console.log("✅ Conteúdo gerado:", caption);

    return NextResponse.json({
      content: [
        {
          caption,
          referencePostUrls: selectedPosts.map((p) => p.url),
        },
      ],
    });

  } catch (err: any) {
    console.error("❌ Erro na geração:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 },
    );
  }
}
