import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FORMATS = [
  { label: "Roteiro para Reels", value: "reels" },
  { label: "Legenda para imagem", value: "legenda" },
  { label: "Texto para carrossel", value: "carrossel" },
  { label: "Roteiro para TikTok", value: "tiktok" },
  { label: "Chamada para WhatsApp", value: "whatsapp" },
];

interface StepFormatProps {
  value?: string;
  onSelect: (format: string) => void;
  disabled?: boolean;
}

export function StepFormat({ value, onSelect, disabled }: StepFormatProps) {
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
              value === format.value && "ring-2 ring-primary"
            )}
            onClick={() => !disabled && onSelect(format.value)}
          >
            <CardContent className="p-4 text-sm font-medium">
              {format.label}
            </CardContent>
          </Card>
        ))}
      </div>
      {value && (
        <Button onClick={() => onSelect(value)} disabled={disabled} className="mt-4">
          Gerar conteúdo
        </Button>
      )}
    </div>
  );
}
