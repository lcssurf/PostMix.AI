import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const FORMATS = [
  { label: "Texto para carrossel", value: "carrossel", featured: true },
  { label: "Roteiro para Reels", value: "reels" },
  // { label: "Legenda para imagem", value: "legenda" },
  // { label: "Roteiro para TikTok", value: "tiktok" },
  // { label: "Chamada para WhatsApp", value: "whatsapp" },
];

interface StepFormatProps {
  value?: string;
  onSelect: (format: string) => void;
  disabled?: boolean;
  completed?: boolean;
  loading?: boolean;
}

export function StepFormat({ value, onSelect, disabled, completed, loading }: StepFormatProps) {
  const [tempFormat, setTempFormat] = useState(value || "carrossel");

  return (
    <div
      className={cn(
        "space-y-4",
        disabled &&
        "pointer-events-none select-none blur-sm grayscale overflow-hidden"
      )}
    >
      <h2 className="text-lg font-semibold">📄 Qual formato você quer gerar?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {FORMATS.map((format) => (
          <Card
            key={format.value}
            className={cn(
              "cursor-pointer transition-all",
              tempFormat === format.value && "ring-2 ring-primary"
            )}
            onClick={() => !disabled && !completed && setTempFormat(format.value)}
          >
            <CardContent className="p-4 text-sm font-medium flex items-center gap-2">
              {format.label}
              {format.featured && (
              <Badge
              className="bg-blue-500 text-white dark:bg-blue-600"
              variant="secondary"
              >
                Destaque
              </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {tempFormat && (
        <Button
          onClick={() => {
            onSelect(tempFormat); // mantém lógica de salvar o format e avançar
            setTimeout(() => {
              // callback para chamar handleGenerateContent logo após continuar
              const el = document.getElementById("generate-button");
              el?.click();
            }, 100); // delay leve para garantir render
          }}
          disabled={disabled || loading || completed}
          className="mt-4 w-full"
        >
          {loading ? "Carregando..." : completed ? "Gerando Conteúdo..." : "Finalizar e Gerar"}
        </Button>
      )}

    </div>
  );
}