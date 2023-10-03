// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import {
//   createauthorg,
//   createneworg1
// } from "../../utils/functions"
// jest.setTimeout(120000);
// const orgCode = Math.random().toString(36).substr(2, 10);
// describe('Query OrganizationRoots check', () => {
//   test('To display all the organizations that are present', async () => {
//     // Query OrganizationRoots
//     const operation = {
//       query: gql`query	{
//                     organizationRoots{
//                         id
//                         name

//                         code
//                         phoneNumber
//                         status
//                         website
//                         organizationType
//                     }
//                     }
//                     `
//     };
//     const Queryorganizations = await makePromise(execute(link, operation));
//   });
// });
// describe('Query organizationRoot check', () => {
//   test('Test to Query Specific Organization API', async () => {
//     // Query Specific Organization
//     const operation = {
//       query: gql`query{
//           organization(id:"${orgId}")
//           {
//             id
//             name

//             code
//             status
//             phoneNumber
//             organizationType
//             website
//           }
//         }
//            `
//     };
//     const Queryorganization = await makePromise(execute(link, operation));
//   });
//   test('Test to Query OrganizationHierarchies', async () => {
//     // Query Specific Organization
//     const operation = {
//       query: gql`query{
//                 organizationHierarchies{
//                   id
//                   name

//                   code
//                   phoneNumber
//                   website
//                   organizationType
//                   children{
//                     id
//                   }
//                 }
//               }
//            `
//     };
//     const Queryorganization = await makePromise(execute(link, operation));
//   });
//   test('Test to Query specific OrganizationHierarchy', async () => {
//     // Query Specific Organization
//     const operation = {
//       query: gql`query{
//                 organizationHierarchy(rootId:"${orgId}"){
//                   id
//                   name

//                   code
//                   phoneNumber
//                   website
//                   organizationType
//                   children{
//                     id
//                   }
//                 }
//               }
//            `
//     };
//     const Queryorganization = await makePromise(execute(link, operation));
//   });
//   test('Test to Query all OrganizationHierarchiesJSON', async () => {
//     // Query Specific Organization
//     const operation = {
//       query: gql`query{
//                 organizationHierarchiesJSON
//               }
//            `
//     };
//     const Queryorganization = await makePromise(execute(link, operation));
//   });
//   test('Test to Query specific OrganizationHierarchyJSON', async () => {
//     // Query Specific Organization
//     const operation = {
//       query: gql`query{
//                 organizationHierarchyJSON(id:"${orgId}")
//               }
//            `
//     };
//     const Queryorganization = await makePromise(execute(link, operation));
//   });
//   test('Test to Query Specific Organization API', async () => {
//     // Query Specific Organization
//     const orgid = "helloworld"
//     const operation = {
//       query: gql`query{
//           organization(id:"${orgid}")
//           {
//             id
//             name

//             code
//             status
//             phoneNumber
//             organizationType
//             website
//           }
//         }
//            `
//     };
//     const Queryorganization = await makePromise(execute(link, operation));
//     console.log(Queryorganization);
//     expect(Queryorganization.errors[0].validationErrors[0].message).toEqual("Invalid Organization Id");
//   });
// });
// let orgId;

// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const org = await createneworg1();
//   orgId = org.data.createOrganizationRoot.id;
// })
