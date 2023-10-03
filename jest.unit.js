const config = require("./jest.config");
config["testMatch"] = ["/**/*.spec.ts"];
config["modulePathIgnorePatterns"] = [
  // "/packages/walkin-hyperx",
  // "/packages/walkin-refinex",
  "/packages/walkin-rewardx",
  // "/packages/walkin-nearx",
];
module.exports = config;
