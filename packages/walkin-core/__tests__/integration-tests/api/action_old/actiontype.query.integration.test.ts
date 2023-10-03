// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import { createauthorg, createnewaction, createnewaction1, createnewactiondefinition, createnewactiontype, createnewapp1, createneworg1 } from "../../utils/functions";
// import {

// } from "../../utils/index";
// jest.setTimeout(120000);
// describe('Query actiontypes', () => {
//   test('To display all the actiontypes', async () => {
//     const operation = {
//       query: gql`query{
//                       actiontypes{
//                         id
//                         type
//                         status
//                       }
//                     }
//                `
//     };

//     const QueryactionTypes = await makePromise(execute(link, operation));
//     // console.log(QueryactionTypes.data);
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
// })
