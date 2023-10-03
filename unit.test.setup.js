if (!process.env.DOCKER_DRIVER) {
  require("dotenv").config({
    path: "./unit.test.env"
  });
}
