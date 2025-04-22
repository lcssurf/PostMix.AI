import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StepNicheProps {
  defaultValue?: string;
  onNext: (niche: string) => void;
  disabled?: boolean;
}

export function StepNiche({ defaultValue = "", onNext, disabled }: StepNicheProps) {
  const [niche, setNiche] = useState(defaultValue);

  return (
    <div
          className={cn(
            "space-y-4",
            disabled &&
              "pointer-events-none select-none blur-sm grayscale overflow-hidden"
          )}
        >
      <h2 className="text-lg font-semibold">💼 Qual é o seu nicho?</h2>
      <Input
        placeholder="Ex: Fisioterapia, Barbearia, Estética..."
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        disabled={disabled}
      />
      <Button onClick={() => onNext(niche)} disabled={disabled || !niche.trim()}>
        Continuar
      </Button>
    </div>
  );
}
