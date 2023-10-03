import { createBullConsumer } from "./utils";
import request from "request";

export const WALKIN_COMMS_QUEUE = {
  name: "WALKIN_COMMS_QUEUE",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    // tslint:disable-next-line:radix
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379
  }
};

const walkinComms = createBullConsumer(WALKIN_COMMS_QUEUE.name);

walkinComms.process((job, done) => {
  const { data } = job;
  console.log("TCL:WALKIN_COMMS_QUEUE data", data);
  const headers = {
    "x-api-key": process.env.WALKIN_COMMS_API_KEY,
    "Content-Type": "application/json"
  };
  const url = process.env.WALKIN_COMMS_URL;
  const options = {
    method: "POST",
    url,
    headers,
    body: JSON.stringify(data)
  };
  request(options, (error, response, body) => {
    if (error) {
      console.log("TCL: error", error);
      done(error);
    }
    console.log("TCL: body", body);
    done(null, body);
  });
});

console.log(WALKIN_COMMS_QUEUE.name + " Initialised");
