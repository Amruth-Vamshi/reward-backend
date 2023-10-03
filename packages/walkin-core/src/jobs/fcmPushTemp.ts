import Queue from "bull";
import request from "request";
import { createBullConsumer } from "./utils";
// TODO : Replace with comms module

export const FCM_PUSH_QUEUE = {
  name: "FCM_PUSH_QUEUE",
  hostId: "Walkin",
  redis: {
    host: process.env.REDIS_HOST ? process.env.REDIS_HOST : "localhost",
    // tslint:disable-next-line:radix
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379
  }
};

const fcmPush = createBullConsumer(FCM_PUSH_QUEUE.name);

fcmPush.process((job, done) => {
  const { data } = job;
  const headers = {
    Authorization:
      "key=AAAAqFodCE8:APA91bGr0VK0W4AqNLhLhxOIX-omY8uQxy6IgDBf7frZmqryMLZFbu7lxoaYnKVj_XuQZzrp_k4owJRRMwJGpf-4HHIpnjaHrRGPcvdtmvjFeWygJGxNU7EfKBUoiE8Yc89vqgEzeKhf",
    "Content-Type": "application/json"
  };
  const url = "https://fcm.googleapis.com/fcm/send";
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

console.log(FCM_PUSH_QUEUE.name + " Initialised");
