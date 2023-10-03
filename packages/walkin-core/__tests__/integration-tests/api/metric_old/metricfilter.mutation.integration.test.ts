// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { METRIC_FILTER_TYPE } from "../../../src/modules/common/constants/constants";
// import { STATUS } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
//   createauthorg,
//   createnewmetricfilter,
//   createnewmetricfilter1
// } from "../../utils/functions";
// import {
//   randomMetricFilterKey,
//   randomMetricFilterName,
//   randomMetricFilterType,
//   UpdateMetricFilterKey,
//   UpdateMetricFilterName
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe("createmetricFilter", () => {
//   test("createMetricFilter with random values", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const metricFilter = await createnewmetricfilter(
//       randomMetricFilterKey,
//       randomMetricFilterName,
//       type
//     );
//     // positive tests for the createActionType API
//     expect(metricFilter.data.createMetricFilter.key).toBeTruthy();
//     expect(metricFilter.data.createMetricFilter.name).toBeTruthy();
//     expect(metricFilter.data.createMetricFilter.type).toBeTruthy();
//   });
//   test("createMetricFilter with random values with filter key as empty", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const MetricFilterKey = "";
//     const MetricFilterName = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const metricFilter = await createnewmetricfilter(
//       MetricFilterKey,
//       MetricFilterName,
//       type
//     );
//     expect(metricFilter.errors[0].validationErrors[0].message).toEqual(
//       "filter key cannot be empty"
//     );
//   });
//   test("createMetricFilter with random values with filter key which already exists", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     // const MetricFilterKey = "";
//     const MetricFilterName = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const metricFilter = await createnewmetricfilter(
//       randomMetricFilterKey,
//       MetricFilterName,
//       type
//     );
//     expect(metricFilter.errors[0].validationErrors[0].message).toEqual(
//       "filter key already exists"
//     );
//   });
//   test("createMetricFilter with random values with filter name as empty", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const MetricFilterKey = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const MetricFilterName = "";
//     const metricFilter = await createnewmetricfilter(
//       MetricFilterKey,
//       MetricFilterName,
//       type
//     );
//     expect(metricFilter.errors[0].validationErrors[0].message).toEqual(
//       "filter name cannot be empty"
//     );
//   });
//   test("createMetricFilter with random values and with filter name which already exists", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const MetricFilterKey = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     // const MetricFilterName = "";
//     const metricFilter = await createnewmetricfilter(
//       MetricFilterKey,
//       randomMetricFilterName,
//       type
//     );
//     expect(metricFilter.errors[0].validationErrors[0].message).toEqual(
//       "filter type cannot be empty"
//     );
//   });
//   test("createMetricFilter with random values with type as NUMBER", async () => {
//     const type = METRIC_FILTER_TYPE.NUMBER;

//     const MetricFilterKey = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const MetricFilterName = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const metricFilter = await createnewmetricfilter(
//       MetricFilterKey,
//       MetricFilterName,
//       type
//     );
//     expect(metricFilter.data.createMetricFilter.type).toEqual(
//       METRIC_FILTER_TYPE.NUMBER
//     );
//   });
//   test("createMetricFilter with random values with type as STRING", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const MetricFilterKey = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const MetricFilterName = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const metricFilter = await createnewmetricfilter(
//       MetricFilterKey,
//       MetricFilterName,
//       type
//     );
//     expect(metricFilter.data.createMetricFilter.type).toEqual(
//       METRIC_FILTER_TYPE.STRING
//     );
//   });
//   test("createMetricFilter with random values with type as INVALID", async () => {
//     const MetricFilterType = "INVALID";
//     const MetricFilterKey = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const MetricFilterName = Math.random()
//       .toString(36)
//       .substr(2, 14);
//     const metricFilter = await createnewmetricfilter(
//       MetricFilterKey,
//       MetricFilterName,
//       MetricFilterType
//     );
//   });
// });
// describe("updatemetricFilter", () => {
//   let metricFilterId;
//   beforeEach(async () => {
//     const metricFilter = await createnewmetricfilter1(randomMetricFilterType);
//     metricFilterId = metricFilter.data.createMetricFilter.id;
//   });
//   test("updateMetricFilter with random values", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const status = STATUS.ACTIVE;
//     const operation = {
//       query: gql`mutation{
//                       updateMetricFilter(input:{
//                         id:"${metricFilterId}"
//                         name:"${UpdateMetricFilterName}"
//                         type:${type}
//                         status:${status}
//                       })
//                       {
//                         id
//                         name
//                         key
//                         type
//                         status
//                       }
//                     }
//                  `
//     };
//     const UpdatemetricFilter = await makePromise(execute(link, operation));
//   });
//   test("updateMetricFilter with random values and name to empty", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const status = STATUS.ACTIVE;
//     // const MetricFilterKey = "";
//     const MetricFilterName = "";
//     const operation = {
//       query: gql`mutation{
//                       updateMetricFilter(input:{
//                         id:"${metricFilterId}"
//                         name:"${MetricFilterName}"
//                         type:${type}
//                         status:${status}
//                       })
//                       {
//                         id
//                         name
//                         key
//                         type
//                         status
//                       }
//                     }
//                  `
//     };
//     const UpdatemetricFilter = await makePromise(execute(link, operation));
//     expect(UpdatemetricFilter.errors[0].validationErrors[0].message).toEqual(
//       "name cannot be null"
//     );
//   });
//   test("updateMetricFilter with random values and name to which already exists", async () => {
//     const type = METRIC_FILTER_TYPE.STRING;
//     const status = STATUS.ACTIVE;
//     // const MetricFilterKey = "";
//     const MetricFilterName = "";
//     const operation = {
//       query: gql`mutation{
//                       updateMetricFilter(input:{
//                         id:"${metricFilterId}"
//                         name:"${UpdateMetricFilterName}"
//                         type:${type}
//                         status:${status}
//                       })
//                       {
//                         id
//                         name
//                         key
//                         type
//                         status
//                       }
//                     }
//                  `
//     };
//     const UpdatemetricFilter = await makePromise(execute(link, operation));
//     expect(UpdatemetricFilter.errors[0].validationErrors[0].message).toEqual(
//       "name already exists"
//     );
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// });
