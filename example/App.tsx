import { ImageComparisonSlider } from "@image-compare/react-native";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <ImageComparisonSlider
          before={require("./assets/android-icon-background.png")}
          after={require("./assets/android-icon-foreground.png")}
          borderRadius={16}
          style={{ width: 200, height: 300, backgroundColor: "black" }}
          knobContent={<View style={{ backgroundColor: "red", flex: 1, width: "100%" }} />}
        />

        <ImageComparisonSlider
          before={require("./assets/android-icon-background.png")}
          after={require("./assets/android-icon-foreground.png")}
          borderRadius={16}
          style={{ width: 200, height: 300, backgroundColor: "black" }}
          knobContent={<View style={{ backgroundColor: "red", flex: 1, width: "100%" }} />}
          enabled={false}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
});
