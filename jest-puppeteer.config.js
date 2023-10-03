require("dotenv").config({
    path: "./unit.test.env"
});
const config = {
    launch: {
        headless: true,
        executablePath: "/usr/bin/chromium-browser",
        ignoreDefaultArgs: ["--disable-extensions"],
        args: [
            "--no-sandbox", // GOOD
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-first-run",
            "--no-zygote"
        ]
    }
};
if (process.env.TEST_ENV === "LOCAL") {
    delete config.launch.executablePath;
}
module.exports = config;
