import { useWizard } from "@/src/context/WizardContext";

import React from "react";

import StepDuration from "./step-duration";
import StepReview from "./step-review";
import StepTarget from "./step-target";
import StepType from "./step-type";

export default function GoalWizardScreen() {
  const { step } = useWizard();

  if (step === "type") return <StepType />;
  if (step === "duration") return <StepDuration />;
  if (step === "target") return <StepTarget />;
  if (step === "review") return <StepReview />;

  return null;
}