/**
 * This file contains the pricing data for the pricing page.
 *
 * @add a new pricing plan, add a new object to the `pricing` array.
 * 1. Add id to the pricingIds object then use it as the id of the new pricing object.
 * 2. Add badge(optional), title, description, price, currency, duration, highlight, popular, and uniqueFeatures(optional) to the new pricing object.
 * 3. if the new pricing plan has unique features, add a new object to the `uniqueFeatures` array.
 *
 * @add a new feature, add a new object to the `features` array.
 * 1. Add id to the features object then use it as the id of the new feature object.
 * 2. Add title and inludedIn to the new feature object. (inludedIn is an array of pricing plan ids that include this feature)
 */

export type PrincingPlan = {
    id: string;
    badge?: string;
    title: string;
    description: string;
    price: {
        monthly: number;
        yearly: number;
    };
    currency: {
        code: string;
        symbol: string;
    };
    duration: string;
    highlight: string;
    buttonHighlighted: boolean;
    uniqueFeatures?: string[];
    variantId?: {
        monthly: number;
        yearly: number;
    };
};

export type PricingFeature = {
    id: string;
    title: string;
    inludedIn: string[];
};

export const pricingIds = {
    free: "free",
    pro: "pro",
    premium: "premium",
} as const;

export const pricingFeatures: PricingFeature[] = [
    {
        id: "1",
        title: "Análise de concorrentes",
        inludedIn: [pricingIds.free, pricingIds.pro, pricingIds.premium],
    },
    {
        id: "2",
        title: "Geração de conteúdos automatizada",
        inludedIn: [pricingIds.free, pricingIds.pro, pricingIds.premium],
    },
    {
        id: "3",
        title: "Tipos de conteúdo: Legendas",
        inludedIn: [pricingIds.free],
    },
    {
        id: "4",
        title: "Tipos de conteúdo: Reels, Carrosséis e Legendas",
        inludedIn: [pricingIds.pro],
    },
    {
        id: "5",
        title: "Todos os tipos de conteúdo (Reels, Carrosséis, Legendas e mais)",
        inludedIn: [pricingIds.premium],
    },
    {
        id: "6",
        title: "Personalização de copy (Tom de voz)",
        inludedIn: [pricingIds.pro, pricingIds.premium],
    },
    {
        id: "7",
        title: "Histórico de gerações",
        inludedIn: [pricingIds.free, pricingIds.pro, pricingIds.premium],
    },
    {
        id: "8",
        title: "Suporte básico",
        inludedIn: [pricingIds.free],
    },
    {
        id: "9",
        title: "Suporte rápido",
        inludedIn: [pricingIds.pro],
    },
    {
        id: "10",
        title: "Suporte prioritário",
        inludedIn: [pricingIds.premium],
    },
    {
        id: "11",
        title: "Múltiplos perfis gerenciados",
        inludedIn: [pricingIds.premium],
    },
    {
        id: "12",
        title: "Agendamento automático de posts (em breve)",
        inludedIn: [pricingIds.premium],
    },
    {
        id: "13",
        title: "Sem marca d'água 'Powered by PostMix'",
        inludedIn: [pricingIds.pro, pricingIds.premium],
    },
];


export const pricingPlans: PrincingPlan[] = [
    {
        id: pricingIds.free,
        title: "Gratuito",
        description: "Comece a criar seus conteúdos com um plano gratuito e veja o poder do PostMix.AI.",
        price: {
            monthly: 0,
            yearly: 0,
        },
        currency: {
            code: "BRL",
            symbol: "R$",
        },
        duration: "Para sempre",
        highlight: "Sem necessidade de cartão de crédito. Sem taxas escondidas.",
        buttonHighlighted: false,
        uniqueFeatures: [
            "Análise de até 1 concorrente",
            "Geração de até 5 conteúdos por mês",
            "Tipos de conteúdo: Reels e Legendas",
            "Histórico de gerações por 7 dias",
            "Suporte básico",
            "Marca d'água 'Powered by PostMix'",
        ],
    },
    {
        id: pricingIds.pro,
        badge: "Mais Popular",
        title: "Pro",
        description: "Ideal para criadores de conteúdo e pequenos negócios que querem crescer com consistência.",
        price: {
            monthly: 39,
            yearly: 390,
        },
        variantId: { monthly: 495628, yearly: 770604 },
        currency: {
            code: "BRL",
            symbol: "R$",
        },
        duration: "por mês",
        highlight: "Comece agora! Garantia de reembolso de 7 dias.",
        buttonHighlighted: true,
        uniqueFeatures: [
            "Análise de até 5 concorrentes",
            "Geração de até 50 conteúdos por mês",
            "Tipos de conteúdo: Reels, Carrosséis e Legendas",
            "Personalização de copy (tom de voz)",
            "Histórico de gerações por 30 dias",
            "Suporte rápido",
            "Sem marca 'Powered by PostMix'",
        ],
    },
    {
        id: pricingIds.premium,
        title: "Premium",
        description: "Para agências, equipes e influenciadores que precisam de volume, agilidade e suporte completo.",
        price: {
            monthly: 99,
            yearly: 990,
        },
        variantId: { monthly: 781028, yearly: 781029 },
        currency: {
            code: "BRL",
            symbol: "R$",
        },
        duration: "por mês",
        highlight: "Tudo que seu time precisa para escalar sua presença online.",
        buttonHighlighted: false,
        uniqueFeatures: [
            "Análise de até 20 concorrentes",
            "Geração ilimitada de conteúdos",
            "Tipos de conteúdo: Reels, Carrosséis, Legendas e mais",
            "Personalização de copy (tom de voz)",
            "Histórico de gerações ilimitado",
            "Múltiplos perfis",
            "Agendamento automático de posts (futuro)",
            "Suporte prioritário",
            "Sem marca 'Powered by PostMix'",
        ],
    },
];
