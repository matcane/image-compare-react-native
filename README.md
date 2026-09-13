# @image-compare/react-native

Before/after image comparison slider for React Native and Expo.

![Demo](./docs/demo.gif)

## Install

```sh
pnpm add @image-compare/react-native expo-image react-native-reanimated react-native-gesture-handler react-native-worklets
```

Peer dependencies: `react`, `react-native`, `expo-image`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-worklets`.

## Usage

```tsx
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

```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `before` | `ImageSource \| number` | — | Revealed image |
| `after` | `ImageSource \| number` | — | Background image |
| `initialPosition` | `number` | `0.5` | Split ratio, 0–1 |
| `enabled` | `boolean` | `true` | Comparison UI and gestures |
| `contentFit` | `ImageProps["contentFit"]` | `"cover"` | Both images |
| `borderRadius` | `number` | — | Image stack corners |
| `style` | `StyleProp<ViewStyle>` | — | Root container |
| `knobContent` | `ReactNode` | — | Knob children |
| `renderLine` | `ReactNode` | — | Divider line |
| `beforeImageProps` | `PassThroughImageProps` | — | `before` (`expo-image`, minus `source` / `style` / `contentFit`) |
| `afterImageProps` | `PassThroughImageProps` | — | `after` |

## License

MIT.
