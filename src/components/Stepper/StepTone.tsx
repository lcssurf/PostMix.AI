import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TONES = [
  { label: "Profissional 🧠", value: "profissional" },
  { label: "Engraçado 😄", value: "engracado" },
  { label: "Inspirador ✨", value: "inspirador" },
  { label: "Direto e provocador 🔥", value: "provocador" },
  { label: "Acolhedor 💬", value: "acolhedor" },
];

interface StepToneProps {
  value?: string;
  onSelect: (tone: string) => void;
  disabled?: boolean;
}

export function StepTone({ value, onSelect, disabled }: StepToneProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        disabled &&
          "pointer-events-none select-none blur-sm grayscale overflow-hidden"
      )}
    >
      <h2 className="text-lg font-semibold">🗣️ Qual tom de voz você prefere?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TONES.map((tone) => (
          <Card
            key={tone.value}
            className={cn(
              "cursor-pointer transition-all",
              value === tone.value && "ring-2 ring-primary"
            )}
            onClick={() => !disabled && onSelect(tone.value)}
          >
            <CardContent className="p-4 text-sm font-medium">
              {tone.label}
            </CardContent>
          </Card>
        ))}
      </div>
      {value && (
        <Button onClick={() => onSelect(value)} disabled={disabled} className="mt-4">
          Continuar
        </Button>
      )}
    </div>
  );
}