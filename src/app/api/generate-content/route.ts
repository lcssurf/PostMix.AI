export const runtime = "nodejs"; // evitar timeout do edge (se for Next.js app route)
export const config = { maxDuration: 60 }; // permite até 60s no plano Pro

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

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
  console.log("📝 Iniciando geração de conteúdo... ", new Date().toISOString());
  
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

    const postsResumo = selectedPosts
      .map((post, i) => {
        const midia = post.video_url
          ? `🎞️ Vídeo: ${post.video_url}`
          : post.image_url
          ? `🖼️ Imagem: ${post.image_url}`
          : "Sem mídia";
        return `# POST ${i + 1}\n- LEGENDA: "${post.caption.slice(0, 300)}"\n- ENG. ❤️ ${post.likes || 0} | 💬 ${post.comments || 0}\n- ${midia}\n`;
      })
      .join("\n");

    const hasManyEmptyCaptions = selectedPosts.filter(p => p.caption === "Sem legenda").length > 1;

    const prompt = `
<expert_prompt>
VOCÊ É UM AGENTE CRIATIVO DE ALTO NÍVEL, ESPECIALIZADO EM CONTEÚDO PARA INSTAGRAM, DOMINANDO O NICHO DE **${niche.toUpperCase()}**.

SEU OBJETIVO É TRANSFORMAR INSIGHTS DE POSTS REAIS EM UM ÚNICO CONTEÚDO FINAL IMPACTANTE, COESO E PRONTO PARA POSTAGEM.

## ETAPAS DO SEU RACIOCÍNIO (CHAIN OF THOUGHTS):
1. COMPREENDA o perfil analisado e os temas recorrentes dos posts.
2. IDENTIFIQUE padrões de estilo, linguagem e engajamento.
3. CRIE um conteúdo original que respeite o tom, formato e objetivo indicados.
4. ESTRUTURE a resposta diretamente no formato solicitado, SEM explicações adicionais.

## PERFIL DE REFERÊNCIA:
- Nome: ${referenceProfile.full_name || referenceUsername}
- Bio: ${referenceProfile.biography || "Não disponível"}
- Seguidores: ${referenceProfile.followers || "?"}
- Perfil: ${referenceProfile.profile_url || "Não informado"}

## RESUMO DOS POSTS DE REFERÊNCIA:
${postsResumo}

## INSTRUÇÕES CRÍTICAS:
🎯 Objetivo: ${goal}
🧠 Público-alvo: ${audience}
🎙️ Tom desejado: ${tone}
📲 Formato solicitado: ${format.toUpperCase()}
${hasManyEmptyCaptions ? "Observação: vários posts estão sem legenda. Interprete o estilo e objetivo com base na mídia e perfil." : ""}

## SAÍDA ESPERADA:
- SE **Reels**: Roteiro dividido por blocos de tempo (ex: 0–5s, 5–10s...), incluindo:
  • Fala ou narração
  • Texto na tela
  • Sugestões visuais
  • Música/trilha recomendada

- SE **Carrossel**: 
  • Slide 1: Título chamativo
  • Slides 2+: Conteúdo sequencial com storytelling
  • Slide final: CTA claro e possível hashtag

- SE **Legenda**:
  • Texto envolvente, cativante, com gatilho emocional
  • Final com CTA e hashtags

⚠️ NUNCA forneça explicações ou variações alternativas.
✅ ENTREGUE APENAS O CONTEÚDO FINAL, PRONTO PARA PUBLICAÇÃO.
</expert_prompt>
    `.trim();

    // 👇 Tentativa com Qwen
    try {
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1200,
      });

      const caption = completion.choices[0]?.message?.content?.trim();


      if (!caption) throw new Error("Resposta da IA veio vazia.");

      console.log(new Date().toISOString(), "📝 Resposta da IA:", caption);
      

      // return NextResponse.json({
      //   content: [
      //     {
      //       caption,
      //       referencePostUrls: selectedPosts.map((p) => p.url),
      //     },
      //   ],
      // });
      // Para debug, retorna o raw da resposta da IA
      return NextResponse.json({ raw: completion });

    } catch (fallbackError) {
      console.warn("⚠️ Falha com modelo Qwen. Tentando fallback com GPT-4o...");

      const gptFallback = await openai.chat.completions.create({
        model: "qwen/qwen2.5-vl-72b-instruct:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1200,
      });

      const caption = gptFallback.choices[0]?.message?.content?.trim();

      if (!caption) throw new Error("Fallback GPT-4o também falhou.");

      return NextResponse.json({
        content: [
          {
            caption,
            referencePostUrls: selectedPosts.map((p) => p.url),
          },
        ],
      });
    }
  } catch (err: any) {
    console.error("❌ Erro na geração:", err);
    return NextResponse.json(
      { error: err.message || "Erro interno" },
      { status: 500 }
    );
  }
}
