"use server";

export interface InstagramPost {
    url: string;
    images: string[];
    transcription: string;
    reel: boolean;
    videoURL?: string;
    carousel: boolean;
}

export interface InstagramProfile {
    username: string;
    private?: boolean;
    profilePicUrl: string;
    postsCount: string;
    followersCount: string;
    followsCount: string;
    bio: string;
    scrapedAt: string;
    posts: InstagramPost[];
}

export async function crawlUser(username: string): Promise<InstagramProfile> {
    const crawlerUrl = process.env.CRAWLER_URL;
    const crawlerApiKey = process.env.CRAWLER_API_KEY;

    if (!username) throw new Error("Username is required");
    if (!crawlerApiKey) throw new Error("CRAWLER_API_KEY is not defined");
    if (!crawlerUrl) throw new Error("CRAWLER_URL is not defined");

    // 🔹 Etapa 1: inicia o processamento com POST
    const postRes = await fetch(crawlerUrl, {
        method: "POST",
        headers: {
            "X-API-Key": crawlerApiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    if (!postRes.ok) {
        throw new Error(`Falha ao enfileirar usuário: ${postRes.statusText}`);
    }

    // 🔁 Etapa 2: polling com GET até receber os dados
    const maxWaitTimeMs = 30000;
    const pollingIntervalMs = 1200;
    const start = Date.now();

    while (Date.now() - start < maxWaitTimeMs) {
        console.log(
            `[CrawlUser] Aguardando ${pollingIntervalMs}ms antes de nova tentativa...`,
        );
        await new Promise((res) => setTimeout(res, pollingIntervalMs));

        console.log(
            `[CrawlUser] Fazendo GET: ${crawlerUrl}?username=${encodeURIComponent(username)}`,
        );
        const getRes = await fetch(
            `${crawlerUrl}?username=${encodeURIComponent(username)}`,
            {
                method: "GET",
                headers: {
                    "X-API-Key": crawlerApiKey,
                },
            },
        );

        if (!getRes.ok) {
            if (getRes.status === 404) {
                throw new Error(`[CrawlUser] Usuário não encontrado (404).`);
            }
            console.warn(
                `[CrawlUser] Requisição GET falhou: ${getRes.status} ${getRes.statusText}`,
            );
            continue;
        }

        let data: any;
        try {
            data = await getRes.json();
        } catch (err) {
            console.error(`[CrawlUser] Erro ao parsear JSON da resposta:`, err);
            continue;
        }

        console.log(
            `[CrawlUser] Resposta da API:`,
            JSON.stringify(data, null, 2),
        );

        if (data?.fromCache && data?.data) {
            if (data.notFound) {
                console.warn(`[CrawlUser] Usuário inexixtente.`);
                throw new Error(`Usuário ${username} não encontrado. Verifique o nome.`);
            }
            if(data.data.posts.length === 0) {
                console.warn(`[CrawlUser] Usuário encontrado, mas sem posts.`);
                throw new Error(`Usuário ${username} encontrado, mas não possui posts ou é privado.`);
            }
            console.log(`[CrawlUser] Dados encontrados no cache, retornando.`);
            return data.data as InstagramProfile;
        } else if (data.status === 'completed' && !data?.data) {
            console.log(`[CrawlUser] Dados não encontrados após processamento.`);
            throw new Error(`Dados não encontrados para o usuário ${username}. Tente novamente mais tarde.`);
        } else if (data.status === 'failed' && !data?.data) {
            throw new Error(`Dados não encontrados para o usuário ${username}. Tente novamente em alguns segundos.`);
        }
    }

    throw new Error("Tempo limite excedido ao aguardar conclusão. Tente novamente mais tarde.");
}
