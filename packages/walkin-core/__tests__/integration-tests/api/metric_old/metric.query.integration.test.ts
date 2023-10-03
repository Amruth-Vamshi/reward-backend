// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
//   createauthorg,
//   createnewmetric1,
//   createnewmetricfilter1,
//   createneworg1
// } from "../../utils/functions";
// import { randomMetricFilterType, randomMetricType } from "../../utils/index";
// jest.setTimeout(120000);
// let metricfilterkey;
// let orgId;
// let metricId;
// let metricName;
// describe("query metric", () => {
//   test("query all the Metrics", async () => {
//     const operation = {
//       query: gql`
//         query {
//           metrics(status: ACTIVE) {
//             id
//             name
//             description
//             query
//             type
//             filters {
//               id
//             }
//             organization {
//               id
//             }
//             status
//           }
//         }
//       `
//     };
//     const QueryMetrics = await makePromise(execute(link, operation));
//   });
//   test("query speicfic Metric", async () => {
//     const operation = {
//       query: gql`query {
//               metric(id: "${metricId}") {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 filters {
//                   id
//                 }
//                 organization {
//                   id
//                 }

//                 status
//               }
//             }

//                `
//     };
//     const QueryMetric = await makePromise(execute(link, operation));
//   });
//   test("query speicfic Metric with invalid metric ID", async () => {
//     const metricid = "helloworld";
//     const operation = {
//       query: gql`query {
//               metric(id: "${metricid}") {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 filters {
//                   id
//                 }
//                 organization {
//                   id
//                 }

//                 status
//               }
//             }

//                `
//     };
//     const QueryMetric = await makePromise(execute(link, operation));
//     expect(QueryMetric.errors[0].message).toEqual("Invalid metric id");
//   });
// });
// describe('execute metric', () => {
//   test('executeMetricInCore', async () => {
//     const operation = {
//       query: gql`query {
//         executeMetricInCore(name:"${metricName}",organization_id:"${orgId}",filterValues:{
//            key: "${metricfilterkey}"
//         })
//         {
//           name
//           type
//           data
//         }
//       }

//                `
//     };
//     const executeMetricInCore = await makePromise(execute(link, operation));
//   });
//   test('executeMetricInCore with empty name', async () => {
//     const metricname = "";
//     const operation = {
//       query: gql`query {
//         executeMetricInCore(name:"${metricname}",organization_id:"${orgId}",filterValues:{
//            key: "${metricfilterkey}"
//         })
//         {
//           name
//           type
//           data
//         }
//       }

//                `
//     };
//     const executeMetricInCore = await makePromise(execute(link, operation));
//     expect(executeMetricInCore.errors[0].message).toEqual("metric name cannot be empty");
//   });
//   test('executeMetricInCore with empty org id', async () => {
//     const orgid = "";
//     const operation = {
//       query: gql`query {
//         executeMetricInCore(name:"${metricName}",organization_id:"${orgid}",filterValues:{
//            key: "${metricfilterkey}"
//         })
//         {
//           name
//           type
//           data
//         }
//       }

//                `
//     };
//     const executeMetricInCore = await makePromise(execute(link, operation));
//     expect(executeMetricInCore.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//   });
//   test('executeMetricInCore with invalid org id', async () => {
//     const orgid = "helloworld";
//     const operation = {
//       query: gql`query {
//         executeMetricInCore(name:"${metricName}",organization_id:"${orgid}",filterValues:{
//            key: "${metricfilterkey}"
//         })
//         {
//           name
//           type
//           data
//         }
//       }

//                `
//     };
//     const executeMetricInCore = await makePromise(execute(link, operation));
//     expect(executeMetricInCore.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//   });
//   test('executeMetricInCore with empty metric filter key', async () => {
//     const metricfilterKey = "";
//     const operation = {
//       query: gql`query {
//         executeMetricInCore(name:"${metricName}",organization_id:"${orgId}",filterValues:{
//            key: "${metricfilterKey}"
//         })
//         {
//           name
//           type
//           data
//         }
//       }

//                `
//     };
//     const executeMetricInCore = await makePromise(execute(link, operation));
//     expect(executeMetricInCore.errors[0].message).toEqual("metricfilterkey empty");
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const metricFilter = await createnewmetricfilter1(randomMetricFilterType);
//   metricfilterkey = metricFilter.data.createMetricFilter.key;
//   const metric = await createnewmetric1(
//     randomMetricType,
//     metricfilterkey,
//     orgId
//   );
//   metricId = metric.data.createMetric.id;
//   metricName = metric.data.createMetric.name;
// });
