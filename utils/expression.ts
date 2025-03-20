// Function to parse and evaluate expressions
export const evaluateExpression = (input: string): number => {
  try {
    // Remove all non-numeric and non-operator characters
    const sanitizedInput = input.replace(/[^0-9+\-*/().]/g, "");

    // If empty after sanitizing, return 0
    if (!sanitizedInput) return 0;

    // Check if the expression ends with an operator or is incomplete
    if (
      /[+\-*/]$/.test(sanitizedInput) ||
      /\($/.test(sanitizedInput) ||
      sanitizedInput.includes("()") ||
      (sanitizedInput.match(/$$/g) || []).length !==
        (sanitizedInput.match(/$$/g) || []).length
    ) {
      // If the last evaluation was successful, return that value
      // Otherwise return 0 or the last valid part
      const validPart = sanitizedInput.replace(/[+\-*/]$/, "");
      if (validPart) {
        try {
          // eslint-disable-next-line no-eval
          return eval(validPart);
        } catch {
          return 0;
        }
      }
      return 0;
    }

    // Evaluate the expression
    return eval(sanitizedInput);
  } catch (error) {
    // Instead of logging the error, just return the last valid value or 0
    // Try to evaluate without the last character
    if (input.length > 0) {
      const shorterInput = input.slice(0, -1);
      return evaluateExpression(shorterInput);
    }
    return 0;
  }
};

// Regular expression to match numbers and mathematical operators
const MATH_CHARS_REGEX = /[0-9+\-*/() .]/g;
const WHITESPACE_REGEX = /\s+/g;

export const cleanExpression = (input: string): string => {
  // Extract only valid mathematical characters
  const mathChars = input.match(MATH_CHARS_REGEX) || [];
  // Join and remove extra whitespace
  return mathChars.join("").replace(WHITESPACE_REGEX, "");
};

// export const evaluateExpression = (expression: string): number => {
//   if (!expression.trim()) return 0;

//   try {
//     // Clean the expression and evaluate it
//     const cleanedExpression = cleanExpression(expression);
//     // Using Function constructor to evaluate mathematical expressions
//     // This is safe as we've already cleaned the input to only allow mathematical operations
//     const result = new Function(`return ${cleanedExpression}`)();

//     // Ensure the result is a valid number
//     if (typeof result !== "number" || !isFinite(result)) {
//       return 0;
//     }

//     return result;
//   } catch (error) {
//     console.error("Error evaluating expression:", error);
//     return 0;
//   }
// };
