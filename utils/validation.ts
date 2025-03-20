import { evaluateExpression } from "./expression";


export const validateSection = (
  value: string,
  section: "A" | "D" | "M",
): { isValid: boolean; error: string } => {
  const result = evaluateExpression(value);

  if (section === "M") {
    return { isValid: true, error: "" };
  }

  if (result <= 0) {
    return {
      isValid: false,
      error: `Section ${section} must be greater than 0`,
    };
  }

  return { isValid: true, error: "" };
};