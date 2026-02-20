module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["utils/**/*.js", "controllers/**/*.js"],
  coveragePathIgnorePatterns: ["/node_modules/"],
};
