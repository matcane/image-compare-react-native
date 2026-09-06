/** @type {import("jest").Config} */
module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  modulePathIgnorePatterns: ["<rootDir>/lib/", "<rootDir>/example/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
