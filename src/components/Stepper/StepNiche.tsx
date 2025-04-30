import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StepNicheProps {
  defaultValue?: string;
  onNext: (niche: string) => void;
  disabled?: boolean;
  loading?: boolean;
  completed?: boolean;
}

export function StepNiche({ defaultValue = "", onNext, disabled, loading, completed }: StepNicheProps) {
  const [niche, setNiche] = useState(defaultValue);

  const handleSubmit = () => {
    if (!disabled && !completed && niche.trim()) {
      onNext(niche.trim());
    }
  };

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
      <Button className="w-full" onClick={handleSubmit} disabled={disabled || !niche.trim() || loading || completed}>
        {loading ? "Carregando..." : completed ? "Concluído" : "Continuar"}
      </Button>
    </div>
  );
}