import { StyleSheet, Text, View, type ViewStyle } from "react-native";

import { EDGE_MARGIN } from "./utils";

interface LabelProps {
  text: string;
  alignSelf?: ViewStyle["alignSelf"];
  testID?: string;
}

export function Label({ text, alignSelf = "flex-end", testID }: LabelProps) {
  return (
    <View testID={testID} style={[styles.badge, { alignSelf }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    margin: EDGE_MARGIN,
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: {
    color: "black",
    fontSize: 12,
    lineHeight: 16,
  },
});
