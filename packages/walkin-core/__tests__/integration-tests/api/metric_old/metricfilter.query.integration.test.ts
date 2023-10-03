// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
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
//   UpdateMetricFilterName
// } from "../../utils/index";
// jest.setTimeout(120000);
// describe("query metricFilter", () => {
//   test("query all the metric filters", async () => {
//     const operation = {
//       query: gql`query{
//               metricFilters(status:${STATUS.ACTIVE}){
//                 id
//                 name
//                 key
//                 type
//                 status
//               }
//             }
//                `
//     };
//     const QueryMetricFilters = await makePromise(execute(link, operation));
//   });
// });

// test("query specific MetricFilter", async () => {
//   const operation = {
//     query: gql`query {
//               metricFilter(id: "${metricFilterId}") {
//                 id
//                 name
//                 key
//                 type
//                 status
//               }
//             }

//                `
//   };
//   const QueryMetricFilter = await makePromise(execute(link, operation));
// });
// test("query specific MetricFilter with filter id as empty", async () => {
//   const metricfilterid = "";
//   const operation = {
//     query: gql`query {
//               metricFilter(id: "${metricfilterid}") {
//                 id
//                 name
//                 key
//                 type
//                 status
//               }
//             }

//                `
//   };
//   const QueryMetricFilter = await makePromise(execute(link, operation));
//   expect(QueryMetricFilter.errors[0].message).toEqual(
//     "filter id cannot be null"
//   );
// });
// test("query specific MetricFilter with filter id as invalid", async () => {
//   const metricfilterid = "helloworld";
//   const operation = {
//     query: gql`query {
//               metricFilter(id: "${metricfilterid}") {
//                 id
//                 name
//                 key
//                 type
//                 status
//               }
//             }

//                `
//   };
//   const QueryMetricFilter = await makePromise(execute(link, operation));
//   expect(QueryMetricFilter.errors[0].message).toEqual(
//     "filter id is invalid code"
//   );
// });
// let metricFilterId;
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const metricFilter = await createnewmetricfilter1(randomMetricFilterType);
//   metricFilterId = metricFilter.data.createMetricFilter.id;
// });
