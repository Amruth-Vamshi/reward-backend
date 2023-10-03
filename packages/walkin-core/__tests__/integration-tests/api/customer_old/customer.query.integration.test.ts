// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../utils/testUtils";
// import { createauthorg, createnewcustomer1, createneworg1 } from "../../utils/functions";
// let orgId;
// jest.setTimeout(120000);
// describe('Query customers', () => {
//   test('To display all the customers', async () => {
//     const operation = {
//       query: gql`query{
//               customers{
//                 id
//                 firstName
//                 lastName
//                 email
//                 phoneNumber
//                 gender
//                 dateOfBirth
//                 customerIdentifier
//                 organization{
//                   id
//                 }

//               }
//             }

//                `
//     };
//     const QueryCustomers = await makePromise(execute(link, operation));

//   });
// });

// describe('Query customers', () => {

//   let custId;
//   beforeEach(async () => {
//     const cust = await createnewcustomer1(orgId);
//     custId = cust.data.createCustomer.id;
//   })
//   test('To display specific customer', async () => {
//     const operation = {
//       query: gql`query{
//               customer(input:{
//                 id:"${custId}"
//               }){
//                 id
//                 firstName
//                 lastName
//                 email
//                 phoneNumber
//                 gender
//                 dateOfBirth
//                 customerIdentifier
//                 organization{
//                   id
//                 }

//               }
//             }

//                `
//     };
//     const QueryCustomer = await makePromise(execute(link, operation));

//   });
//   test('To display specific customer with empty customer id ', async () => {
//     const custid = "";
//     const operation = {
//       query: gql`query{
//               customer(input:{
//                 id:"${custid}"
//               }){
//                 id
//                 firstName
//                 lastName
//                 email
//                 phoneNumber
//                 gender
//                 dateOfBirth
//                 customerIdentifier
//                 organization{
//                   id
//                 }

//               }
//             }

//                `
//     };
//     const QueryCustomer = await makePromise(execute(link, operation));
//     expect(QueryCustomer.errors[0].validationErrors[0].message).toEqual("customer id cannot be empty");
//   });
//   test('To display specific customer with invalid customer id ', async () => {
//     const custid = "helloworld";
//     const operation = {
//       query: gql`query{
//               customer(input:{
//                 id:"${custid}"
//               }){
//                 id
//                 firstName
//                 lastName
//                 email
//                 phoneNumber
//                 gender
//                 dateOfBirth
//                 customerIdentifier
//                 organization{
//                   id
//                 }

//               }
//             }

//                `
//     };
//     const QueryCustomer = await makePromise(execute(link, operation));
//     expect(QueryCustomer.errors[0].validationErrors[0].message).toEqual("invalid customer id");
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const organization = await createneworg1();
//   orgId = organization.data.createOrganizationRoot.id;
// })
