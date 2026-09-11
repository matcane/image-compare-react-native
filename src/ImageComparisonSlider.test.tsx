import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ImageComparisonSlider, type ImageComparisonSliderProps } from "./ImageComparisonSlider";

const before = { uri: "before" };
const after = { uri: "after" };

async function renderSlider(props: Partial<ImageComparisonSliderProps> = {}) {
  return render(<ImageComparisonSlider before={before} after={after} {...props} />);
}

function getSlider() {
  return screen.getByRole("slider", { name: "Image comparison" });
}

async function layoutSlider(width = 300) {
  await fireEvent(getSlider(), "layout", {
    nativeEvent: { layout: { x: 0, y: 0, width, height: 100 } },
  });
}

async function fireAccessibilityAction(actionName: string) {
  await fireEvent(getSlider(), "accessibilityAction", {
    nativeEvent: { actionName },
  });
}

describe("ImageComparisonSlider", () => {
  it("renders an accessible comparison slider", async () => {
    await renderSlider();

    expect(getSlider()).toBeOnTheScreen();
  });

  it.each([
    [undefined, 50],
    [0.75, 75],
    [1.2, 100],
    [-0.3, 0],
  ] as const)("exposes initialPosition %s as %s percent", async (initialPosition, now) => {
    await renderSlider({ initialPosition });

    expect(getSlider()).toHaveProp("accessibilityValue", { min: 0, max: 100, now });
  });

  it("shows the after image immediately and the before image only after layout", async () => {
    await renderSlider({
      beforeImageProps: { testID: "before-image" },
      afterImageProps: { testID: "after-image" },
    });

    expect(screen.getByTestId("after-image")).toBeOnTheScreen();
    expect(screen.queryByTestId("before-image")).toBeNull();

    await layoutSlider();

    expect(screen.getByTestId("before-image")).toBeOnTheScreen();
  });

  it("ignores a non-positive layout width", async () => {
    await renderSlider({
      beforeImageProps: { testID: "before-image" },
    });

    await layoutSlider(0);

    expect(screen.queryByTestId("before-image")).toBeNull();
  });

  it("marks the slider disabled and hides the comparison UI when enabled is false", async () => {
    await renderSlider({
      enabled: false,
      knobContent: <Text>Custom knob</Text>,
      renderLine: <Text>Custom line</Text>,
      beforeImageProps: { testID: "before-image" },
      afterImageProps: { testID: "after-image" },
    });

    expect(getSlider()).toHaveProp("accessibilityState", { disabled: true });
    expect(getSlider()).toHaveProp("accessibilityActions", []);
    expect(screen.getByTestId("after-image")).toBeOnTheScreen();
    expect(screen.queryByTestId("before-image")).toBeNull();
    expect(screen.queryByText("Custom knob")).toBeNull();
    expect(screen.queryByText("Custom line")).toBeNull();
  });

  it("renders custom knob and line content", async () => {
    await renderSlider({
      knobContent: <Text>Custom knob</Text>,
      renderLine: <Text>Custom line</Text>,
    });

    expect(screen.getByText("Custom knob")).toBeOnTheScreen();
    expect(screen.getByText("Custom line")).toBeOnTheScreen();
  });

  it("increments and decrements the split through accessibility actions", async () => {
    await renderSlider();
    await layoutSlider();

    await fireAccessibilityAction("increment");
    expect(getSlider()).toHaveProp("accessibilityValue", { min: 0, max: 100, now: 55 });

    await fireAccessibilityAction("decrement");
    expect(getSlider()).toHaveProp("accessibilityValue", { min: 0, max: 100, now: 50 });
  });

  it("clamps accessibility actions to the edge margin", async () => {
    await renderSlider({ initialPosition: 1 });
    await layoutSlider();

    await fireAccessibilityAction("increment");

    expect(getSlider()).toHaveProp("accessibilityValue", { min: 0, max: 100, now: 97 });
  });

  it("ignores accessibility actions other than increment and decrement", async () => {
    await renderSlider();
    await layoutSlider();

    await fireAccessibilityAction("activate");

    expect(getSlider()).toHaveProp("accessibilityValue", { min: 0, max: 100, now: 50 });
  });

  it("does not change value from accessibility actions when disabled", async () => {
    await renderSlider({ enabled: false });
    await layoutSlider();

    await fireAccessibilityAction("increment");

    expect(getSlider()).toHaveProp("accessibilityValue", { min: 0, max: 100, now: 50 });
  });
});
