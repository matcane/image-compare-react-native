import { useCallback, useState } from "react";
import type { AccessibilityActionEvent } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { createSliderPan } from "./createSliderPan";
import { clampInitialRatio, clampNextRatio, EDGE_MARGIN, ratioToPercent } from "./utils";

export function useComparisonSlider(initialPosition: number, enabled: boolean) {
  const [layoutContainerWidth, setLayoutContainerWidth] = useState(0);
  const sharedContainerWidth = useSharedValue(0);

  const initialRatio = clampInitialRatio(initialPosition);
  const initialPercent = ratioToPercent(initialRatio);
  const splitRatio = useSharedValue(initialRatio);
  const [splitPercent, setSplitPercent] = useState(initialPercent);

  const onLayoutWidth = useCallback(
    (width: number) => {
      if (width <= 0) return;

      sharedContainerWidth.set(width);
      setLayoutContainerWidth(width);
    },
    [sharedContainerWidth],
  );

  const onAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      if (!enabled) return;

      const { actionName } = event.nativeEvent;
      if (actionName !== "increment" && actionName !== "decrement") return;

      const nextRatio = clampNextRatio(
        (splitRatio.get() + (actionName === "increment" ? 0.05 : -0.05)) * layoutContainerWidth,
        layoutContainerWidth,
        EDGE_MARGIN,
      );

      splitRatio.set(nextRatio);
      setSplitPercent(ratioToPercent(nextRatio));
    },
    [enabled, layoutContainerWidth, splitRatio],
  );

  const pan = createSliderPan(sharedContainerWidth, splitRatio, enabled);

  return {
    layoutContainerWidth,
    sharedContainerWidth,
    splitPercent,
    splitRatio,
    pan,
    onLayoutWidth,
    onAccessibilityAction,
  };
}
