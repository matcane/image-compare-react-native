import { clampInitialRatio, clampNextRatio, EDGE_MARGIN, ratioToPercent } from "./utils";

describe("clampInitialRatio", () => {
  it("clamps values above 1 to 1", () => {
    expect(clampInitialRatio(1.2)).toBe(1);
  });

  it("clamps values below 0 to 0", () => {
    expect(clampInitialRatio(-3)).toBe(0);
  });

  it("keeps values already in [0, 1]", () => {
    expect(clampInitialRatio(0)).toBe(0);
    expect(clampInitialRatio(0.75)).toBe(0.75);
    expect(clampInitialRatio(1)).toBe(1);
  });
});

describe("clampNextRatio", () => {
  const width = 300;
  const margin = EDGE_MARGIN;

  it("converts a touch inside the inner range to a ratio", () => {
    expect(clampNextRatio(30, width, margin)).toBe(0.1);
  });

  it("clamps a touch on the left edge to the left margin", () => {
    expect(clampNextRatio(0, width, margin)).toBe(margin / width);
  });

  it("clamps a touch on the right edge to the right margin", () => {
    expect(clampNextRatio(width, width, margin)).toBe((width - margin) / width);
  });
});

describe("ratioToPercent", () => {
  it("rounds a fractional percent down when below .5", () => {
    expect(ratioToPercent(0.164)).toBe(16);
  });

  it("rounds a fractional percent up when .5 or above", () => {
    expect(ratioToPercent(0.165)).toBe(17);
  });

  it("maps 0 and 1 to 0% and 100%", () => {
    expect(ratioToPercent(0)).toBe(0);
    expect(ratioToPercent(1)).toBe(100);
  });
});
