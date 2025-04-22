# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.



## Recomendações de Modelos de IA

### 🏆 1. Qwen2.5-VL 7B Instruct — 9/10
✅ Multimodal real: entende imagens + vídeos  
✅ Suporta vários idiomas (incluindo português)  
✅ Compreende vídeos de até 20 minutos (!)  
✅ Gratuito  
🔻 Menor que o GPT-4-Vision, mas impressionante para um modelo de código aberto  
✅ Ideal para projetos com posts + imagens/vídeos  
🔹 Recomendado como o modelo principal para análise visual.

### 🥈 2. Google: Gemini 1.5 Flash 8B Experimental — 8.5/10
✅ Multimodal (imagens e vídeos)  
✅ Contexto de 1 milhão de tokens (!)  
⚠️ Experimental e pode ser instável/limitado por taxa  
🔻 Ainda em prévia, não pronto para produção  
🔹 Excelente, mas use com um fallback se instável.

### 🥉 3. Meta: Llama 3.1 8B Instruct — 8/10
🔹 Muito bom para redação e geração de conteúdo  
❌ Não é multimodal  
✅ Excelente desempenho linguístico, rápido, gratuito  
🔹 Ótimo como fallback para tarefas apenas de texto (sem imagens/vídeos).

### 4. Mistral: Mistral Nemo — 7.5/10
✅ Contexto de 128K, ótimo para análise contextual extensa  
❌ Sem suporte multimodal  
🔹 Muito bom para prompts longos (ex.: múltiplos posts + dados de perfil).

### 5. Mistral 7B Instruct — 7/10
✅ Bom custo-benefício  
❌ Sem suporte para imagens ou vídeos  
🔻 Contexto limitado.

### 6. Google: Gemma 2 9B — 6.5/10
✅ Muito eficiente  
❌ Não é multimodal  
🔻 Apenas 8K de contexto.

### 7. Meta: Llama 3.1 405B (base) — 6/10
🔻 Modelo base (não ajustado)  
❌ Menos útil para interação direta ou geração  
🔹 Só faz sentido se você quiser ajustá-lo.

### 8. Hugging Face: Zephyr 7B — 5/10
🔻 Contexto de 4K é muito limitado  
🔻 Modelo mais simples  
✅ Ótimo para chatbots, mas fraco para seu caso de uso.

---

### ✅ Conclusão (Sugestões Práticas de Uso)

| Foco                     | Modelo Sugerido          |
|--------------------------|--------------------------|
| Análise de imagens e vídeos | Qwen2.5-VL 7B           |
| Análise textual profunda | Llama 3.1 8B Instruct   |
| Alternativa multimodal   | Gemini 1.5 Flash 8B     |
| Fallback para contexto longo | Mistral Nemo            |

