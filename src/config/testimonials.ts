/**
 * This file is used to store the testimonials for the homepage.
 * The testimonials are stored as an array of arrays of arrays.
 * Each array represents a column of testimonials.
 * Each inner array represents a row of testimonials.
 * Each testimonial is an object with a body and author property.
 *
 * @note add your testimonials evenly
 */

type Testimonial = {
    body: string;
    author: {
        name: string;
        handle: string;
        imageUrl: string;
        logoUrl?: string;
    };
};

export const featuredTestimonial: Testimonial = {
    body: "O PostMix.ai revolucionou minha forma de criar conteúdo. Agora, em vez de perder horas pensando em ideias, eu foco no que realmente importa: me conectar com meu público.",
    author: {
        name: "Marina Azevedo",
        handle: "marinacria",
        imageUrl:
            "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=facearea&facepad=2&w=1024&h=1024&q=80",
        logoUrl: "https://tailwindui.com/img/logos/workcation-logo-gray-900.svg",
    },
};


export const testimonials: Testimonial[][][] = [
    [
        [
            {
                body: "Com o PostMix.ai, consegui transformar minhas ideias em conteúdo pronto em minutos. É como ter um time de marketing só pra mim.",
                author: {
                    name: "Camila Duarte",
                    handle: "camidigital",
                    imageUrl:
                        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
            },
            {
                body: "Sou designer e nunca soube como me comunicar no Instagram. Agora, minha presença online parece muito mais profissional.",
                author: {
                    name: "Renato Borges",
                    handle: "renatoborgesux",
                    imageUrl:
                        "https://images.unsplash.com/photo-1603415526960-f7e0328f83f5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
            },
        ],
        [
            {
                body: "Já testei várias ferramentas, mas nenhuma me ajudou tanto quanto o PostMix. É direto ao ponto e gera resultado.",
                author: {
                    name: "Isabela Martins",
                    handle: "isaempreende",
                    imageUrl:
                        "https://images.unsplash.com/photo-1614282984644-2f03e75aefc2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
            },
        ],
    ],
    [
        [
            {
                body: "Publicar com frequência era um pesadelo. Agora uso o PostMix toda semana para gerar conteúdo e manter meu perfil ativo.",
                author: {
                    name: "Diego Ribeiro",
                    handle: "diegocria",
                    imageUrl:
                        "https://images.unsplash.com/photo-1603415527030-87ce0f4c0163?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
            },
        ],
        [
            {
                body: "A IA do PostMix realmente entende o que funciona. Meus conteúdos têm mais curtidas, salvamentos e comentários.",
                author: {
                    name: "Juliana Castro",
                    handle: "jucastrocopy",
                    imageUrl:
                        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
            },
            {
                body: "Nunca imaginei que postar no Instagram pudesse ser tão simples. O PostMix me economiza tempo e ainda melhora minha entrega.",
                author: {
                    name: "Fábio Leite",
                    handle: "fabiomarketing",
                    imageUrl:
                        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
            },
        ],
    ],
];

