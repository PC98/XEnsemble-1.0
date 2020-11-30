export const toDecimalPlacesOrNaN = (num: number | null, isPercent = false) => {
  if (num == null) {
    return "NaN";
  }
  if (isPercent) {
    return `${(100 * num).toFixed(2)}%`;
  }

  const toReturn = num.toFixed(3);
  const ROUND_UNTIL = 3;
  const [mantissa, exponent] = num.toExponential().split("e");
  if (ROUND_UNTIL < -Number(exponent)) {
    return `${parseFloat(mantissa).toFixed(2)}e${exponent}`;
  }
  return toReturn;
};

// See values used in BooleanInput.tsx
export const processBooleanInputValues = (values: string[]) => {
  // const userInput = {}
  if (values.length < 2) {
    return false;
  }
  return values[0] === "true" && values[1] === "false";
};

export const formDataSetArray = (
  data: FormData,
  label: string,
  arr: string[]
) => {
  data.delete(label);
  arr.forEach((val) => void data.append(label, val));
};
