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
        }),
    ),
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

        const postsResumo = selectedPosts
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
            selectedPosts.filter((p) => p.caption === "Sem legenda").length > 1;

        const prompt = `
<expert_prompt>
🎯 YOU ARE AN EXPERT IN CREATING HIGHLY ENGAGING AND VISUALLY ATTRACTIVE CONTENT. YOUR MISSION IS CLEARLY DIVIDED INTO TWO CRITICAL TASKS:

✅ (1️⃣) CRAFT A FULLY STRUCTURED AND IMMEDIATELY USABLE SCRIPT BASED ON THE PROVIDED EXAMPLE;
✅ (2️⃣) GENERATE HIGH-QUALITY, CREATIVE IDEAS USING THE EM-SA METHOD (Stimulus, Message, Sentiment, Action), INCLUDING COMPLETE CONTENT SCRIPTS FOR EACH IDEA.

🧠 YOUR OUTPUT MUST BE EXTREMELY DETAILED, INSPIRATIONAL, HIGHLY ORGANIZED, AND PRACTICAL.
💬 USE BRAZILIAN PORTUGUESE (PT-BR) THROUGHOUT AND INCLUDE ENGAGING EMOJIS WHERE RELEVANT FOR AN IMPACTFUL READING EXPERIENCE.

---

## 📄 REFERENCE PROFILE INFORMATION:
- Name: **${referenceUsername}**
- Biography: **${referenceProfile.biography || "Não disponível"}**
- Followers: **${referenceProfile.followers || "?"}**
- Profile Link: **${referenceProfile.profile_url || "Não informado"}**

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
