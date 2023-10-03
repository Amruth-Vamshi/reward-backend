// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import { createauthorg, createnewaction, createnewaction1, createnewactiondefinition, createnewactiontype, createnewapp1, createneworg1 } from "../../utils/functions";
// import {

// } from "../../utils/index";
// jest.setTimeout(120000);
// describe('Query actiondefinitions', () => {
//   test('To display all the actiondefinitions', async () => {
//     const operation64 = {
//       query: gql`query{
//               actionDefinitions{
//                 id
//                 actionType{
//                   id
//                 }
//                 format
//                 schema
//                 status
//               }
//             }
//                `
//     };
//     const QueryActionDefinitions = await makePromise(execute(link, operation64));
//     // console.log(QueryActionDefinitions.data);
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// })
