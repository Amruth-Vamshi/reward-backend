// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from '../../utils/regex';
// import {
//     createauthorg
// } from "../../utils/functions"
// jest.setTimeout(120000);
// describe('testing authorization', () => {
//     beforeAll(async () => {
//         const org = await createauthorg();
//         console.log(org);
//     })
//     test('test for organization user login', async () => {
//         const operation = {
//             query: gql`query{
//             applications{
//               id
//               name
//               description
//               auth_key_hooks
//               platform
//               organization{
//                 id
//               }
//             }
//           }
//             `
//         };
//         const Queryapplications = await makePromise(execute(link, operation));
//         console.log(Queryapplications);
//     })
// })
