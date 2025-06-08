// StepSpecificSubject.tsx (ajustado para coerência visual com StepGoal)
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

type Props = {
    defaultValue?: string;
    onNext: (subject: string) => void;
    disabled?: boolean;
    loading?: boolean;
    completed?: boolean;
};

export function StepSpecificSubject({
    defaultValue = "",
    onNext,
    disabled,
    loading,
    completed,
}: Props) {
    const [subject, setSubject] = useState(defaultValue);

    return (
        <div
            className={cn(
                "space-y-4",
                disabled && "pointer-events-none select-none blur-sm grayscale overflow-hidden"
            )}
        >
            <h2 className="text-lg font-semibold">🔍 Assunto Específico do Conteúdo</h2>

            <Card>
                <CardContent className="p-4">
                    <p className="mb-3 text-sm text-muted-foreground">
                        Sobre qual assunto específico será o conteúdo? Detalhe ao máximo: inclua contexto, público-alvo, exemplos, objetivos ou qualquer informação relevante para enriquecer o tema.
                    </p>
                    <Textarea
                        className="h-24"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={`Exemplo: "Como evitar 5 erros comuns ao investir em ações para iniciantes", "Guia prático para abrir um MEI em 2024", "Estratégias para aumentar vendas no Instagram para pequenos negócios"`}
                        disabled={disabled || loading || completed}
                    />
                </CardContent>
            </Card>

            {subject && (
                <Button
                    onClick={() => onNext(subject)}
                    disabled={!subject || loading || completed}
                    className="mt-4 w-full"
                >
                    {loading ? "Carregando..." : completed ? "Concluído" : "Continuar"}
                </Button>
            )}
        </div>
    );
}
