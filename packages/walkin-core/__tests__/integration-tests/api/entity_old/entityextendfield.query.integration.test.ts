// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
//   addnewentityextend,
//   addnewentityextendfield1,
//   createneworg1
// } from "../../utils/functions";
// import {
//   randomExtendDescription,
//   randomExtendType,
//   randomFieldType
// } from "../../utils/index";
// let orgId;
// let entityExtendId;
// let entityExtendFieldId;
// describe("query entityextendField", () => {
//   test("query specific entity extend field", async () => {
//     const operation = {
//       query: gql`query{
//                 entityExtendField(id:"${entityExtendFieldId}"){
//                   id
//                   slug
//                   type
//                 }
//               }

//                `
//     };
//     const QueryEntityExtend = await makePromise(execute(link, operation));
//   });
//   test("query specific entity extend field with empty field id", async () => {
//     const entityextendfieldid = "";
//     const operation = {
//       query: gql`query{
//                 entityExtendField(id:"${entityextendfieldid}"){
//                   id
//                   slug
//                   type
//                 }
//               }

//                `
//     };
//     const QueryEntityExtend = await makePromise(execute(link, operation));
//   });
//   test("query specific entity extend field with invalid field id", async () => {
//     const entityextendfieldid = "";
//     const operation = {
//       query: gql`query{
//                 entityExtendField(id:"${entityextendfieldid}"){
//                   id
//                   slug
//                   type
//                 }
//               }

//                `
//     };
//     const QueryEntityExtend = await makePromise(execute(link, operation));
//   });
// });
// beforeAll(async () => {
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
//   const extend = await addnewentityextend(
//     orgId,
//     randomExtendType,
//     randomExtendDescription
//   );
//   entityExtendId = extend.data.addEntityExtend.id;
//   const extendfield = await addnewentityextendfield1(
//     entityExtendId,
//     randomFieldType
//   );
//   entityExtendFieldId = extendfield.data.addEntityExtendField.id;
// });
