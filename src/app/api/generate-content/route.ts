import { extractTextsFromRawContent } from "@/lib/content-normalize";
import { saveGeneratedContentMutation } from "@/server/actions/user/mutations";
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
    referenceUsername: z.string().optional(),
    referenceProfile: z.object({
        full_name: z.string().optional(),
        biography: z.string().optional(),
        followers: z.number().optional(),
        profile_url: z.string().optional(),
    }).optional(),
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
        }),
    ).optional(),
    goal: z.string(),
    niche: z.string(),
    audience: z.string(),
    tone: z.array(z.string()),
    format: z.string(),
    specificSubject: z.string().optional(),
});

export async function POST(req: Request) {
    console.log(
        "📝 Iniciando geração de conteúdo...",
        new Date().toISOString(),
    );

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
            specificSubject,
        } = RequestSchema.parse(body);

        console.log("📦 Dados recebidos:", {
            referenceUsername,
            selectedPosts,
        });

        const postsResumo = (selectedPosts ?? [])
            .map((post, i) => {
                const texto = post.transcription
                    ? post.transcription.join(" ").slice(0, 300)
                    : post.caption.slice(0, 300);

                return `# POST ${i + 1}
- Texto: "${texto}"
- ❤️ ${post.likes || 0} | 💬 ${post.comments || 0}
- Link: ${post.url || "não informado"}`;
            })
            .join("\n");

        const hasManyEmptyCaptions =
            (selectedPosts ?? []).filter((p) => p.caption === "Sem legenda").length > 1;

        let prompt = "";
        if (format === "carrossel") {
            prompt = `
<expert_prompt>
# PROMPT MAESTRO PARA CARROSSÉIS VIRAIS DE ALTO IMPACTO

Você é um especialista lendário em copywriting e engenharia de prompts, com 30 anos de experiência no mercado digital, dominando copywriting persuasivo, neurovendas, gatilhos mentais e criação de carrosséis virais.

## PRIMEIRA ETAPA: ANÁLISE DO CONTEÚDO DE REFERÊNCIA

Analise cuidadosamente o conteúdo de exemplo fornecido abaixo:

${postsResumo}

${hasManyEmptyCaptions ? "⚠️ ATENÇÃO: Diversas postagens não possuem legendas. Foque especialmente no estilo das mídias e na comunicação não-verbal do perfil." : ""}

PONTOS CRÍTICOS PARA SUA ANÁLISE:
- Estrutura geral do conteúdo
- Técnicas de comunicação (storytelling, CTAs, perguntas)
- Estilo e tom de linguagem
- Gatilhos emocionais e de engajamento

## ETAPA 2: CRIAÇÃO DA HEADLINE IMPACTANTE

Crie uma headline impactante para o primeiro slide do carrossel com estas especificações:
- Formato: CAIXA ALTA, sem emojis, sem pontuação final
- Estilo: Investigativo, provocativo, tom de mini documentário cultural
- Use OBRIGATORIAMENTE um destes modelos:
  * INVESTIGANDO [fenômeno] QUE [efeito cultural]
  * COMO [marca/pessoa] ESTÁ [ação estratégica]
  * O SEGREDO POR TRÁS DE [movimento/comportamento]
  * POR QUE [grupo/marca] ESTÁ [ação inesperada]
  * O PLANO DE [empresa] PARA [mudança ousada]
  * QUANDO [comportamento] VIROU [estratégia de marca]
  * A MARCA QUE VIROU [adjetivo provocador]: [impacto/contexto]
- Evite termos genéricos como "incrível", "diferente", "revolucionário"
- Evite copy emocional ou "fofa" demais — foque em tese + cultura + comportamento

## ETAPA 3: DESENVOLVIMENTO DOS 13 BLOCOS DE TEXTO

Após criar a headline, desenvolva o conteúdo completo do carrossel seguindo RIGOROSAMENTE estas especificações:

1. Crie EXATAMENTE 13 blocos de texto, numerados como "texto 1 -" até "texto 13 -"
2. Cada bloco deve conter EXATAMENTE o número de palavras indicado (±2 palavras):
   - texto 1 - 6 palavras
   - texto 2 - 11 palavras
   - texto 3 - 22 palavras
   - texto 4 - 19 palavras
   - texto 5 - 68 palavras
   - texto 6 - 11 palavras
   - texto 7 - 36 palavras
   - texto 8 - 49 palavras
   - texto 9 - 15 palavras
   - texto 10 - 41 palavras
   - texto 11 - 18 palavras
   - texto 12 - 54 palavras
   - texto 13 - 21 palavras

3. Estrutura estratégica obrigatória:
   - texto 1: Hook irresistível que ativa curiosidade ou instinto de urgência
   - textos 2-5: Profundidade do problema com identificação, storytelling ou contexto técnico
   - textos 6-8: Solução prática com frameworks, insights, estudos de caso ou aprendizados não óbvios
   - textos 9-13: Fechamento com CTA poderoso, reflexão ou provocação estratégica

## REGRAS INVIOLÁVEIS DE FORMATO E CONTEÚDO

1. Nunca use bullet points, listas numeradas, traços, emojis ou versos separados em linhas distintas
2. Todo o conteúdo deve ser redigido em parágrafos densos e corridos, com conectores e ritmo fluido
3. Aplique constantemente gatilhos mentais: autoridade, escassez, prova social, reciprocidade, curiosidade e urgência
4. A linguagem deve ser estratégica, fluida e emocionalmente inteligente
5. Adapte o conteúdo de acordo com público, nicho e plataforma
6. Cada bloco deve começar com "texto X -" seguido pelo conteúdo, sem qualquer outro elemento
7. Não inclua emojis, marcações de slide, quebras de linha, bullets, subtítulos ou frases adicionais
8. O resultado deve conter exclusivamente a headline e os 13 textos, nada além disso

## PROCESSO DE CONTROLE DE QUALIDADE OBRIGATÓRIO

Antes de entregar o carrossel, verifique se:
1. O conteúdo está envolvente do início ao fim
2. O conteúdo é denso, profundo e com insights acionáveis
3. A estrutura está 100% fluida, sem listas ou quebras automáticas
4. O CTA está alinhado com o objetivo estratégico
5. Cada texto está dentro da contagem exata de palavras (±2)
6. A headline segue um dos formatos obrigatórios

## INSTRUÇÕES DE ENTREGA

Sua entrega deve conter APENAS:
1. A HEADLINE em CAIXA ALTA (sem numeração ou explicação)
2. Os 13 blocos de texto numerados exatamente como "texto 1 -" até "texto 13 -"

Não adicione nenhuma explicação, comentário ou texto adicional além da headline e dos 13 blocos exatamente como solicitado.

## INFORMAÇÕES PARA O BRIEFING

1. Tema específico do carrossel: ${specificSubject || "Não informado"}
2. Objetivo principal (conversão, engajamento, educação, etc.): ${goal}
3. Público-alvo: ${audience}
4. Tom de voz desejado: ${tone}
5. CTA esperado: [Definir com base no ${goal}]


## INFORMAÇÕES ADICIONAIS DO USUÁRIO QUE DEVEM SER SEGUIDAS PARA A ENTREGA DO CONTEÚDO DE CARROSSEL:
- Nicho: ${niche.toUpperCase()}
- Formato: CARROSSEL
- Assunto: ${specificSubject}

Uma vez recebidas essas informações, entregue o carrossel completo sem mais perguntas ou explicações.

</expert_prompt>



    `.trim();
        } else {
            prompt = `
<expert_prompt>
🎯 YOU ARE AN EXPERT IN CREATING HIGHLY ENGAGING AND VISUALLY ATTRACTIVE CONTENT. YOUR MISSION IS CLEARLY DIVIDED INTO TWO CRITICAL TASKS:

✅ (1️⃣) CRAFT A FULLY STRUCTURED AND IMMEDIATELY USABLE SCRIPT BASED ON THE PROVIDED EXAMPLE;
✅ (2️⃣) GENERATE HIGH-QUALITY, CREATIVE IDEAS USING THE EM-SA METHOD (Stimulus, Message, Sentiment, Action), INCLUDING COMPLETE CONTENT SCRIPTS FOR EACH IDEA.

🧠 YOUR OUTPUT MUST BE EXTREMELY DETAILED, INSPIRATIONAL, HIGHLY ORGANIZED, AND PRACTICAL.
💬 USE BRAZILIAN PORTUGUESE (PT-BR) THROUGHOUT AND INCLUDE ENGAGING EMOJIS WHERE RELEVANT FOR AN IMPACTFUL READING EXPERIENCE.

---

## 📄 REFERENCE PROFILE INFORMATION:
- Name: **${referenceUsername}**
- Biography: **${referenceProfile?.biography || "Não disponível"}**
- Followers: **${referenceProfile?.followers || "?"}**
- Profile Link: **${referenceProfile?.profile_url || "Não informado"}**

---

## 🎯 USER INFORMATION:
- Objective: **${goal}**
- Target Audience: **${audience}**
- Tone of Voice: **${tone}**
- Desired Content Format: **${format.toUpperCase()}**
- Specific Topic: **${specificSubject || "Não informado"}**

---

# 🚀 PART 1: SCRIPT CREATION BASED ON THE EXAMPLE

📚 FIRST STEP: Carefully analyze the example content provided below:

<example_content>
${postsResumo}

${hasManyEmptyCaptions ? "⚠️ ATENÇÃO: Diversas postagens não possuem legendas. Foque especialmente no estilo das mídias e na comunicação não-verbal do perfil." : ""}
</example_content>

🔍 CRITICAL POINTS FOR YOUR ANALYSIS:
- Overall content structure
- Communication techniques (storytelling, CTAs, questions)
- Style and language tone
- Emotional and engagement triggers

🛠️ NOW, CREATE A NEW SCRIPT WITH THE FOLLOWING GUIDELINES:
- Topic: **${specificSubject}**
- Niche: **${niche.toUpperCase()}**

📋 SCRIPT CREATION INSTRUCTIONS:
1. Maintain a similar, but original structure;
2. Adapt communication techniques effectively for the new topic/audience;
3. Use the defined voice tone;
4. Integrate engagement elements naturally;
5. Format clearly using HTML tags (<h1>, <h2>, <p>).

📑 EXACT SCRIPT OUTPUT FORMAT:
html
<h1>[Título Principal]</h1>
<p>[Introdução inspiradora]</p>

<h2>[Tópico Principal 1]</h2>
<p>[Conteúdo envolvente do tópico 1]</p>

<h2>[Tópico Principal 2]</h2>
<p>[Conteúdo envolvente do tópico 2]</p>

<h2>[Tópico Principal 3]</h2>
<p>[Conteúdo envolvente do tópico 3]</p>

<p><strong>Conclusão:</strong> [Resumo poderoso + CTA claro]</p>


<main_script>
🚀 [Insira aqui o roteiro completo e desenvolvido seguindo rigorosamente as orientações acima.]
</main_script>

---

# 🌟 PART 2: COMPLETE IDEA GENERATION USING THE EM-SA METHOD

Now, based on the defined topic and niche:

## 🔥 1) TOP RECOMMENDED STIMULI
Select the 3 most impactful visual stimuli types from:
- Memes
- Flyers
- News
- AI-generated content
- Wiki-style infographics
- Native content (e.g., organic videos/stories)
- Before and After

<recommended_stimuli>
✅ [Listar aqui claramente os 3 tipos selecionados]
</recommended_stimuli>

---

## 💡 2) FULL CONTENT IDEAS WITH COMPLETE SCRIPTS PER STIMULUS

For each selected stimulus, provide:
- Suggested Titles/Themes
- Detailed Visual Reference
- Creative Pattern Break Tip
- Recommended Messaging Structure (AIDA, PAS, BAB)
- Complete Content Script Draft (HTML formatted)

### <stimulus_1>
- Type: [Nome do primeiro estímulo]
- Titles/Themes: [Lista com 3 sugestões detalhadas]
- Visual Reference: [Descrição detalhada]
- Pattern Break Tip: [Sugestão criativa para surpreender]
- Messaging Structure: [AIDA, PAS ou BAB]
- Complete Script:

[Insira o roteiro completo aqui]


</stimulus_1>

---

### <stimulus_2>
- Type: [Nome do segundo estímulo]
- Titles/Themes: [Lista com 3 sugestões detalhadas]
- Visual Reference: [Descrição detalhada]
- Pattern Break Tip: [Sugestão criativa para surpreender]
- Messaging Structure: [AIDA, PAS ou BAB]
- Complete Script:
html
[Insira o roteiro completo aqui]


</stimulus_2>

---

### <stimulus_3>
- Type: [Nome do terceiro estímulo]
- Titles/Themes: [Lista com 3 sugestões detalhadas]
- Visual Reference: [Descrição detalhada]
- Pattern Break Tip: [Sugestão criativa para surpreender]
- Messaging Structure: [AIDA, PAS ou BAB]
- Complete Script:
html
[Insira o roteiro completo aqui]


</stimulus_3>

---

# ✅ FINAL SUMMARY

<conclusion>
📈 O roteiro desenvolvido na PARTE 1 e os scripts detalhados da PARTE 2 potencializam sua comunicação e ampliam o impacto emocional e visual do conteúdo, garantindo maior conexão, engajamento e conversões, criando assim um ecossistema diversificado e completo para o nicho **${niche.toUpperCase()}**.
</conclusion>

---

# 🛑 CRUCIAL FINAL INSTRUCTIONS
- ALL OUTPUT MUST BE IN **BRAZILIAN PORTUGUESE (PT-BR)**.
- PROVIDE A HIGHLY DETAILED, PRACTICAL, AND IMMEDIATELY USABLE RESPONSE WITH RELEVANT EMOJIS.
- STRUCTURE CONTENT CLEARLY FOR EASY READING AND IMPLEMENTATION.

</expert_prompt>



    `.trim();
        }

        let caption: string | null = null;

        try {
            console.log("🚀 Tentando gerar com modelo principal");
            const completion = await openai.chat.completions.create({
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 30000,
            });

            caption = completion.choices[0]?.message?.content?.trim() ?? null;
            if (!caption) throw new Error("Resposta da IA veio vazia.");
        } catch (error) {
            console.warn(
                "⚠️ A geração principal falhou. Tentando fallback com outro modelo...",
            );

            const fallback = await openai.chat.completions.create({
                model: "meta-llama/llama-4-maverick:free",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 4000,
            });

            caption = fallback.choices[0]?.message?.content?.trim() ?? null;
            if (!caption) throw new Error("Fallback também falhou.");
        }

        console.log("✅ Conteúdo gerado:", caption);

        const content = extractTextsFromRawContent(caption);

        try {
            await saveGeneratedContentMutation({
                contentType: format as
                    | "carrossel"
                    | "legenda"
                    | "reels"
                    | "tiktok"
                    | "whatsapp",
                content: {
                    title: "PostMix - Geração de Conteúdo",
                    text: content.texts,
                },
            });
        } catch (error) {
            console.error("⚠️ Erro ao salvar conteúdo gerado:", error);
            return NextResponse.json(
                { error: "Erro ao salvar conteúdo gerado." },
                { status: 500 },
            );
        }
        console.log("✅ Conteúdo salvo no DB com sucesso.");
        

        return NextResponse.json({
            content: [
                {
                    caption,
                    referencePostUrls: (selectedPosts ?? []).map((p) => p.url),
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
