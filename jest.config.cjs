/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testTimeout: 3000,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["node_modules"],
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "<rootDir>/tsconfig.json",
  //   },
  // },

  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    // "^.+\\.tsx?$": [
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.json",
        // ts-jest configuration goes here
      },
    ],
  },
};
