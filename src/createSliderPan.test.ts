import { makeMutable } from "react-native-reanimated";

import { createSliderPan } from "./createSliderPan";

describe("createSliderPan", () => {
  it("updates splitRatio from the pan position", () => {
    const splitRatio = makeMutable(0.5);
    const gesture = createSliderPan(makeMutable(300), splitRatio, true);

    gesture.handlers.onUpdate?.({ x: 30 } as never);

    expect(splitRatio.get()).toBe(0.1);
  });

  it("does not update splitRatio when width is not measured yet", () => {
    const splitRatio = makeMutable(0.5);
    const gesture = createSliderPan(makeMutable(0), splitRatio, true);

    gesture.handlers.onUpdate?.({ x: 30 } as never);

    expect(splitRatio.get()).toBe(0.5);
  });

  it("disables the pan gesture when enabled is false", () => {
    const gesture = createSliderPan(makeMutable(300), makeMutable(0.5), false);

    expect(gesture.config.enabled).toBe(false);
  });
});
