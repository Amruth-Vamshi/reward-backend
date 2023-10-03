import * as CoreJobs from "@walkinserver/walkin-core/src/jobs";
// import * as OrderXJobs from "@walkinserver/walkin-orderx/src/jobs";
import Arena from "bull-arena";
import Bull from "bull";
import express from "express";
import { createConnection } from "typeorm";
import ormConfig from "../../walkin-platform-server/ormconfig";
import { captureMessage } from "@sentry/node";

const router = express.Router();

const createDBConnection = async () => {
  const connection = await createConnection(ormConfig);
  if (connection.isConnected) {
    console.log("DB connection successful");
  } else {
    console.log("DB connection failed");
    captureMessage("DB connection failed in queue server");
  }
}
createDBConnection();

let queues = [];
// const JOBS_TO_IMPORT = [CoreJobs, OrderXJobs];
const JOBS_TO_IMPORT = [CoreJobs];
JOBS_TO_IMPORT.forEach(Jobs => {
  queues = queues.concat(Object.values(Jobs));
});
// console.log("Loaded Queues:", queues);

const arena = Arena(
  { Bull, queues },
  {
    basePath: "/arena"
  }
);
// Make arena's resources (js/css deps) available at the base app route
router.use("/", arena);
console.log(
  `
	Connected to redis server at ${process.env.REDIS_HOST}/${process.env.REDIS_PORT}
	Connected to graphql server at ${process.env.GRAPHQL_URL}
	🐂 Bull arena available at http://0.0.0.0:4567/arena,
	`
);
