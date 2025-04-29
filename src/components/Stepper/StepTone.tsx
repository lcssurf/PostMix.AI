import { useState } from "react";
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
  value: string[];
  onSelect: (tones: string[]) => void;
  disabled?: boolean;
  completed?: boolean;
  loading?: boolean;
}

export function StepTone({ value, onSelect, disabled, completed, loading }: StepToneProps) {
  const [tempTone, setTempTone] = useState<string[]>(value || []);

  const toggleTone = (toneValue: string) => {
    setTempTone((prev) =>
      prev.includes(toneValue)
        ? prev.filter((t) => t !== toneValue)
        : [...prev, toneValue]
    );
  };


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
              tempTone.includes(tone.value) && "ring-2 ring-primary"
            )}
            onClick={() => !disabled && !completed && toggleTone(tone.value)}
          >
            <CardContent className="p-4 text-sm font-medium">
              {tone.label}
            </CardContent>
          </Card>
        ))}
      </div>
      {tempTone.length > 0 && (
        <Button
          onClick={() => onSelect(tempTone)}
          disabled={disabled || loading || completed}
          className="mt-4 w-full"
        >
          {loading ? "Carregando..." : completed ? "Concluído" : "Continuar"}
        </Button>
      )}
    </div>
  );
}