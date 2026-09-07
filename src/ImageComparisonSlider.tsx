import { Image, type ImageProps, type ImageSource } from "expo-image";
import { useCallback, useState, type ReactNode } from "react";
import {
  StyleSheet,
  View,
  type AccessibilityActionEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { createSliderPan } from "./createSliderPan";
import { clampInitialRatio, clampNextRatio, EDGE_MARGIN, ratioToPercent } from "./utils";

const HANDLE_KNOB = 40;
const LINE_WIDTH = 3;

type PassThroughImageProps = Omit<ImageProps, "source" | "style" | "contentFit">;

export interface ImageComparisonSliderProps {
  before: ImageSource | number;
  after: ImageSource | number;
  initialPosition?: number;
  contentFit?: ImageProps["contentFit"];
  enabled?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  knobContent?: ReactNode;
  renderLine?: ReactNode;
  beforeImageProps?: PassThroughImageProps;
  afterImageProps?: PassThroughImageProps;
}

export function ImageComparisonSlider({
  before,
  after,
  initialPosition = 0.5,
  enabled = true,
  contentFit = "cover",
  borderRadius,
  style,
  knobContent,
  renderLine,
  beforeImageProps,
  afterImageProps,
}: ImageComparisonSliderProps) {
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

  const splitPx = useDerivedValue(() => splitRatio.get() * containerWidth.get());

  const clipStyle = useAnimatedStyle(() => ({ width: splitPx.get() }));

  const handleGroupStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: splitPx.get() - HANDLE_KNOB / 2 }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Image comparison"
        accessibilityValue={{ min: 0, max: 100, now: splitPercent }}
        accessibilityState={{ disabled: !enabled }}
        accessibilityActions={enabled ? [{ name: "increment" }, { name: "decrement" }] : []}
        onAccessibilityAction={onAccessibilityAction}
        style={[styles.root, style, { borderRadius, overflow: "visible" }]}
        onLayout={(e) => onLayoutWidth(e.nativeEvent.layout.width)}>
        <View style={[styles.media, { borderRadius }]}>
          <Image
            {...afterImageProps}
            accessible={false}
            source={after}
            contentFit={contentFit}
            style={styles.fullImage}
          />
          {enabled && (
            <Animated.View style={[styles.clip, clipStyle]}>
              {measuredWidth > 0 && (
                <Image
                  {...beforeImageProps}
                  accessible={false}
                  source={before}
                  contentFit={contentFit}
                  style={[styles.leftImage, { width: measuredWidth }]}
                />
              )}
            </Animated.View>
          )}
        </View>

        {enabled && (
          <Animated.View style={[styles.handleColumn, handleGroupStyle]} pointerEvents="none">
            {renderLine ?? <View style={styles.line} />}
            <View style={styles.knob}>{knobContent}</View>
          </Animated.View>
        )}
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  media: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  fullImage: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },
  clip: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    overflow: "hidden",
  },
  leftImage: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
  handleColumn: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: HANDLE_KNOB,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: LINE_WIDTH,
    alignSelf: "center",
    backgroundColor: "#ffffff",
  },
  knob: {
    width: HANDLE_KNOB,
    height: HANDLE_KNOB,
    borderRadius: HANDLE_KNOB / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});
