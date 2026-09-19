import { Image, type ImageProps, type ImageSource } from "expo-image";
import { type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";

import { useComparisonSlider } from "./useComparisonSlider";

const HANDLE_KNOB = 40;
const LINE_WIDTH = 3;

type PassThroughImageProps = Omit<ImageProps, "source" | "style" | "contentFit">;

/** Props for {@link ImageComparisonSlider}. */
export interface ImageComparisonSliderProps {
  /** Revealed image */
  before: ImageSource | number;

  /** Background image */
  after: ImageSource | number;

  /** Split ratio, 0–1 */
  initialPosition?: number;

  /** Comparison UI and gestures */
  enabled?: boolean;

  /** Both images */
  contentFit?: ImageProps["contentFit"];

  /** Image stack corners */
  borderRadius?: number;

  /** Root container */
  style?: StyleProp<ViewStyle>;

  /** Knob children */
  knobContent?: ReactNode;

  /** Divider line */
  renderLine?: ReactNode;

  /** before (expo-image, minus source / style / contentFit) */
  beforeImageProps?: PassThroughImageProps;

  /** after */
  afterImageProps?: PassThroughImageProps;
}

/**
 * Before/after image comparison slider for React Native and Expo.
 *
 * @see {@link ImageComparisonSliderProps}
 */
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
  const {
    measuredWidth,
    containerWidth,
    splitPercent,
    splitRatio,
    pan,
    onLayoutWidth,
    onAccessibilityAction,
  } = useComparisonSlider(initialPosition, enabled);

  const splitPx = useDerivedValue(() => splitRatio.get() * containerWidth.get());

  const clipStyle = useAnimatedStyle(() => ({ width: splitPx.get() }));

  const handleGroupStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: splitPx.get() - HANDLE_KNOB / 2 }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        role="slider"
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
