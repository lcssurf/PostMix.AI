import Balancer from "react-wrap-balancer";

export function Promotion() {
    return (
        <section className="flex min-h-96 w-full flex-col items-center justify-center gap-5 rounded-[26px] bg-foreground p-8 py-10 text-background">
            <Balancer
                as="h2"
                className="text-center font-heading text-3xl font-bold md:text-5xl"
            >
                Cresça no Instagram com estratégia e inteligência 📈
            </Balancer>
            <Balancer
                as="p"
                className="text-center text-base leading-relaxed text-background/70 sm:text-xl"
            >
                O PostMix.ai transforma perfis de referência em conteúdo pronto para o seu Instagram. Mais alcance, mais engajamento, sem precisar quebrar a cabeça com o que postar. Comece a criar com base no que já funciona — com um toque só seu.
                <span className="rounded-[5px] bg-background p-1 font-semibold text-foreground">
                    Gratuito para começar.
                </span>
            </Balancer>
        </section>
    );
}
