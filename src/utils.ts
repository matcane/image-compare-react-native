import { clamp } from "react-native-reanimated";

export const EDGE_MARGIN = 8;

export function clampInitialRatio(value: number) {
  "worklet";
  return clamp(value, 0, 1);
}

export function clampNextRatio(touchX: number, width: number, margin: number) {
  "worklet";
  return clamp(touchX, margin, width - margin) / width;
}

export function ratioToPercent(ratio: number) {
  return Math.round(ratio * 100);
}
