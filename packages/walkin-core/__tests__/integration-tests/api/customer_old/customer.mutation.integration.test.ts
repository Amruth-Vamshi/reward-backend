// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { GENDER } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { updateEntity } from "../../../src/modules/common/utils/utils";
// import { matchUriRE } from '../../utils/regex';
// import {
//   createauthorg,
//   createnewapp1,
//   createnewcustomer,
//   createnewcustomer1,
//   createneworg1
// } from "../../utils/functions";
// import {
//   orgt,
//   randomCustDate,
//   randomCustEmail,
//   randomCustExId,
//   randomCustFirstname,
//   randomCustIdentifier,
//   randomCustLastname,
//   randomCustPhno,
//   UpdateCustDate,
//   UpdateCustEmail,
//   UpdateCustExId,
//   UpdateCustFirstname,
//   UpdateCustGender,
//   UpdateCustIdentifier,
//   UpdateCustLastname,
//   UpdateCustPhno

// } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// describe('createCustomer', () => {
//   test('createCustomer with randomValues', async () => {
//     const randomCustGender = GENDER.FEMALE;
//     const customer = await createnewcustomer(orgId, randomCustFirstname, randomCustLastname, randomCustEmail, randomCustPhno, randomCustGender, randomCustDate, randomCustExId, randomCustIdentifier);
//     const customerId = customer.data.createCustomer.id;
//     const customerPhnNo = customer.data.createCustomer.phoneNumber;
//     expect(customerId).toBeTruthy();
//     expect(customerPhnNo).toBeTruthy();
//   });
//   test('createCustomer with randomValues with empty orgid', async () => {
//     const randomCustGender = GENDER.FEMALE;
//     const orgid = "";
//     const CustPhno = Math.floor(6000000000 + Math.random() * 4000000000);
//     const CustIdentifier = Math.random().toString(36).substr(2, 14);
//     const customer = await createnewcustomer(orgid, randomCustFirstname, randomCustLastname, randomCustEmail, CustPhno, randomCustGender, randomCustDate, randomCustExId, CustIdentifier);
//     expect(customer.errors[0].validationErrors[0].message).toEqual("Organization not found");
//   });
//   test('createCustomer with randomValues with gender as MALE', async () => {
//     const randomCustGender = GENDER.MALE;
//     const orgid = "";
//     const CustPhno = Math.floor(6000000000 + Math.random() * 4000000000);
//     const CustIdentifier = Math.random().toString(36).substr(2, 14);
//     const customer = await createnewcustomer(orgid, randomCustFirstname, randomCustLastname, randomCustEmail, CustPhno, randomCustGender, randomCustDate, randomCustExId, CustIdentifier);
//     expect(customer.errors[0].validationErrors[0].message).toEqual("Organization not found");
//   });
//   test('createCustomer with randomValues with invalid orgid', async () => {
//     const randomCustGender = GENDER.FEMALE;
//     const orgid = "1234";
//     const CustPhno = Math.floor(6000000000 + Math.random() * 4000000000);
//     const CustIdentifier = Math.random().toString(36).substr(2, 14);
//     const customer = await createnewcustomer(orgid, randomCustFirstname, randomCustLastname, randomCustEmail, CustPhno, randomCustGender, randomCustDate, randomCustExId, CustIdentifier);
//     expect(customer.errors[0].validationErrors[0].message).toEqual("Organization not found");
//   });
//   test('createCustomer with randomValues with phone number as empty', async () => {
//     const randomCustGender = GENDER.FEMALE;
//     const CustPhno = "";
//     const CustIdentifier = Math.random().toString(36).substr(2, 14);
//     const customer = await createnewcustomer(orgId, randomCustFirstname, randomCustLastname, randomCustEmail, CustPhno, randomCustGender, randomCustDate, randomCustExId, CustIdentifier);

//     expect(customer.errors[0].validationErrors[0].message).toEqual("phone number cannot be null");
//   });
//   test('createCustomer with randomValues with phone number which already exists', async () => {
//     const randomCustGender = GENDER.FEMALE;
//     // const CustPhno = "";
//     const CustIdentifier = Math.random().toString(36).substr(2, 14);
//     const customer = await createnewcustomer(orgId, randomCustFirstname, randomCustLastname, randomCustEmail, randomCustPhno, randomCustGender, randomCustDate, randomCustExId, CustIdentifier);
//     expect(customer.errors[0].errorCode).toEqual("errors.cus001.code");
//   });
//   test('createCustomer with randomValues with gender as INVALID', async () => {
//     // const randomCustGender = GENDER.MALE;
//     const CustPhno = Math.floor(6000000000 + Math.random() * 4000000000);
//     const CustIdentifier = Math.random().toString(36).substr(2, 14);
//     const CustGender = "INVALID";
//     const customer = await createnewcustomer(orgId, randomCustFirstname, randomCustLastname, randomCustEmail, CustPhno, CustGender, randomCustDate, randomCustExId, CustIdentifier);

