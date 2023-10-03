// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { METRIC_TYPE } from "../../../src/modules/common/constants/constants";// scalar,sequence,matrix
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//   createauthorg,
//   createnewmetric,
//   createnewmetric1,
//   createnewmetricfilter1,
//   createneworg1
// } from "../../utils/functions";
// import {
//   randomMetricDescription,
//   randomMetricFilterType,
//   randomMetricName,
//   randomMetricQuery,
//   randomMetricType,
//   UpdateMetricDescription,
//   UpdateMetricName,
//   UpdateMetricQuery,
//   UpdateMetricType
// } from "../../utils/index";
// jest.setTimeout(120000);
// let metricfilterkey;
// let orgId;
// describe('createmetric', () => {

//   test('createMetric with random values', async () => {
//     const metricType = METRIC_TYPE.SCALAR;
//     const metric = await createnewmetric(randomMetricName, randomMetricDescription, randomMetricQuery, metricType, metricfilterkey, orgId);
//     // positive tests for the createActionType API
//     // expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
//     expect(metric.data.createMetric.name).toBeTruthy();
//     expect(metric.data.createMetric.type).toEqual(METRIC_TYPE.SCALAR);
//     expect(metric.data.createMetric.description).toBeTruthy();
//     expect(metric.data.createMetric.query).toBeTruthy();
//     expect(metric.data.createMetric.type).toBeTruthy();
//     expect(metric.data.createMetric.filters.id).not.toBeNull();
//     expect(metric.data.createMetric.organization.id).toBeTruthy();
//   });
//   test('createMetric with random values with name as empty', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = "";
//     const metricType = METRIC_TYPE.SCALAR;
//     const metric = await createnewmetric(MetricName, randomMetricDescription, MetricQuery, metricType, metricfilterkey, orgId);
//     expect(metric.errors[0].validationErros[0].message).toEqual("name cannot be null");
//   });
//   test('createMetric with random values with name which already exists', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const metricType = METRIC_TYPE.SCALAR;
//     // const MetricName = "";
//     const metric = await createnewmetric(randomMetricName, randomMetricDescription, MetricQuery, metricType, metricfilterkey, orgId);
//     expect(metric.errors[0].validationErros[0].message).toEqual("name already exists");
//   });
//   test('createMetric with random values with description as empty', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = Math.random().toString(36).substr(2, 14);
//     const metricType = METRIC_TYPE.SCALAR;
//     const MetricDescription = "";
//     const metric = await createnewmetric(MetricName, MetricDescription, MetricQuery, metricType, metricfilterkey, orgId);
//     console.log(metric);
//     expect(metric.errors[0].validationErros[0].message).toEqual("description cannot be null");
//   });
//   test('createMetric with random values with Query as empty', async () => {
//     const MetricQuery = "";
//     const metricType = METRIC_TYPE.SCALAR;
//     const MetricName = Math.random().toString(36).substr(2, 14);
//     const metric = await createnewmetric(MetricName, randomMetricDescription, MetricQuery, metricType, metricfilterkey, orgId);
//     expect(metric.errors[0].validationErros[0].message).toEqual("query cannot be null");
//   });
//   test('createMetric with random values with Query which already exists', async () => {
//     //  const MetricQuery = "";
//     const metricType = METRIC_TYPE.SCALAR;
//     const MetricName = Math.random().toString(36).substr(2, 14);
//     const metric = await createnewmetric(MetricName, randomMetricDescription, randomMetricQuery, metricType, metricfilterkey, orgId);
//     expect(metric.errors[0].validationErros[0].message).toEqual("query already exists");
//   });
//   test('createMetric with random values with filterKey as empty', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = Math.random().toString(36).substr(2, 14);
//     const metricfilterkey = "";
//     const metricType = METRIC_TYPE.SCALAR;
//     const metric = await createnewmetric(MetricName, randomMetricDescription, MetricQuery, metricType, metricfilterkey, orgId);
//     expect(metric.errors[0].errorCode).toEqual("errors.METRIC_FILTER_INVALID.code");
//   });
//   test('createMetric with random values with organization id as invalid ', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = Math.random().toString(36).substr(2, 14);
//     const orgid = "helloworld";
//     const metricType = METRIC_TYPE.SCALAR;
//     const metric = await createnewmetric(MetricName, randomMetricDescription, MetricQuery, metricType, metricfilterkey, orgid);
//     expect(metric.errors[0].errorCode).toEqual("errors.ORGANIZATION_INVALID.code");
//   });
//   test('createMetric with random values with type as SEQUENCE', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = Math.random().toString(36).substr(2, 14);
//     const metricType = METRIC_TYPE.SEQUENCE;
//     const MetricDescription = Math.random().toString(36).substr(2, 14);
//     const metric = await createnewmetric(MetricName, MetricDescription, MetricQuery, metricType, metricfilterkey, orgId);
//     expect(metric.errors[0].validationErros[0].message).toEqual("description cannot be null");
//   });
//   test('createMetric with random values with type as MATRIX', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = Math.random().toString(36).substr(2, 14);
//     const metricType = METRIC_TYPE.MATRIX;
//     const MetricDescription = Math.random().toString(36).substr(2, 14);
//     const metric = await createnewmetric(MetricName, MetricDescription, MetricQuery, metricType, metricfilterkey, orgId);
//     expect(metric.errors[0].validationErros[0].message).toEqual("description cannot be null");
//   });
// });
// describe('createMetric', () => {
//   let metricFilterId;
//   let metricfilterkey;
//   beforeAll(async () => {
//     const metricFilter = await createnewmetricfilter1(randomMetricFilterType);
//     metricFilterId = metricFilter.data.createMetricFilter.id;
//   })
//   beforeAll(async () => {
//     const MetricFilterName = "";
//     const operation = {
//       query: gql`mutation{
//                       updateMetricFilter(input:{
//                         id:"${metricFilterId}"
//                         status:INACTIVE
//                       })
//                       {
//                         status
//                         key

