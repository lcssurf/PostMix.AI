import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StepAudienceProps {
  defaultValue?: string;
  onNext: (audience: string) => void;
  disabled?: boolean;
}

export function StepAudience({ defaultValue = "", onNext, disabled }: StepAudienceProps) {
  const [audience, setAudience] = useState(defaultValue);

  return (
    <div
          className={cn(
            "space-y-4",
            disabled &&
              "pointer-events-none select-none blur-sm grayscale overflow-hidden"
          )}
        >
      <h2 className="text-lg font-semibold">👤 Quem é o seu público-alvo?</h2>
      <Textarea
        placeholder="Ex: Mulheres acima de 40 anos com dor lombar..."
        value={audience}
        onChange={(e) => setAudience(e.target.value)}
        disabled={disabled}
      />
      <Button onClick={() => onNext(audience)} disabled={disabled || !audience.trim()}>
        Continuar
      </Button>
    </div>
  );
}
