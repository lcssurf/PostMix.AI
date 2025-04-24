/**
 * This file contains the features data for the features page.
 *
 * @add a new feature, add a new object to the `features` array.
 * 1. Add id to the features object then use it as the id of the new feature object.
 * 2. Add title and inludedIn to the new feature object. (inludedIn is an array of pricing plan ids that include this feature)
 * 3. Add description to the new feature object.
 * 4. Add image to the new feature object.
 * 5. Add imageDark to the new feature object. (optional)
 */

export type Feature = {
    title: string;
    description: string;
    image: string;
    imageDark?: string;
};

export const features: Feature[] = [
    {
        title: "Análise dos seus próprios posts",
        description:
            "O PostMix.ai avalia seus conteúdos já publicados no Instagram para identificar os que mais engajam e gerar novas ideias com base neles.",
        image: "https://utfs.io/f/4e8f4e2f-5a03-4ee9-84ea-6aa10e63bcaf-r0z3sr.png",
    },
    {
        title: "Geração de conteúdo por IA",
        description:
            "Crie reels, carrosséis e legendas otimizadas com base no seu estilo, nicho e objetivo. A IA entende o que funciona e adapta ao seu perfil.",
        image: "https://utfs.io/f/72a2c035-69e0-46ca-84a8-446e4dabf77c-3koi6e.png",
    },
    {
        title: "Resultados em poucos cliques",
        description:
            "Escolha seus posts de base ou deixe que a IA selecione os melhores. Em segundos, você recebe conteúdo pronto para publicar.",
        image: "https://utfs.io/f/805616c1-22b8-4508-9890-9ba9e2867a41-p24dnn.png",
    },
];