//   });
//   test('createCustomer with randomValues with date as invalid date', async () => {
//     const randomCustGender = GENDER.FEMALE;
//     const CustPhno = Math.floor(6000000000 + Math.random() * 4000000000);
//     const CustIdentifier = Math.random().toString(36).substr(2, 14);
//     const CustDate = "helloworld";
//     const customer = await createnewcustomer(orgId, randomCustFirstname, randomCustLastname, randomCustEmail, CustPhno, randomCustGender, CustDate, randomCustExId, CustIdentifier);
//     expect(customer.errors[0].validationErrors[0].message).toEqual("Invalid date");
//   });
//   test('createCustomer with randomValues with identifier which already exists', async () => {
//     const randomCustGender = GENDER.FEMALE;
//     const CustPhno = Math.floor(6000000000 + Math.random() * 4000000000);
//     const customer = await createnewcustomer(orgId, randomCustFirstname, randomCustLastname, randomCustEmail, CustPhno, randomCustGender, randomCustDate, randomCustExId, randomCustIdentifier);
//     expect(customer.errors[0].errorCode).toEqual("errors.cust003.code");
//   });
// });
// describe('updateCustomer', () => {
//   let custId;
//   let orgId;
//   beforeEach(async () => {
//     const org = await createneworg1();
//     orgId = org.data.createOrganizationRoot.id;
//     const cust = await createnewcustomer1(orgId);
//     custId = cust.data.createCustomer.id;
//   })

//   // console.log(UpdateCustFirstname);
//   // console.log(UpdateCustLastname);
//   // console.log(UpdateCustEmail);
//   // console.log(UpdateCustPhno);
//   // console.log(UpdateCustGender);
//   // console.log(UpdateCustDate);

//   test('updateCustomer with randomValues', async () => {
//     const UpdateCustGender = GENDER.FEMALE;
//     const operation = {
//       query: gql`mutation
//         {
//           updateCustomer(customer:{
//             id:"${custId}"
//             firstName:"${UpdateCustFirstname}"
//             lastName:"${UpdateCustLastname}"
//             email:"${UpdateCustEmail}"
//             phoneNumber:"${UpdateCustPhno}"
//             gender: ${UpdateCustGender}
//             dateOfBirth:"${UpdateCustDate}"
//             organization:"${orgId}"
//           })
//           {
//             id
//             phoneNumber

//           }
//         }
//        `
//     };
//     const Updatecustomer = await makePromise(execute(link, operation));
//     expect(Updatecustomer.data.updateCustomer.id).toBeTruthy();
//   });
//   test('updateCustomer to empty phone number', async () => {
//     const UpdateCustGender = GENDER.FEMALE;
//     const CustPhno = "";
//     const operation = {
//       query: gql`mutation
//         {
//           updateCustomer(customer:{
//             id:"${custId}"
//             phoneNumber:"${CustPhno}"
//             organization:"${orgId}"
//           })
//           {
//             id
//             phoneNumber

//           }
//         }
//        `
//     };
//     const Updatecustomer = await makePromise(execute(link, operation));
//     expect(Updatecustomer.errors[0].validationErrors[0].message).toEqual("Phone number is not valid");
//   });
//   test('updateCustomer to invalid phone number', async () => {
//     // const UpdateCustGender = GENDER.FEMALE;
//     const CustPhno = "helloworld";
//     const operation = {
//       query: gql`mutation
//         {
//           updateCustomer(customer:{
//             id:"${custId}"
//             phoneNumber:"${CustPhno}"
//             organization:"${orgId}"
//           })
//           {
//             id
//             phoneNumber

//           }
//         }
//        `
//     };
//     const Updatecustomer = await makePromise(execute(link, operation));
//     expect(Updatecustomer.errors[0].validationErrors[0].message).toEqual("Phone number is not valid");
//   });
// });
// describe('disableCustomer', () => {
//   let orgId;
//   let custphone;
//   let custId;
//   beforeEach(async () => {
//     const organization = await createneworg1();
//     orgId = organization.data.createOrganizationRoot.id;
//   })
//   beforeEach(async () => {
//     const cust = await createnewcustomer1(orgId);
//     custId = cust.data.createCustomer.id;
//     custphone = cust.data.createCustomer.phoneNumber;
//   })
//   test('disableCustomer after creating a new Customer', async () => {
//     const operation = {
//       query: gql`mutation{
//         disableCustomer(customer:{
//           id:"${custId}"
//           phoneNumber:"${custphone}"
//           organization_id:"${orgId}"

//         })
//         {
//           id
//         }
//       }

//          `
//     };
//     const Disablecustomer = await makePromise(execute(link, operation));
//     console.log(Disablecustomer.errors);
//   });
//   test('disableCustomer with empty customer id', async () => {
//     const custid = "";
//     const operation = {
//       query: gql`mutation{
//         disableCustomer(customer:{
//           id:"${custid}"
//           phoneNumber:"${custphone}"
//           organization_id:"${orgId}"

//         })
//         {
//           id
//         }
//       }

//          `
//     };

//     const Disablecustomer = await makePromise(execute(link, operation));
//     console.log(Disablecustomer.errors);
//   });
//   test('disableCustomer with invalid customer id', async () => {
//     const custid = "invalid";
//     const operation = {
//       query: gql`mutation{
//         disableCustomer(customer:{
//           id:"${custid}"
//           phoneNumber:"${custphone}"
//           organization_id:"${orgId}"

//         })
//         {
//           id
//         }
//       }

//          `
//     };

//     const Disablecustomer = await makePromise(execute(link, operation));
//     console.log(Disablecustomer);
//   });
// });
// beforeAll(async () => {
//   const authorg = await createauthorg();
//   const organization = await createneworg1();
//   orgId = organization.data.createOrganizationRoot.id;
// })
