import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperStep {
  label: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="flex min-w-[500px] items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={step.label} className="contents">
              <div className="flex flex-1 flex-col items-center text-center">
                <div
                  className={cn(
                    "z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-surface transition-colors",
                    isDone && "bg-success-500 text-white",
                    isActive && "bg-primary-900 text-white shadow-md",
                    !isDone && !isActive && "bg-background text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="size-4" aria-hidden="true" /> : stepNumber}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-xs font-medium",
                    isDone && "text-success-600",
                    isActive && "font-semibold text-primary-900",
                    !isDone && !isActive && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="relative z-0 -mt-5 h-0.5 flex-1 bg-border" aria-hidden="true" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
