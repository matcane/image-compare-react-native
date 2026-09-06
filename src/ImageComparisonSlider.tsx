import { useCallback, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  type ImageSourcePropType,
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
import { clampInitialRatio } from "./utils";

const HANDLE_KNOB = 40;
const LINE_WIDTH = 3;

interface Props {
  before: ImageSourcePropType;
  after: ImageSourcePropType;
  initialPosition?: number;
  style?: StyleProp<ViewStyle>;
}

export function ImageComparisonSlider({ before, after, initialPosition = 0.5, style }: Props) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const containerWidth = useSharedValue(0);

  const onLayoutWidth = useCallback(
    (width: number) => {
      if (width <= 0) return;

      containerWidth.set(width);
      setMeasuredWidth(width);
    },
    [containerWidth],
  );

  const splitRatio = useSharedValue(clampInitialRatio(initialPosition));

  const pan = createSliderPan(containerWidth, splitRatio);

  const splitPx = useDerivedValue(() => splitRatio.get() * containerWidth.get());

  const clipStyle = useAnimatedStyle(() => ({ width: splitPx.get() }));

  const handleGroupStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: splitPx.get() - HANDLE_KNOB / 2 }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View
        style={[styles.root, style]}
        onLayout={(e) => onLayoutWidth(e.nativeEvent.layout.width)}>
        <Image source={after} resizeMode="cover" style={styles.fullImage} />

        <Animated.View style={[styles.clip, clipStyle]}>
          {measuredWidth > 0 && (
            <Image
              source={before}
              resizeMode="cover"
              style={[styles.leftImage, { width: measuredWidth }]}
            />
          )}
        </Animated.View>

        <Animated.View style={[styles.handleColumn, handleGroupStyle]} pointerEvents="none">
          <View style={styles.line} />
          <View style={styles.knob} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
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
    left: HANDLE_KNOB / 2 - LINE_WIDTH / 2,
    top: 0,
    bottom: 0,
    width: LINE_WIDTH,
    backgroundColor: "#ffffff",
  },
  knob: {
    width: HANDLE_KNOB - 8,
    height: HANDLE_KNOB - 8,
    borderRadius: (HANDLE_KNOB - 8) / 2,
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
});
