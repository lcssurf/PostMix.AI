import { cn } from "@/lib/utils";

type Props = {
  steps: readonly string[];
  currentIndex: number;
};

export function VerticalStepIndicator({ steps, currentIndex }: Props) {
  return (
    <div className="flex flex-row md:flex-col items-start gap-4 md:gap-6 md:border-r md:pr-4">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const isPending = index > currentIndex;

        return (
          <div
            key={step}
            className={cn(
              "flex items-center gap-2 md:gap-3 text-sm transition-opacity",
              isActive ? "text-primary" : "text-muted-foreground",
              isPending && "opacity-40 cursor-not-allowed select-none"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center h-6 w-6 rounded-full border-2 shrink-0",
                isActive
                  ? "bg-primary text-white border-primary sticky top-20 z-10"
                  : isCompleted
                  ? "bg-muted border-muted"
                  : "bg-background border-border text-muted-foreground"
              )}
            >
              <span className="text-xs font-bold">
                {isCompleted ? "✓" : index + 1}
              </span>
            </div>
            <span className="capitalize">{step}</span>
          </div>
        );
      })}
    </div>
  );
}
