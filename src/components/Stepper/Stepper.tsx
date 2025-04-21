import { Button } from "@/components/ui/button";

type StepperProps = {
  currentStep: string;
  steps: readonly string[];
  onStepClick?: (step: string) => void;
};

export function Stepper({ currentStep, steps, onStepClick }: StepperProps) {
  return (
    <div className="flex space-x-2">
      {steps.map((step) => (
        <Button
          key={step}
          variant={currentStep === step ? "default" : "outline"}
          onClick={() => onStepClick?.(step)}
        >
          {step.charAt(0).toUpperCase() + step.slice(1)}
        </Button>
      ))}
    </div>
  );
}