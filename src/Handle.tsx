import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, type DerivedValue } from "react-native-reanimated";

const HANDLE_KNOB = 40;
const LINE_WIDTH = 3;

interface HandleProps {
  knobContent?: ReactNode;
  renderLine?: ReactNode;
  splitPx: DerivedValue<number>;
}

export function Handle(props: HandleProps) {
  const { knobContent, renderLine, splitPx } = props;

  const handleGroupStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: splitPx.get() - HANDLE_KNOB / 2 }],
  }));

  return (
    <Animated.View style={[styles.handleColumn, handleGroupStyle]} pointerEvents="none">
      {renderLine ?? <View style={styles.line} />}
      <View style={styles.knob}>{knobContent}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
