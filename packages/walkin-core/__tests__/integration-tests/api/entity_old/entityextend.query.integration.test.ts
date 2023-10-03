// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
//   addnewentityextend,
//   addnewentityextend1,
//   createauthorg,
//   createneworg1
// } from "../../utils/functions";
// import { randomExtendDescription, randomExtendType } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// let entityExtendId;
// describe("query entityextend", () => {
//   test("query entityextend with entity extend ID", async () => {
//     const operation = {
//       query: gql`query{
//               entityExtend(id:"${entityExtendId}"){
//                 id
//                 entityName
//                 description
//                 organization{
//                   id
//                 }
//               }
//             }

//                `
//     };
//     const QueryEntityExtend = await makePromise(execute(link, operation));
//   });
//   test("query entityextend with empty entity extend ID", async () => {
//     const entityextendid = "";
//     const operation = {
//       query: gql`query{
//               entityExtend(id:"${entityextendid}"){
//                 id
//                 entityName
//                 description
//                 organization{
//                   id
//                 }
//               }
//             }

//                `
//     };
//     const QueryEntityExtend = await makePromise(execute(link, operation));
//   });
//   test("query entityextend with invalid entity extend ID", async () => {
//     const entityextendid = "helloworld";
//     const operation = {
//       query: gql`query{
//               entityExtend(id:"${entityextendid}"){
//                 id
//                 entityName
//                 description
//                 organization{
//                   id
//                 }
//               }
//             }

//                `
//     };
//     const QueryEntityExtend = await makePromise(execute(link, operation));
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const extend = await addnewentityextend(
//     orgId,
//     randomExtendType,
//     randomExtendDescription
//   );
//   entityExtendId = extend.data.addEntityExtend.id;
// });
