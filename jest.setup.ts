import "@testing-library/react-native";
import "react-native-gesture-handler/jestSetup";
import { setUpTests } from "react-native-reanimated";

jest.mock("react-native-worklets", () => jest.requireActual("react-native-worklets/src/mock"));
jest.mock("expo-image", () => {
  const { View } = jest.requireActual("react-native");
  return { Image: View };
});

setUpTests();
