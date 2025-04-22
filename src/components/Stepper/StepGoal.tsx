import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const GOALS = [
  { label: "Aumentar autoridade", value: "autoridade" },
  { label: "Gerar engajamento", value: "engajamento" },
  { label: "Atrair clientes", value: "clientes" },
  { label: "Educar / Informar", value: "educar" },
  { label: "Vender algo", value: "venda" },
];

interface StepGoalProps {
  value?: string;
  onSelect: (goal: string) => void;
  disabled?: boolean;
  completed?: boolean;
  loading?: boolean;
}

export function StepGoal({ value, onSelect, disabled, completed, loading }: StepGoalProps) {
  const [tempGoal, setTempGoal] = useState(value || "");

  return (
    <div
      className={cn(
        "space-y-4",
        disabled &&
          "pointer-events-none select-none blur-sm grayscale overflow-hidden"
      )}
    >
      <h2 className="text-lg font-semibold">🎯 Qual é o objetivo do conteúdo?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((g) => (
          <Card
            key={g.value}
            className={cn(
              "cursor-pointer transition-all",
              tempGoal === g.value && "ring-2 ring-primary"
            )}
            onClick={() => !disabled && !completed && setTempGoal(g.value)}
          >
            <CardContent className="p-4 text-sm font-medium">
              {g.label}
            </CardContent>
          </Card>
        ))}
      </div>

      {tempGoal && (
        <Button
          onClick={() => onSelect(tempGoal)}
          disabled={disabled || loading || completed}
          className="mt-4"
        >
          {loading ? "Carregando..." : completed ? "Concluído" : "Continuar"}
        </Button>
      )}
    </div>
  );
}