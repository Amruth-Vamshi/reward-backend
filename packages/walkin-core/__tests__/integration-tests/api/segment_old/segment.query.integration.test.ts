// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { STATUS } from "../../../src/modules/common/constants/constants"
// import { link } from "../../utils/testUtils";
// import { createauthorg, createnewapp1, createnewcustomer1, createneworg1, createnewrule3, createnewruleconfig1, createnewsegment1 } from "../../utils/functions";
// jest.setTimeout(120000);
// describe('Query Segments', () => {
//   test('To display all the segments', async () => {
//     const status = STATUS.ACTIVE
//     const operation = {
//       query: gql`query {
//         segments(status: ${status}, organization_id: "${orgId}") {
//           id
//           name
//           description
//           segmentType
//           organization {
//             id
//           }
//           application {
//             id
//           }
//           rule {
//             id
//           }
//           status
//         }
//       }

//               `
//     };
//     const QuerySegments = await makePromise(execute(link, operation));

//   });
// });

// describe('Query Segments', () => {

//   test('To display specific segment', async () => {
//     const operation = {
//       query: gql`query{
//         segment(id:"${segId}")
//         {
//           id
//           name
//           description
//           segmentType
//           organization{
//             id
//           }
//           application{
//             id
//           }
//           rule{
//             id
//           }
//           status
//         }
//       }
//               `
//     };
//     const QuerySegment = await makePromise(execute(link, operation));
//     expect(QuerySegment.data.segment.id).toEqual(segId);
//   });
//   test('To display specific segment with invalid segment name', async () => {
//     const segid = "helllooooowwoooorrrlllldddd";
//     const operation = {
//       query: gql`query{
//         segment(id:"${segid}")
//         {
//           id
//           name
//           description
//           segmentType
//           organization{
//             id
//           }
//           application{
//             id
//           }
//           rule{
//             id
//           }
//           status
//         }
//       }
//               `
//     };
//     const QuerySegment = await makePromise(execute(link, operation));
//     // console.log(QuerySegment)
//     expect(QuerySegment.errors[0].message).toEqual("Invalid Segment Id");
//   });
//   test('To display specific segment with empty segment name', async () => {
//     const segid = "helllooooowwoooorrrlllldddd";
//     const operation = {
//       query: gql`query{
//         segment(id:"${segid}")
//         {
//           id
//           name
//           description
//           segmentType
//           organization{
//             id
//           }
//           application{
//             id
//           }
//           rule{
//             id
//           }
//           status
//         }
//       }
//               `
//     };
//     const QuerySegment = await makePromise(execute(link, operation));
//     // console.log(QuerySegment);
//     expect(QuerySegment.errors[0].message).toEqual("Invalid Segment Id");
//   });
// });
// let orgId;
// let appId;
// let ruleId;
// let segId;
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const app = await createnewapp1(orgId);
//   appId = app.data.createApplication.id;
//   const rule = await createnewrule3(orgId);
//   ruleId = rule.data.createRule.id;
//   const seg = await createnewsegment1(orgId, appId, ruleId);
//   segId = seg.data.createSegment.id;

// })
