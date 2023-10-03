module.exports = {
  preset: "jest-puppeteer-preset",
  setupFiles: ["./unit.test.setup.js"],
  testTimeout: 450000,
  globals: {
    "ts-jest": {
      isolatedModules: true,
      diagnostics: false
    }
  },
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  setupFilesAfterEnv: ["./setup-after-env.js"]
};
