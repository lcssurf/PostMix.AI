// app/docs/figma-plugin/page.tsx
import { WebPageWrapper } from "@/app/(web)/_components/general-components";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Como usar o plugin do Figma – PostMix.AI",
    description: "Tutorial passo a passo para usar o plugin do Figma com conteúdos do PostMix.AI",
};

export default function FigmaPluginPage() {
    return (
        <WebPageWrapper className="w-full max-w-4xl space-y-10 px-4 md:px-0">
            <article className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight">Como usar o plugin do Figma</h1>
                <p className="text-muted-foreground">
                    Siga este passo a passo para importar conteúdos gerados no PostMix.AI diretamente no Figma.
                </p>

                {/* Imagem principal */}
                <div className="relative w-full aspect-video overflow-hidden rounded-md border">
                    <Image
                        src="/figma-plugin/plugin.png"
                        alt="Plugin Figma PostMix"
                        fill
                        className="object-cover rounded-md"
                    />
                </div>

                <Badge variant="outline">Versão do plugin: 1.0.0</Badge>
                <Separator />

                {/* Passo 1 */}
                <section className="space-y-4">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-semibold">1. Acesse o plugin pelo Figma</h2>
                        <p>
                            Clique no link abaixo para abrir o plugin. Ao abrir o Figma, clique em{" "}
                            <strong>“Abrir em &gt; Novo arquivo”</strong>.
                        </p>
                        <Link
                            href="https://www.figma.com/community/plugin/1504501310632077296/postmix-ai-plugin"
                            target="_blank"
                            className="text-blue-500 underline"
                        >
                            Abrir Plugin no Figma
                        </Link>
                    </div>
                    <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border">
                        <Image
                            src="/figma-plugin/1.png"
                            alt="Acesso ao plugin do Figma"
                            fill
                            className="object-contain"
                        />
                    </div>
                </section>

                {/* Passo 2 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">2. Copie o ID do conteúdo no PostMix.AI</h2>
                    <p>
                        Vá até a aba <strong>Histórico</strong> no PostMix.AI e clique no ícone de copiar ao lado
                        do conteúdo desejado.
                    </p>
                    <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border">
                        <Image
                            src="/figma-plugin/2.png"
                            alt="Copiar ID do conteúdo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </section>

                {/* Passo 3 */}
                <section className="space-y-4">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-semibold">3. Confirme a execução, se necessário</h2>
                        <p>
                            Ao abrir o plugin, pode aparecer a janela de confirmação como mostrado ao lado. Basta clicar no
                            botão <strong>“Executar”</strong> para iniciar o PostMix.AI Plugin no Figma.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Isso só acontece na primeira vez ou quando há atualizações do plugin.
                        </p>
                    </div>
                    <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border">
                        <Image
                            src="/figma-plugin/3.png"
                            alt="Confirmação para executar plugin no Figma"
                            fill
                            className="object-contain"
                        />
                    </div>
                </section>


                {/* Passo 4 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">4. Cole o ID no plugin e preencha os campos</h2>
                    <p>
                        No Figma, cole o <strong>ID do conteúdo</strong> gerado no PostMix.AI. Depois, personalize:
                    </p>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                        <li>Nome do criador (opcional)</li>
                        <li>Arroba do perfil (@nome)</li>
                        <li>Imagem de avatar, se desejar</li>
                    </ul>
                    <p>
                        Após preencher, clique em <strong>“Gerar carrossel”</strong>. O conteúdo será automaticamente
                        transformado em um carrossel visual no Figma.
                    </p>
                    <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border">
                        <Image
                            src="/figma-plugin/4.png" // renomeie conforme organização
                            alt="Formulário do plugin preenchido"
                            fill
                            className="object-contain"
                        />
                    </div>
                </section>


                {/* Passo 5 */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">5. Tudo pronto!</h2>
                    <p>
                        O conteúdo foi importado com sucesso no seu arquivo do Figma. Agora é só ajustar, exportar ou
                        publicar como preferir.
                    </p>

                    <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden border">
                        <video controls className="object-contain" muted autoPlay loop>
                            <source src="/figma-plugin/figma.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Obrigado por usar o plugin do PostMix.AI! Se tiver dúvidas, sugestões ou precisar de ajuda,
                        estamos à disposição via suporte.
                    </p>
                </section>


            </article>
        </WebPageWrapper>
    );
}
