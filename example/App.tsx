import { ImageComparisonSlider } from "expo-image-comparison-slider";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <ImageComparisonSlider
          before={require("./assets/android-icon-background.png")}
          after={require("./assets/android-icon-foreground.png")}
          style={{ flex: 0, width: 200, height: 300, borderRadius: 16 }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
