"use client";

import {
  Children,
  Fragment,
  createElement,
  isValidElement,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";

export type FunnelSteps<TStep extends string = string> = readonly [TStep, ...TStep[]];

export type UseFunnelOptions<TSteps extends FunnelSteps> = {
  steps: TSteps;
  initialStep?: TSteps[number];
};

export type FunnelStepProps<TStep extends string> = {
  name: TStep;
  children: ReactNode;
};

type FunnelRenderer<TStep extends string> = ((props: {
  children: ReactNode;
}) => ReactNode) & {
  Step: (props: FunnelStepProps<TStep>) => ReactNode;
};

export type UseFunnelResult<TSteps extends FunnelSteps> = {
  steps: TSteps;
  currentStep: TSteps[number];
  currentIndex: number;
  stepCount: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  setStep: (step: TSteps[number]) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  Funnel: FunnelRenderer<TSteps[number]>;
};

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateFunnelSteps<TStep extends string>(
  steps: readonly [TStep, ...TStep[]],
): void {
  invariant(steps.length > 0, "useFunnel requires at least one step.");

  const uniqueSteps = new Set(steps);

  invariant(
    uniqueSteps.size === steps.length,
    `useFunnel steps must be unique. Received: ${steps.join(", ")}.`,
  );
}

export function getFunnelStepIndex<TStep extends string>(
  steps: readonly TStep[],
  step: TStep,
): number {
  return steps.indexOf(step);
}

export function getInitialFunnelStep<TStep extends string>(
  steps: readonly [TStep, ...TStep[]],
  initialStep?: TStep,
): TStep {
  if (initialStep === undefined) {
    return steps[0];
  }

  invariant(
    steps.includes(initialStep),
    `Invalid initial step "${initialStep}". Expected one of: ${steps.join(", ")}.`,
  );

  return initialStep;
}

export function getValidatedFunnelStep<TStep extends string>(
  steps: readonly [TStep, ...TStep[]],
  step: TStep,
): TStep {
  invariant(
    steps.includes(step),
    `Invalid step "${step}". Expected one of: ${steps.join(", ")}.`,
  );

  return step;
}

export function getNextFunnelStep<TStep extends string>(
  steps: readonly [TStep, ...TStep[]],
  currentStep: TStep,
): TStep {
  const currentIndex = getFunnelStepIndex(steps, getValidatedFunnelStep(steps, currentStep));

  return steps[Math.min(currentIndex + 1, steps.length - 1)]!;
}

export function getPreviousFunnelStep<TStep extends string>(
  steps: readonly [TStep, ...TStep[]],
  currentStep: TStep,
): TStep {
  const currentIndex = getFunnelStepIndex(steps, getValidatedFunnelStep(steps, currentStep));

  return steps[Math.max(currentIndex - 1, 0)]!;
}

function createFunnelComponent<TStep extends string>(
  currentStepRef: MutableRefObject<TStep>,
): FunnelRenderer<TStep> {
  const Step = ({ children }: FunnelStepProps<TStep>) =>
    createElement(Fragment, null, children);

  const Funnel = ({ children }: { children: ReactNode }) => {
    const activeStep = Children.toArray(children).find((child) => {
      return (
        isValidElement<FunnelStepProps<TStep>>(child) &&
        child.props.name === currentStepRef.current
      );
    });

    if (!activeStep || !isValidElement<FunnelStepProps<TStep>>(activeStep)) {
      return null;
    }

    return createElement(Fragment, null, activeStep.props.children);
  };

  return Object.assign(Funnel, { Step });
}

export function useFunnel<TSteps extends FunnelSteps>(
  options: UseFunnelOptions<TSteps>,
): UseFunnelResult<TSteps> {
  const { steps, initialStep } = options;

  validateFunnelSteps(steps);

  const [defaultStep] = useState(() => getInitialFunnelStep(steps, initialStep));
  const [currentStep, setCurrentStep] = useState<TSteps[number]>(defaultStep);
  const currentStepRef = useRef<TSteps[number]>(currentStep);

  currentStepRef.current = currentStep;

  const [Funnel] = useState(() => createFunnelComponent<TSteps[number]>(currentStepRef));
  const currentIndex = getFunnelStepIndex(steps, currentStep);

  invariant(
    currentIndex >= 0,
    `Current step "${currentStep}" is not present in the current funnel steps.`,
  );

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < steps.length - 1;

  const setStep = (step: TSteps[number]) => {
    setCurrentStep(getValidatedFunnelStep(steps, step));
  };

  const next = () => {
    setCurrentStep(getNextFunnelStep(steps, currentStep));
  };

  const prev = () => {
    setCurrentStep(getPreviousFunnelStep(steps, currentStep));
  };

  const reset = () => {
    setCurrentStep(defaultStep);
  };

  return {
    steps,
    currentStep,
    currentIndex,
    stepCount: steps.length,
    canGoNext,
    canGoPrev,
    isFirstStep: !canGoPrev,
    isLastStep: !canGoNext,
    setStep,
    next,
    prev,
    reset,
    Funnel,
  };
}
