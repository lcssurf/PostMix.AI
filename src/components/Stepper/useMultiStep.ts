import { useState } from "react";

const steps = [
  "Perfil de referência", // 1 - perfil concorrente
  "Seleção de posts",     // 2 - seleção de até 3 posts
  "Objetivo",             // 3 - objetivo da copy
  "Nicho",                // 4 - nicho de atuação
  "Público-alvo",         // 5 - público-alvo
  "Tom de voz",           // 6 - tom de voz
  "Formato"               // 7 - formato desejado
] as const;

export type Step = typeof steps[number];

export function useMultiStep(): {
  stepIndex: number;
  currentStep: Step;
  steps: readonly Step[];
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  isStepEnabled: (index: number) => boolean;
} {
  const [stepIndex, setStepIndex] = useState(0);

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));
  const goTo = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setStepIndex(index);
    }
  };

  const isStepEnabled = (index: number) => index <= stepIndex;

  return {
    stepIndex,
    currentStep: steps[stepIndex] ?? steps[0],
    steps,
    next,
    back,
    goTo,
    isStepEnabled,
  };
}