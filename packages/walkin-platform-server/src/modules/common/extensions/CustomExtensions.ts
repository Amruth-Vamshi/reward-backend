import { GraphQLExtension } from "apollo-server";

import uuid from "uuid/v4";

import { logger } from "../logger/logger";

export class WalkinExtension extends GraphQLExtension {
  // requestDidStart({
  //     operationName,
  //     queryString,
  //     variables
  // }) {
  //     this.requestId = uuid();
  //     this.startTime = new Date();
  //     logger.info(`>>>(${this.requestId}} Request Processing -OperationName: ${operationName}, Query: ${queryString}, Variables: ${JSON.stringify({...variables})}`);
  // }
  // parsingDidStart() {
  // }
  // validationDidStart() {
  // }
  // willSendResponse(response) {
  //     logger.info(`<<<(${this.requestId}) Request Completed : Duration(milliseconds): ${this.duration}`);
  //     return {
  //         ...response,
  //     };
  // }
  // executionDidStart() {
  //     this.executionStartTime = new Date();
  // }
  // willResolveField() {
  // }
  // format() {
  //     this.responseTime = new Date();
  //     this.duration = this.responseTime.getTime() - this.startTime.getTime();
  //     return ['customExtenstion', {
  //         startTimestamp: this.startTime.toISOString(),
  //         executionStartTimestamp: this.executionStartTime.toISOString(),
  //         responseTimestamp: this.responseTime.toISOString(),
  //         durationInMillis: this.duration
  //     }];
  // }
}
