import { Gesture } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";

import { clampNextRatio } from "./utils";

const PAN_ACTIVE_OFFSET_X = [-0, 0] as [activeOffsetXStart: number, activeOffsetXEnd: number];
const PAN_FAIL_OFFSET_Y = [-18, 18] as [failOffsetYStart: number, failOffsetYEnd: number];

const EDGE_MARGIN = 8;

export function createSliderPan(
  containerWidth: SharedValue<number>,
  splitRatio: SharedValue<number>,
) {
  return Gesture.Pan()
    .activeOffsetX(PAN_ACTIVE_OFFSET_X)
    .failOffsetY(PAN_FAIL_OFFSET_Y)
    .onUpdate((e) => {
      const width = containerWidth.get();
      if (width <= 0) return;

      const nextRatio = clampNextRatio(e.x, width, EDGE_MARGIN);

      splitRatio.set(nextRatio);
    });
}
