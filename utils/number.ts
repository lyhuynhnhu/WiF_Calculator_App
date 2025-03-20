// Format number with sign and decimal places
export const formatWithSign = (
  num: number,
  decimalPlaces: number | undefined
) => {
  const rounded =
    decimalPlaces === 1
      ? Math.floor(num * 10) / 10 // Round down to 1 decimal place
      : Math.round(num * 100) / 100; // Round to 2 decimal places

  const fixed = rounded.toFixed(decimalPlaces);
  return (rounded >= 0 ? "+" : "") + fixed;
};

// Format number with 2 decimal places (no sign)
export const formatTwoDecimals = (num: number) => {
  return num.toFixed(2);
};
