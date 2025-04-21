import { useState } from "react";

const steps = ["profiles", "posts", "analysis"] as const;
type Step = typeof steps[number];

export function useMultiStep() {
  const [step, setStep] = useState<Step>("profiles");

  const next = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1] as Step);
  };

  const back = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) setStep(steps[currentIndex - 1] as Step);
  };

  return { step, setStep, next, back, steps };
}