import { IndexRouteLocationState } from "./types";

export const getBoolValueFromIndexRouteLocationState = (
  state: IndexRouteLocationState | undefined,
  key: string
) => (state == null ? undefined : state[key] == null ? false : true);

export const getOptionalValueFromIndexRouteLocationState = (
  state: IndexRouteLocationState | undefined,
  key: string
) =>
  state == null || state[key] == null || state[key] === ""
    ? undefined
    : state[key];

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
