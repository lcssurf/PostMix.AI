import { useState } from "react";

const steps = ["profiles", "posts", "analysis"] as const;
export type Step = typeof steps[number];

export function useMultiStep() {
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
    currentStep: steps[stepIndex],
    steps,
    next,
    back,
    goTo,
    isStepEnabled,
  };
}
