export function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

export function clampInitialRatio(value: number) {
  "worklet";
  return clamp(value, 0, 1);
}

export function clampNextRatio(touchX: number, width: number, margin: number) {
  "worklet";
  return clamp(touchX, margin, width - margin) / width;
}
