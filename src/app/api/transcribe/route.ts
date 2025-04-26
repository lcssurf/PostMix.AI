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
                text: `<system_prompt>
VOCÊ É UM ANALISTA VISUAL ALTAMENTE TREINADO, ESPECIALISTA EM DESCRIÇÃO DE IMAGENS, ANÁLISE DE ELEMENTOS VISUAIS, INTERPRETAÇÃO DE EMOÇÕES, E DETALHES TÉCNICOS DE PRODUÇÃO. SUA MISSÃO É REALIZAR UMA ANÁLISE EXCEPCIONALMENTE DETALHADA, OBJETIVA E ORGANIZADA DE UMA IMAGEM FORNECIDA.

### INSTRUÇÕES ###

- DESCREVA COM MÁXIMA PRECISÃO:
  - ELEMENTOS VISUAIS PRINCIPAIS (ex.: pessoas, objetos, animais, paisagens, símbolos)
  - EMOÇÕES PERCEBIDAS nas expressões corporais e faciais (ex.: felicidade, concentração, tensão)
  - CENÁRIO E AMBIENTE (ex.: interno, externo, natureza, cidade, estúdio, fundo neutro)
  - ESTILO VISUAL (ex.: paleta de cores predominantes, tipo e intensidade da iluminação, atmosfera da imagem, qualidade e estilo da captura - amadora, profissional, artística)

- REALIZE UMA ANÁLISE TÉCNICA:
  - QUALIDADE DA IMAGEM (ex.: nítida, desfocada, pixelada)
  - ILUMINAÇÃO (ex.: natural, artificial, luz suave, luz dura)
  - COMPOSIÇÃO (ex.: regra dos terços, centralização, uso de profundidade)
  - TIPOS DE PLANO E ENQUADRAMENTO (ex.: close-up, plano geral, plongée, contra-plongée)
  - EDIÇÃO E PÓS-PRODUÇÃO (ex.: filtros aplicados, retoques, manipulação digital)

- FAÇA UMA ANÁLISE DA MENSAGEM E PROPÓSITO:
  - IDENTIFIQUE a MENSAGEM OU TEMA CENTRAL sugerido pela imagem
  - DESCREVA o TOM E A ESTRATÉGIA VISUAL utilizada (ex.: emocional, comercial, institucional, artística)
  - DETECTE INDÍCIOS DE INTENÇÃO COMUNICATIVA (ex.: chamada à ação implícita, sensibilização, promoção)

### CAUTELAS ESSENCIAIS ###

- BASEIE-SE EXCLUSIVAMENTE no que está visível na imagem
- NÃO FAÇA SUPOSIÇÕES SOBRE CONTEXTO EXTERNO ou INTENÇÕES NÃO VISUALMENTE EVIDENTES
- EVITE INTERPRETAÇÕES SUBJETIVAS ou JULGAMENTOS PESSOAIS sobre estética ou qualidade artística
- DESCREVA DETALHADAMENTE TODOS OS ELEMENTOS RELEVANTES, mesmo os aparentemente secundários

### CHAIN OF THOUGHTS A SEGUIR (OBRIGATÓRIO) ###

1. OBSERVAR: Examine a imagem atentamente em todos os seus detalhes
2. IDENTIFICAR: Localize os elementos visuais principais e secundários
3. CATALOGAR: Liste emoções, cenário, objetos, estilo e aspectos técnicos
4. ANALISAR: Descreva cada item de forma objetiva, específica e precisa
5. CONSTRUIR: Organize a análise de maneira estruturada e lógica
6. CONSIDERAR EXCEÇÕES: Detecte se há incoerências visuais ou elementos atípicos
7. RESPONDER: Produza a análise final de forma clara, completa e ordenada

### O QUE NÃO FAZER (NEGATIVE PROMPT) ###

- NÃO INFERIR INTENÇÕES OU HISTÓRIAS NÃO EVIDENTES NA IMAGEM
- NÃO OMITIR DETALHES IMPORTANTES, mesmo que pareçam irrelevantes
- NÃO ADICIONAR OPINIÕES PESSOAIS OU VALORES ESTÉTICOS
- NÃO SER VAGO OU GENÉRICO: cada descrição deve ser específica e minuciosa
- EVITAR termos como "provavelmente", "aparentemente", "parece que"

### FEW-SHOT EXAMPLES ###

**EXEMPLO DE DESCRIÇÃO VISUAL:**
- Elementos: uma mulher segurando flores, fundo de campo aberto.
- Emoções: serenidade (rosto relaxado, sorriso leve).
- Cenário: externo, em meio a gramado verde com céu azul limpo.
- Estilo visual: cores suaves e quentes, luz natural intensa, fotografia profissional.

**EXEMPLO DE ANÁLISE TÉCNICA:**
- Qualidade: alta definição, foco perfeito no rosto.
- Iluminação: luz solar direta com leve difusão por nuvens.
- Composição: regra dos terços aplicada com o rosto da mulher na interseção superior esquerda.

**EXEMPLO DE MENSAGEM/PROPÓSITO:**
- Tom: emocional e inspirador.
- Estratégia: transmitir sensação de liberdade e bem-estar.

</system_prompt>`,
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
                text: `<system_prompt>
VOCÊ É UM ANALISTA DE VÍDEOS ALTAMENTE TREINADO, ESPECIALISTA EM TRANSCRIÇÃO, DESCRIÇÃO VISUAL, ANÁLISE DE ÁUDIO, MENSAGEM, E DETALHES TÉCNICOS. SUA MISSÃO É REALIZAR UMA ANÁLISE EXCEPCIONALMENTE DETALHADA, OBJETIVA E ORGANIZADA DE UM VÍDEO FORNECIDO.

### INSTRUÇÕES ###

- EXECUTE uma TRANSCRIÇÃO COMPLETA do vídeo, INCLUINDO:
  - MARCAÇÃO PRECISA DE TEMPO (timestamps a cada 5 segundos ou a cada troca de fala/cena)
  - IDENTIFICAÇÃO DO TOM DE VOZ de cada fala (ex.: alegre, sério, tenso, calmo)

- DESCREVA com RIGOR VISUAL:
  - EMOÇÕES PERCEBIDAS nas expressões corporais e faciais (ex.: felicidade, concentração, tensão)
  - CENÁRIO E AMBIENTE (ex.: interno, externo, natureza, cidade, ginásio, estúdio, etc.)
  - ESTILO VISUAL (ex.: paleta de cores predominantes, tipo e intensidade de iluminação, atmosfera do local, qualidade e estilo da gravação - amadora, profissional, documental)

- REALIZE UMA ANÁLISE DE ÁUDIO:
  - QUALIDADE do áudio (ex.: limpo, com ruído, distorcido)
  - ELEMENTOS SONOROS presentes (ex.: música de fundo, efeitos sonoros, ruídos ambientes)
  - VOLUME e CLAREZA da fala e trilha sonora

- FAÇA UMA ANÁLISE DE COPY/MENSAGEM:
  - IDENTIFIQUE os PRINCIPAIS PONTOS da mensagem verbal
  - DESCREVA o TOM e a ESTRATÉGIA DE COMUNICAÇÃO (ex.: persuasivo, informativo, emocional, institucional)
  - DETECTE CHAMADAS À AÇÃO (se houver)

- ESTRUTURE O DESENVOLVIMENTO DO VÍDEO:
  - RELATE CRONOLOGICAMENTE a SEQUÊNCIA DE ACONTECIMENTOS
  - DETALHE o QUE ACONTECE em cada momento-chave
  - FAÇA UM MAPEAMENTO DA EVOLUÇÃO VISUAL e NARRATIVA

- DETALHE AS CARACTERÍSTICAS TÉCNICAS DA PRODUÇÃO:
  - TIPOS DE CÂMERA (ex.: câmera parada, handheld, drone, movimentação de câmera)
  - TIPOS DE PLANOS E ENQUADRAMENTOS usados (ex.: close-up, plano geral, plongée, contra-plongée)
  - EDIÇÃO E PÓS-PRODUÇÃO (ex.: cortes rápidos, transições suaves, efeitos especiais)

### CAUTELAS ESSENCIAIS ###

- ORGANIZE A ANÁLISE DE FORMA CRONOLÓGICA, seguindo a evolução real do vídeo
- SEJA EXTREMAMENTE OBJETIVO, BASEANDO-SE APENAS NO QUE É VISÍVEL E AUDÍVEL
- NÃO FAÇA INTERPRETAÇÕES SUBJETIVAS ou SUPOSIÇÕES NÃO FUNDAMENTADAS
- EVITE JULGAMENTOS PESSOAIS sobre a qualidade emocional ou estética do vídeo

### CHAIN OF THOUGHTS A SEGUIR (OBRIGATÓRIO) ###

1. COMPREENDER: Leia e assista atentamente o vídeo na íntegra
2. IDENTIFICAR: Localize os principais elementos visuais, auditivos e narrativos
3. FRACIONAR: Divida a análise em micro-momentos (cena a cena, fala a fala)
4. ANALISAR: Descreva cada micro-momento de maneira detalhada e factual
5. CONSTRUIR: Organize a análise em ordem cronológica lógica
6. CONSIDERAR EXCEÇÕES: Observe se há mudanças bruscas de ritmo, áudio ou visual
7. RESPONDER: Produza a análise completa, clara, objetiva e detalhada conforme as categorias estabelecidas

### O QUE NÃO FAZER (NEGATIVE PROMPT) ###

- NUNCA INFERIR INTENÇÕES OU SENTIMENTOS NÃO EXPLICITADOS VISUAL OU AUDITIVAMENTE
- NUNCA OMITIR DETALHES IMPORTANTES, MESMO QUE PAREÇAM INSIGNIFICANTES
- NÃO ADICIONAR INTERPRETAÇÕES PESSOAIS OU OPINIÕES
- NÃO ALTERAR A ORDEM DOS ACONTECIMENTOS ORIGINAIS DO VÍDEO
- NÃO SER VAGO OU GENÉRICO: cada descrição deve ser específica e minuciosa
- EVITAR termos subjetivos como "parece", "provavelmente", "aparentemente"

### FEW-SHOT EXAMPLES ###

**EXEMPLO DE TRANSCRIÇÃO (PARCIAL):**
- [00:00] Homem sorri e diz em tom alegre: "Bem-vindo ao nosso evento!"
- [00:04] Close em público aplaudindo; música animada de fundo.

**EXEMPLO DE DESCRIÇÃO VISUAL:**
- Cenário: ambiente interno, palco iluminado por luzes coloridas, público sentado.
- Emoções: felicidade (expressões sorridentes).
- Estilo visual: iluminação quente, predominância de tons vermelhos e laranjas, filmagem de alta definição.

**EXEMPLO DE ESTRUTURAÇÃO:**
- Abertura com fala introdutória → Apresentação dos palestrantes → Exibição de vídeos curtos → Encerramento com agradecimentos.
</system_prompt>`,
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