//                       }
//                     }
//                  `
//     };
//     const UpdatemetricFilter = await makePromise(execute(link, operation));
//     metricfilterkey = UpdatemetricFilter.data.updateMetricFilter.key;
//     // const metricfilterkey =UpdatemetricFilter.data.;

//   });
//   test('createMetric with random values and filters key as INACTIVE', async () => {
//     const metricType = METRIC_TYPE.SCALAR;
//     const metric = await createnewmetric(randomMetricName, randomMetricDescription, randomMetricQuery, metricType, metricfilterkey, orgId);
//     // positive tests for the createActionType API
//     expect(metric.errors[0].errorCode).toEqual("errors.METRIC_FILTER_INVALID.code");
//   });
// })
// describe('updatemetric', () => {
//   let metricId;
//   let orgId;
//   beforeEach(async () => {
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const metricType = METRIC_TYPE.SCALAR;
//     const metric = await createnewmetric1(metricType, metricfilterkey, orgId);
//     metricId = metric.data.createMetric.id;
//   })
//   test('updateMetric with random values', async () => {
//     const type = METRIC_TYPE.SCALAR;
//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 name:"${UpdateMetricName}"
//                 description:"${UpdateMetricDescription}"
//                 query:"${UpdateMetricQuery}"
//                 type:${type}
//                 status:ACTIVE
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));
//     // console.log(Updatemetric);

//     // positive tests for the createActionType API
//     // expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
//     expect(Updatemetric.data.updateMetric.name).toBeTruthy();
//     expect(Updatemetric.data.updateMetric.description).toBeTruthy();
//     expect(Updatemetric.data.updateMetric.query).toBeTruthy();
//     expect(Updatemetric.data.updateMetric.type).toBeTruthy();
//     //  expect(Updatemetric.data.updateMetric.filters.id).not.toBeNull();
//     // expect(Updatemetric.data.updateMetric.organization.id).toBeTruthy();
//   });
//   test('updateMetric with random values and update name to empty', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = "";
//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 name:"${MetricName}"
//                 status:ACTIVE
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));
//     expect(Updatemetric.errors[0].message).toEqual("name cannot be null");
//   });
//   test('updateMetric with random values and update name which already exists', async () => {
//     const MetricQuery = Math.random().toString(36).substr(2, 14);
//     const MetricName = "";
//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 name:"${UpdateMetricName}"
//                 status:ACTIVE
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));
//     expect(Updatemetric.errors[0].message).toEqual("name already exists");
//   });
//   test('updateMetric with random values and description to empty', async () => {
//     const MetricDescription = "";

//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 description:"${MetricDescription}"
//                 status:ACTIVE
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));
//     expect(Updatemetric.errors[0].message).toEqual("description cannot be null");
//   });
//   test('updateMetric with random values and query to empty', async () => {
//     const MetricQuery = "";

//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 query:"${MetricQuery}"
//                 status:ACTIVE
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));
//     expect(Updatemetric.errors[0].message).toEqual("query cannot be null");
//   });
//   test('updateMetric with random values and filters to empty', async () => {
//     const metricfilterkey = "";

//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 filters:"${metricfilterkey}"
//                 status:ACTIVE
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));
//     expect(Updatemetric.errors[0].message).toEqual("filters cannot be null");
//   });
//   test('updateMetric with random values and status to INACTIVE', async () => {
//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"

//                 status:INACTIVE
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));

//   });
//   test('updateMetric with random values and status to DRAFT', async () => {
//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 status:DRAFT
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status
//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));

//   });
//   test('updateMetric with random values and status to INVALID', async () => {
//     const operation = {
//       query: gql`mutation
//             {
//               updateMetric(input:{
//                 id:"${metricId}"
//                 status:INVALID
//               })
//               {
//                 id
//                 name
//                 description
//                 query
//                 type
//                 status

//               }
//             }

//                  `
//     };

//     const Updatemetric = await makePromise(execute(link, operation));

//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const metricFilter = await createnewmetricfilter1(randomMetricFilterType);
//   metricfilterkey = metricFilter.data.createMetricFilter.key;
// })
