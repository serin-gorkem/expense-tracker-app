import { useWizard } from "@/src/context/WizardContext";

import React from "react";

import StepDuration from "./step-duration";
import StepReview from "./step-review";
import StepTarget from "./step-target";
import StepType from "./step-type";

export default function GoalWizardScreen() {
  const { step } = useWizard();

  switch (step) {
    case "type":
      return <StepType />;
    case "duration":
      return <StepDuration />;
    case "target":
      return <StepTarget />;
    case "review":
      return <StepReview />;
    default:
      return null;
  }
}