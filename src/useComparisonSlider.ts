import { useCallback, useState } from "react";
import type { AccessibilityActionEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { createSliderPan } from "./createSliderPan";
import { clampInitialRatio, clampNextRatio, EDGE_MARGIN, ratioToPercent } from "./utils";

export function useComparisonSlider(initialPosition: number, enabled: boolean) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const containerWidth = useSharedValue(0);

  const initialRatio = clampInitialRatio(initialPosition);
  const initialPercent = ratioToPercent(initialRatio);
  const splitRatio = useSharedValue(initialRatio);
  const [splitPercent, setSplitPercent] = useState(initialPercent);

  const onLayoutWidth = useCallback(
    (width: number) => {
      if (width <= 0) return;

      containerWidth.set(width);
      setMeasuredWidth(width);
    },
    [containerWidth],
  );

  const onAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (!enabled) return;

      const { actionName } = event.nativeEvent;
      if (actionName !== "increment" && actionName !== "decrement") return;

      const nextRatio = clampNextRatio(
        (splitRatio.get() + (actionName === "increment" ? 0.05 : -0.05)) * measuredWidth,
        measuredWidth,
        EDGE_MARGIN,
      );

      splitRatio.set(nextRatio);
      setSplitPercent(ratioToPercent(nextRatio));
    },
    [enabled, measuredWidth, splitRatio],
  );

  const pan = createSliderPan(containerWidth, splitRatio, enabled);

  return {
    measuredWidth,
    containerWidth,
    splitPercent,
    splitRatio,
    pan,
    onLayoutWidth,
    onAccessibilityAction,
  };
}
