// import { execute, makePromise } from "apollo-link";
// import { parseAndCheckHttpResponse } from "apollo-link-http-common";
// import { fetch } from "apollo-server-env";
// import gql from "graphql-tag";
// import { async } from "q";
// import { WorkflowProcess } from "../../src/entity";
// import { link } from "./testUtils";
// let authemail;
// const authpassword = "password";
// const randomemail = Math.random().toString(36).substr(2, 9);
// const randompassword = Math.random().toString(36).substr(2, 9);
// const randomOrgName = Math.random().toString(36).substr(2, 9);
// const randomOrgCode = Math.random().toString(36).substr(2, 9);

// // ##################################################### NEW CHANGES(with mandatory fields)######################################################//
// export async function createOrganization() {
//   const operation = {
//     query: gql`mutation { createOrganization( organizationInput: { name: "${randomOrgName}" code: "${randomOrgCode}" status: ACTIVE organizationType: ORGANIZATION } ) {id name code status organizationType users { email firstName lastName } } } `
//   };
//   const organization = await makePromise(execute(link, operation));
//   return organization;
// }

// export async function createUser() {
//   const operation = {
//     query: gql`mutation { createUser( input: { email: "${randomemail}", password: "${authpassword}" } createOrganization: { name: "${randomOrgName}" code: "${randomOrgCode}" status: ACTIVE organizationType: ORGANIZATION } ) { id email organization { id name code status organizationType } } }`
//   };
//   const user = await makePromise(execute(link, operation));
//   return user;
// }

// // ##################################################### NEW CHANGES(with all fields)######################################################//

// // export async function createOrganization1() {
// //   const operation = {
// //     query: gql`mutation { createOrganization( organizationInput: { name: "${name}" addressLine1: "${addressLine1addressLine}" addressLine2: "${addressLine2}" city: "${city}" state: "${state}" pinCode: "${pinCode}" country: "${country}" externalOrganizationId: "${externalOrganizationId}" code: "${code}" status: "${}" phoneNumber: "${phoneNumber}" website: "${website}" organizationType: "${organizationType}" } walkinProducts: ['${walkinProducts}'] ) { id name addressLine1 addressLine2 city state pinCode country externalOrganizationId code status phoneNumber website extend organizationType users { id email firstName lastName status } } } `
// //   };
// //   const organization = await makePromise(execute(link, operation));
// //   return organization;
// // }

// // export async function createUser1() {
// //   const operation = {
// //     query: gql`mutation { createUser( input: { email: "${email}" firstName: "${firstName}" lastName: "${lastName}" password: "${password}" } organizationInput: { name: "${name}" addressLine1: "${addressLine1addressLine}" addressLine2: "${addressLine2}" city: "${city}" state: "${state}" pinCode: "${pinCode}" country: "${country}" externalOrganizationId: "${externalOrganizationId}" code: "${code}" status: "${status}" phoneNumber: "${phoneNumber}" website: "${website}" organizationType: "${organizationType}" } walkinProducts: ["${walkinProducts}"] ) { id email firstName lastName extend status organization { id name addressLine1 addressLine2 city state pinCode country externalOrganizationId code status phoneNumber website extend organizationType users { id email } } } } `
// //   };
// //   const user = await makePromise(execute(link, operation));
// //   return user;
// // }
// // ###########################################################################################################//

// /*******************************************************************************************************************
// * *****************************************************************************************************************
// * *****************************************************************************************************************
// *                                                 Authorization
// * *****************************************************************************************************************
// * *****************************************************************************************************************
// * *****************************************************************************************************************
// */
// export async function createauthorg() {
//   const randomOrgCode = Math.random().toString(36).substr(2, 20);
//   const randomOrgName = Math.random().toString(36).substr(2, 20);
//   const operation = {
//     query: gql`mutation { createOrganization( organizationInput: { name: "${randomOrgName}" code: "${randomOrgCode}" status: ACTIVE organizationType: ORGANIZATION } ) { name code status organizationType users { email firstName lastName } } }
//                `
//   };
//   const org = await makePromise(execute(link, operation));
//   authemail = org.data.createOrganization.users[0].email;
//   return org;
// }
// export async function loginuser(uri) {
//   const operation = {
//     query: `
// 			  mutation {
// 				  login(input: { email: "${authemail}", password: "${authpassword}" }) {
// 					  jwt
// 				  }
// 			  }
// 		  `
//   };
//   const response = await fetch(uri, {
//     method: "POST",
//     body: JSON.stringify(operation),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   });

//   const {
//     data,
//     errors
//   } = await response.json();
//   if (errors) {
//     return errors
//   }
//   return data.login;
// }

// /*******************************************************************************************************************
// * *****************************************************************************************************************
// * *****************************************************************************************************************
// *                                                 Core APIs functions
// * *****************************************************************************************************************
// * *****************************************************************************************************************
// * *****************************************************************************************************************
// */
// export async function createneworg(name, code, type, phone, website, status) {
//   const operation = {
//     query: gql`mutation {
//                       createOrganizationRoot(input:{
//                    name:"${name}",code:"${code}",organizationType:${type},phoneNumber:"${phone}",website:"${website}",status:${status}
//                  })
//                  {
//                   id,name,code,organizationType,status,website,phoneNumber
//                    }
//               }
//            `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }

// export async function createneworg1() {
//   const randomOrgCode = Math.random().toString(36).substr(2, 20);
//   const randomOrgName = Math.random().toString(36).substr(2, 20);

//   const operation = {
//     query: gql`mutation {
//                           createOrganizationRoot(input:{
//                        name:"${randomOrgName}",status:ACTIVE,code:"${randomOrgCode}",organizationType:STORE
//                      })
//                      {
//                       id
//                        }
//                   }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create new organization without status input(which is mandatory)
// export async function createneworg2(name, add, code, type, phone, website) {
//   const operation = {
//     query: gql`mutation {
//                       createOrganizationRoot(input:{
//                    name:"${name}",address:"${add}",code:"${code}",organizationType:${type},phoneNumber:"${phone}",website:"${website}"
//                  })
//                  {
//                   id,name,code,organizationType,status,website,phoneNumber
//                    }
//               }
//            `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // with all inputs as arguements
// export async function createneworgnode(orgid, name, code, type, phone, website, status) {
//   const operation = {
//     query: gql`mutation{
//       addOrganizationNode(parentId:"${orgid}",input:{
//         name:"${name}"
//         code:"${code}"
//         status:${status}
//         phoneNumber:"${phone}"
//         website:"${website}"
//         organizationType:${type}
//       })
//       {
//         id
//         name
//         code
//         status
//         phoneNumber
//         organizationType
//       }
//     }
//            `
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // with mandatory fields only
// export async function createneworgnode1(orgid) {
//   const code = Math.random().toString(36).substr(2, 20);
//   const name = Math.random().toString(36).substr(2, 20);
//   const operation = {
//     query: gql`mutation{
//       addOrganizationNode(parentId:"${orgid}",input:{
//         name:"${name}"
//         code:"${code}"
//         status:ACTIVE
//         organizationType:ORGANIZATION
//       })
//       {
//         id
//         name
//         code
//         status
//         phoneNumber
//         organizationType
//       }
//     }
//            `
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // createapplication with all the inputs
// export async function createnewapp(orgId, name, description, auth, platform) {
//   const operation = {
//     query: gql`
//     mutation {
//       createApplication(organizationId:"${orgId}",input:{
//        name:"${name}",description:"${description}",auth_key_hooks:"${auth}"platform:"${platform}"
//      })
//      {
//       id
//       name
//      }
//    }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // createapplication without organization id
// export async function createnewapp2(name, description, auth, platform) {
//   const operation = {
//     query: gql`
//     mutation {
//       createApplication(input:{
//        name:"${name}",description:"${description}",auth_key_hooks:"${auth}"platform:"${platform}"
//      })
//      {
//       id
//       name
//      }
//    }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // createapplication with mandatory fields
// export async function createnewapp1(orgId) {
//   const randomAppName = Math.random()
//     .toString(36)
//     .substr(2, 12);
//   const operation = {
//     query: gql`
//             mutation {
//                 createApplication(organizationId:"${orgId}",input:{
//                  name:"${randomAppName}"
//                })
//                {
//                 id
//                 name
//                }
//              }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates rule with all the inputs and type as simple
// export async function createnewrule(name, description, type, status, orgid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createRule(input:{
//         name:"${name}"
//         description:"${description}"
//         type:${type}
//         status:${status}
//         ruleConfiguration:{
//           name:"value"
//         }
//         organizationId:"${orgid}"
//       })
//       {
//         id
//         ruleConfiguration
//       }
//     }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates rule with all the inputs as custom
// export async function createnewrule1(name, description, type, status, orgid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createRule(input:{
//         name:"${name}"
//         description:"${description}"
//         type:${type}
//         status:${status}
//         ruleExpression:{
//           name:"values"
//          }
//         organizationId:"${orgid}"
//       })
//       {
//         id
//         ruleExpression
//       }
//     }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates rule with no type
// export async function createnewrule2(name, description, status, orgid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createRule(input:{
//         name:"${name}"
//         description:"${description}"
//         status:${status}
//         ruleExpression:{
//           name:"values"
//          }
//         organizationId:"${orgid}"
//       })
//       {
//         id
//         ruleExpression
//       }
//     }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates rule with mandatory fields only
// export async function createnewrule3(orgid) {
//   const name = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const description = Math.random()
//     .toString(36)
//     .substr(2, 20);

//   const operation = {
//     query: gql`
//     mutation{
//       createRule(input:{
//         name:"${name}"
//         description:"${description}"
//         type:SIMPLE
//         status:ACTIVE
//         ruleConfiguration:{
//           name:"value"
//         }
//         organizationId:"${orgid}"
//       })
//       {
//         id
//         ruleExpression
//       }
//     }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates rule attribute with all the fields
// export async function createnewruleattribute(name, description, status, type, entityid, orgid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createRuleAttribute(input:{
//         attributeName:"${name}"
//         description:"${description}"
//         status:${status}
//         attributeValueType:${type}
//         ruleEntityId:"${entityid}"
//         organizationId:"${orgid}"
//       })
//       {
//         id
//         attributeValueType
//         status
//         description
//         attributeName
//       }
//     }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates rule attributes with mandatory fields only
// export async function createnewruleattribute1(entityid, orgid) {
//   const name = Math.random()
//     .toString(36)
//     .substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createRuleAttribute(input:{
//         attributeName:"${name}"
//         status:ACTIVE
//         attributeValueType:NUMBER
//         ruleEntityId:"${entityid}"
//         organizationId:"${orgid}"
//       })
//       {
//         id
//       }
//     }
//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create rule entity with all the fields
// export async function createnewruleentity(name, code, status, orgid) {
//   const operation = {
//     query: gql`
//     mutation {
//       createRuleEntity(
//         input: {
//           entityName: "${name}"
//           entityCode: "${code}"
//           status: ${status}
//           organizationId: "${orgid}"
//         }
//       ) {
//         id
//         entityName
//         entityCode
//         status
//         organization {
//           id
//         }
//       }
//     }

//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates rule entity with mandatory field
// export async function createnewruleentity1(orgid) {
//   const name = Math.random()
//     .toString(36)
//     .substr(2, 14);
//   const code = Math.random()
//     .toString(36)
//     .substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation {
//       createRuleEntity(
//         input: {
//           entityName: "${name}"
//           entityCode: "${code}"
//           status: ACTIVE
//           organizationId: "${orgid}"
//         }
//       ) {
//         id
//         entityName
//         entityCode
//         status
//         organization {
//           id
//         }
//       }
//     }

//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates business rule with all the fields
// export async function createnewbusinessrule(level, type, defval) {
//   // const name = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createBusinessRule(input:{
//         ruleLevel:${level}
//         ruleType:"${type}"
//         ruleDefaultValue:"${defval}"
//       })
//       {
//         id
//         ruleLevel
//         ruleType
//         ruleDefaultValue
//       }
//     }

//                `
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates business rules with mandotry fields
// export async function createnewbusinessrule1() {
//   const type = Math.random().toString(36).substr(2, 14);
//   const defval = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createBusinessRule(input:{
//         ruleLevel:ORGANIZATION
//         ruleType:"${type}"
//         ruleDefaultValue:"${defval}"
//       })
//       {
//         id
//         ruleLevel
//         ruleType
//         ruleDefaultValue
//       }
//     }

//                `
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create business rule details with all the fields(?????????????)
// export async function createnewbusinessruledetail(level, id, type, defval) {
//   // const name = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createBusinessRuleDetail(input:{
//         ruleLevel:${level}
//         ruleLevelId:"${id}"
//         ruleType:"${type}"
//         ruleValue:"${defval}"
//       })
//       {
//         id
//         ruleLevel
//         ruleLevelId
//         ruleValue
//         ruleType
//       }
//     }

//                `
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates business rules with business rule details with mandatory fields only
// export async function createnewbusinessruledetail1(id) {
//   // const name = Math.random().toString(36).substr(2, 14);
//   const type = Math.random().toString(36).substr(2, 14);
//   const defval = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createBusinessRuleDetail(input:{
//         ruleLevel:ORGANIZATION
//         ruleLevelId:"${id}"
//         ruleType:"${type}"
//         ruleValue:"${defval}"
//       })
//       {
//         id
//         ruleLevel
//         ruleLevelId
//         ruleValue
//         ruleType
//       }
//     }

//                `
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates customers with all the fields
// export async function createnewcustomer(orgid, fname, lname, email, phone, gender, date, exid, identifier) {
//   const operation = {
//     query: gql`
//     mutation
//                   {
//                     createCustomer(customer:{
//                       firstName:"${fname}"
//                       lastName:"${lname}"
//                       email:"${email}"
//                       phoneNumber:"${phone}"
//                       organization:"${orgid}"
//                       gender:${gender}
//                       dateOfBirth:"${date}"
//                       externalCustomerId:"${exid}"
//                       customerIdentifier:"${identifier}"

//                     })
//                     {
//                       id
//                       phoneNumber
//                       organization
//                       {
//                         id
//                       }
//                     }
//                   }

//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates customer with only the mandatory fields
// export async function createnewcustomer1(orgid) {
//   const phone = Math.floor(6000000000 + Math.random() * 4000000000);
//   const operation = {
//     query: gql`
//     mutation{
//       createCustomer(customer:{
//        phoneNumber:"${phone}"
//         organization:"${orgid}"
//       })
//       {
//         id
//         phoneNumber
//       }
//     }

//                `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates campagin with all the fields
// export async function createnewcampaign(orgid, appid, ruleid, name, startdate, enddate, type, workflowid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createCampaign(input:{
//         name:"${name}"
//         campaignType:${type}
//         triggerRule:"${ruleid}"
//         startTime:"${startdate}"
//         endTime:"${enddate}"
//         workflowId:"${workflowid}"
//         application_id:"${appid}"
//         organization_id:"${orgid}"
//       })
//       {
//         id
//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // creates campaign with only the mandatory fields(change needed with workflow things)
// export async function createnewcampaign1(name, type, appid, orgid, workflowid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createCampaign(input:{
//         name:"${name}"
//         campaignType:${type}
//         workflowId:"${workflowid}"
//         application_id:"${appid}"
//         organization_id:"${orgid}"
//      })
//       {
//           id
//       }
//               }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   // console.log(org);
//   return org;
// }
// // creates segment with all the fields
// export async function createnewsegment(orgid, appid, ruleid, name, description, type, status) {
//   const operation = {
//     query: gql`
//     mutation
//     {
//       createSegment(input:{
//         name:"${name}",
//         description:"${description}",
//         segmentType:${type},
//         organization_id:"${orgid}",
//         application_id:"${appid}",
//         rule_id:"${ruleid}",
//         status:${status}
//       })
//       {
//         id
//         name
//         segmentType
//         status
//         description
//         organization{
//           id
//         }
//         application{
//           id
//         }

//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create segment with mandatory fields
// export async function createnewsegment1(orgid, appid, ruleid) {
//   const name = Math.random().toString(36).substr(2, 20);
//   const description = Math.random().toString(36).substr(2, 20);
//   const type = Math.random().toString(36).substr(2, 20);
//   const operation = {
//     query: gql`
//     mutation
//     {
//       createSegment(input:{
//         name:"${name}",
//         description:"${description}",
//         segmentType:CUSTOM,
//         organization_id:"${orgid}",
//         application_id:"${appid}",
//         rule_id:"${ruleid}",
//         status:ACTIVE
//       })
//       {
//         id
//         name
//         segmentType
//         status
//         organization{
//           id
//         }
//         application{
//           id
//         }

//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }

// // ################################################### WORKFLOW #############################################//
// export async function createWorkflow(name, description, orgId) {
//   const operation = {
//     query: gql`mutation{ createWorkflow(input:{ name:"${name}" description:"${description}" organizationId:"${orgId}" }) { id name description } }`
//   };
//   const workflow = await makePromise(execute(link, operation));
//   return workflow;
// }

// export async function createWorkflowState(name, description, workflowId) {
//   const operation = {
//     query: gql`mutation{ createWorkflowState(input:{name:"${name}",code:1001, description:"${description}",workflowId:${workflowId}}){ id } }`
//   };
//   const workflowstate = await makePromise(execute(link, operation));
//   return workflowstate;
// }

// export async function createWorkflowProcess(name, description, workflowId) {
//   const operation = {
//     query: gql`mutation{ createWorkflowProcess(input:{name:"${name}", description:"${description}",workflowId:"${workflowId}"}){ id } }`
//   };
//   const workflowprocess = await makePromise(execute(link, operation));
//   return workflowprocess;
// }

// //// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^RULE APIs^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^////
// export async function createRuleEntity(entityName, entityCode, status, orgId) {
//   const operation = {
//     query: gql` mutation{ createRuleEntity(input:{entityName:"${entityName}",entityCode:"${entityCode}",status:${status},organizationId: "${orgId}"}){ id } }`
//   };
//   const ruleentity = await makePromise(execute(link, operation));
//   return ruleentity;
// }

// export async function createRuleAttribute(attributeName, description, status, attributeValueType, ruleEntityId, orgId) {
//   const operation = {
//     query: gql` mutation{ createRuleAttribute(input:{attributeName:"${attributeName}",description:"${description}", status:${status},attributeValueType:${attributeValueType},ruleEntityId:${ruleEntityId},organizationId:"${orgId}"}){ id } }`
//   };
//   const ruleattribute = await makePromise(execute(link, operation));
//   return ruleattribute;
// }

// export async function createRule(name, description, type, ruleConfiguration, orgId) {
//   const operation = {
//     query: gql` mutation { createRule( input: { name: "${name}" description: "${description}" type: ${type} ruleConfiguration: "${ruleConfiguration}" organizationId: "${orgId}" } ) { id } }`
//   };
//   const rule = await makePromise(execute(link, operation));
//   return rule;
// }

// export async function createCampaign(name, campaignType, workflowId, orgId, appId) {
//   const operation = {
//     query: gql`mutation { createCampaign( input: { name: "${name}" campaignType: ${campaignType} workflowId: "${workflowId}" organization_id: "${orgId}" application_id: "${appId}" } ) { id name description startTime endTime } }`
//   };
//   const campaign = await makePromise(execute(link, operation));
//   return campaign;
// }
// //// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^RULE APIs^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^////

// export async function createWorkflowProcessTransition(pickupStateId, dropStateId, workflowProcessId, ruleId, name) {
//   const operation = {
//     query: gql`mutation{ createWorkflowProcessTransition(input:{pickupStateId:${pickupStateId} dropStateId:${dropStateId} workflowProcessId:${workflowProcessId} ruleConfig:"${ruleId}" name:"${name}"}){ id } }`
//   };
//   const workflowprocesstransition = await makePromise(execute(link, operation));
//   return workflowprocesstransition;
// }

// // ################################################### WORKFLOW(mandatory) #############################################//

// // create workflow with all fields
// export async function createnewworkflow(name, orgid, desc) {
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflow(input:{
//         name:"${name}"
//         description:"${desc}"
//         organizationId:"${orgid}"
//       })
//       {
//         id
//         name
//         description
//         organization
//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create workflow with mandtory fields
// export async function createnewworkflow1(orgid) {
//   const name = Math.random().toString(36).substr(2, 14);
//   const desc = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflow(input:{
//         name:"${name}"
//         description:"${desc}"
//         organizationId:"${orgid}"
//       })
//       {
//         id
//         name
//         description

//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create workflowstate with all the fields
// export async function createnewworkflowstate(name, code, desc, workflowid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflowState(input:{
//         name:"${name}"
//         code:"${code}"
//         description:"${desc}"
//         workflowId:"${workflowid}"
//       })
//       {
//         id
//         code
//         name
//         description

//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));

//   return org;
// }
// // create workflowstate with only mandatory field
// export async function createnewworkflowstate1(name, workflowid) {
//   const code = Math.floor(600000 + Math.random() * 400000);
//   const desc = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflowState(input:{
//         name:"${name}"
//         code:${code}
//         description:"${desc}"
//         workflowId:"${workflowid}"
//       })
//       {
//         id
//        name

//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create workflowflowprocess with all the fields
// export async function createnewworkflowprocess(name, desc, workflowid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflowProcess(input:{
//         name:"${name}"
//         description:"${desc}"
//         workflowId:"${workflowid}"
//       })
//       {
//         id
//         name
//         description
//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create workflowprocess with only mandatory fields
// export async function createnewworkflowprocess1(name, workflowid) {
//   const desc = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflowProcess(input:{
//         name:"${name}"
//         description:"${desc}"
//         workflowId:"${workflowid}"
//       })
//       {
//         id
//         name
//         description
//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create workflowprocesstransition with all the process
// export async function createnewworkflowprocesstranistion(name, pstate, dstate, rule, workflowprocessid) {
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflowProcessTransition(input:{
//         name:"${name}"
//         pickupStateId:"${pstate}"
//         dropStateId:"${dstate}"
//         ruleConfig:"${rule}"
//         workflowProcessId:"${workflowprocessid}"
//       })
//       {
//         id
//         name
//         ruleConfig
//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create workflowprocesstranistion with mandatory fields(??????????)
// export async function createnewworkflowprocesstranistion1(name, pstate, dstate, workflowprocessid) {
//   const rule = Math.random().toString(36).substr(2, 14);
//   const operation = {
//     query: gql`
//     mutation{
//       createWorkflowProcessTransition(input:{
//         name:"${name}"
//         pickupStateId:"${pstate}"
//         dropStateId:"${dstate}"
//         ruleConfig:"${rule}"
//         workflowProcessId:"${workflowprocessid}"
//       })
//       {
//         id
//         name
//         ruleConfig
//       }
//     }
// `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // query action type
// export async function getnewactiontype() {
//   const operation = {
//     query: gql`
// 			query {
// 				actiontypes {
// 					id
// 					type
// 					status
// 				}
// 			}
// 		`,
//   };

//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // query action definition
// export async function getnewactiondefinition() {
//   const operation = {
//     query: gql`
// 			query {
// 				actionDefinitions {
// 					id
// 				}
// 			}
// 		`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create actions with all the fields
// export async function createnewaction(orgid, appid, actdefid, result, message, name) {
//   const operation = {
//     query: gql`mutation{
//               createAction(input:{
//               actionDefinitionId:"${actdefid}"
//                 organization_id:"${orgid}"
//                 application_id:"${appid}"
//                 actionData:{
//                   hello:"world"
//                 }
//                 actionResult:${result}
//                 message:"${message}"
//                 name:"${name}"
//               })
//                 {
//                   id
//                   actionDefinition{
//                     id
//                   }
//                   organization{
//                       id
//                   }
//                   application{
//                     id
//                   }
//                   actionData
//                   actionResult
//                   actionMessage
//                 }
//               }
//        `,
//   };

//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create action  with mandotry fields
// export async function createnewaction1(orgid, appid, actdefid) {
//   const message = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const operation = {
//     query: gql`mutation{
//       createAction(input:{
//         actionDefinitionId:"${actdefid}"
//         organization_id:"${orgid}"
//         application_id:"${appid}"
//         actionData:{
//         }
//         message:"${message}"
//       })
//       {
//         id
//       }
//     }
//        `,
//   };

//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create audience with all the fields
// export async function createnewaudience(campid, segid, orgid, appid, status) {
//   const operation = {
//     query: gql`mutation {
//       createAudience(
//         input: {
//           campaign_id: "${campid}"
//           segment_id: "${segid}"
//           organization_id: "${orgid}"
//           application_id: "${appid}"
//           status: ${status}
//         }
//       ) {
//         id
//         status
//         application {
//           id
//         }
//         campaign {
//           id
//         }
//         segment {
//           id
//         }
//         organization {
//           id
//         }
//       }
//     }

//        `,
//   };

//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create audience member with all the fields
// export async function createnewaudiencemember(audid, custid, status) {
//   const operation = {
//     query: gql`mutation{
//       createAudienceMember(input:{
//         audience_id:"${audid}"
//         customer_id:"${custid}"
//         status:${status}
//       })
//       {
//         id
//         audience{
//           id
//         }
//         customer{
//           id
//         }
//         status
//       }
//     }
//        `,
//   };

//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // add new entity extend with all the fields
// export async function addnewentityextend(orgid, type, table) {
//   const operation = {
//     query: gql`mutation{
//               addEntityExtend(organization_id:"${orgid}",entity_name:${type},description:"${table}")
//             {
//               id
//               entityName
//               description
//             }
//             }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // add new entity extend with mandatory field
// export async function addnewentityextend1(orgid) {
//   const type = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const table = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const operation = {
//     query: gql`mutation{
//               addEntityExtend(org_id:"${orgid}",base_entity_type:${type},base_entity_table_name:"${table}")
//             {
//               customers{
//                 id
//               }
//               id
//               baseEntityType
//             }
//             }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // add entity extend field with all the fields
// export async function addnewentityextendfield(entityid, slug, label, help, type, required, choice, def, validation) {
//   const operation = {
//     query: gql`mutation{
//               addEntityExtendField(entity_extend_id:"${entityid}",slug:"${slug}",label:"${label}",help:"${help}",type:${type},required:${required},choices:"${choice}",defaultValue:"${def}",validator:"${validation}",)
//               {
//                 id
//                 slug
//                 type
//               }
//             }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // add entity extend field with mandatory fields
// export async function addnewentityextendfield1(entityid, type) {
//   const slug = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const operation = {
//     query: gql`mutation{
//       addEntityExtendField(entity_extend_id:"${entityid}",slug:"${slug}",type:${type})
//       {
//         id
//       }
//     }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create metric filter with all the fields
// export async function createnewmetricfilter(key, name, type) {
//   const operation = {
//     query: gql`mutation{
//               createMetricFilter(input:{
//                 key:"${key}",
//                 name:"${name}",
//                 type:${type}
//               })
//               {
//                  id
//                  key
//                  name
//                  type
//               }
//             }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create metric filter with mandatory fields
// export async function createnewmetricfilter1(type) {
//   const key = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const name = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const operation = {
//     query: gql`mutation{
//               createMetricFilter(input:{
//                 key:"${key}",
//                 name:"${name}",
//                 type:${type}
//               })
//               {
//                  id
//                  key
//                  name
//                  type
//               }
//             }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create metric with all the fields
// export async function createnewmetric(name, description, query, type, filterkey, orgid) {
//   const operation = {
//     query: gql`mutation {
//               createMetric(
//                 input: {
//                   name: "${name}"
//                   description: "${description}"
//                   query: "${query}"
//                   type: ${type}
//                   filters: "${filterkey}"
//                   organization_id: "${orgid}"
//                 }
//               ) {
//                 id
//                 organization {
//                   id
//                 }
//                 filters {
//                   id
//                 }
//                 name
//                 query
//                 type
//                 description
//               }
//             }

//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create metric filter with only the mandatory
// export async function createnewmetric1(type, filterkey, orgid) {
//   const name = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const description = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const query = Math.random()
//     .toString(36)
//     .substr(2, 20);
//   const operation = {
//     query: gql`mutation {
//               createMetric(
//                 input: {
//                   name: "${name}"
//                   description: "${description}"
//                   query: "${query}"
//                   type: ${type}
//                   filters: "${filterkey}"
//                   organization_id: "${orgid}"
//                 }
//               ) {
//                 id
//                 organization {
//                   id
//                 }
//                 filters {
//                   id
//                 }
//                 name
//                 query
//                 type
//                 description
//               }
//             }

//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // crating all the action types
// // actiontype1
// export async function createnewactiontype() {
//   const operation = {
//     query: gql`mutation{
//       createActionType(input:{
//         type:NOTIFICATION
//         status:ACTIVE
//       })
//       {
//         id
//       }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // actiontype2
// export async function createnewactiontype1() {
//   const operation = {
//     query: gql`mutation{
//       createActionType(input:{
//         type:EXTERNAL_API
//         status:ACTIVE
//       })
//       {
//         id
//       }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // actiontype3
// export async function createnewactiontype2() {
//   const operation = {
//     query: gql`mutation{
//       createActionType(input:{
//         type:CREATE_CUSTOMER_FEEDBACK_FORM
//         status:ACTIVE
//       })
//       {
//         id
//       }
//          `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // createallactiondefinitions
// // actiondef1
// export async function createnewactiondefinition(format, name) {
//   const operation = {
//     query: gql`mutation{
//         createActionDefinition(input:{
//           actionTypeId:"1",
//           format:${format},
//           schema:{demo:"test"}
//           status:ACTIVE,
//           name:"${name}"
//         })
//           {
//             id
//             format
//             schema
//             status
//           }
//         }
//  `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // actiondef2
// export async function createnewactiondefinition1(format, name) {
//   const operation = {
//     query: gql`mutation{
//         createActionDefinition(input:{
//           actionTypeId:"2",
//           format:${format},
//           schema:{demo:"test"}
//           status:ACTIVE,
//           name:"${name}"
//         })
//           {
//             id
//             format
//             schema
//             status
//           }
//         }
//  `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // actiondef3
// export async function createnewactiondefinition2(format, name) {
//   const operation = {
//     query: gql`mutation{
//         createActionDefinition(input:{
//           actionTypeId:"3",
//           format:${format},
//           schema:{demo:"test"}
//           status:ACTIVE,
//           name:"${name}"
//         })
//           {
//             id
//             format
//             schema
//             status
//           }
//         }
//  `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }

// // creating all the webhooks
// // webhook1
// export async function createnewwebhook() {
//   const operation = {
//     query: gql`
// 			mutation {
// 				createWebhookEventType(input: { event: "create.customer", status: ACTIVE }) {
// 					id
// 				}
// 			}
// 		`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }

// // webhook2
// export async function createnewwebhook1() {
//   const operation = {
//     query: gql`
// 			mutation {
// 				createWebhookEventType(input: { event: "nearx.firehose", status: ACTIVE }) {
// 					id
// 				}
// 			}
// 		`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create user with all the fields
// export async function createnewuser1(email, fname, lname, status, password) {
//   const operation = {
//     query: gql`
// 		mutation{
//       createUser(input:{
//         email:"${email}"
//         firstName:"${fname}"
//         lastName:"${lname}"
//         status:${status}
//         password:"${password}"
//       })
//       {
//         id
//         email
//         firstName
//         lastName
//         status
//         organization{
//           id
//         }
//         createdCampaigns{
//           id
//         }
//       }
//     }
// 		`
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// // create user with mandatory fields
// export async function createnewuser2() {
//   const randomemail = Math.random().toString(36).substr(2, 20);
//   const randompassword = Math.random().toString(36).substr(2, 20);
//   const operation = {
//     query: gql`
// 			mutation {
// 				createUser(
// 					input: { email: "${randomemail}", password: "${randompassword}" }
// 				) {
// 					id
// 				}
// 			}
// 		`
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }

// /*******************************************************************************************************************
//  * *****************************************************************************************************************
//  * *****************************************************************************************************************
//  *                                                 Tokken handling
//  * *****************************************************************************************************************
//  * *****************************************************************************************************************
//  * *****************************************************************************************************************
//  */

// // export async function createnewuser() {
// //   const operation = {
// //     query: gql`
// // 			mutation {
// // 				createUser(
// // 					input: { email: "${randomemail}", password: "${randompassword}" }
// // 				) {
// // 					id
// // 				}
// // 			}
// // 		`,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }

// // // export async function loginuser(uri) {
// // //   const operation = {
// // //     query: `
// // // 			  mutation {
// // // 				  login(input: { email: "${randomemail}", password: "${randompassword}" }) {
// // // 					  jwt
// // // 				  }
// // // 			  }
// // // 		  `
// // //   };
// // //   const response = await fetch(uri, {
// // //     method: "POST",
// // //     body: JSON.stringify(operation),
// // //     headers: {
// // //       "Content-Type": "application/json"
// // //     }
// // //   });
// // //   const {
// // //     data,
// // //     errors
// // //   } = await response.json();
// // //   if (errors) {
// // //     return errors
// // //   }
// // //   return data.login;
// // // }

// // export async function addgroup(orgid, name) {
// //   const operation = {
// //     query: gql`mutation{
// //       addGroupToOrganization(organizationId:"${orgid}",group:{
// //         name:"${name}"
// //       })
// //       {
// //         id
// //       }
// //     } `,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // export async function linkgroup(orgid, grpid) {
// //   const operation = {
// //     query: gql`mutation{linkGroupToOrganization(organizationId:"${orgid}",groupId:"${grpid}")
// //     {
// //       id
// //     }
// //     } `,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // //add admin to group
// // ///add policies
// // //add user to group
// // export async function addrole(grpid, name, description) {
// //   const operation = {
// //     query: gql`mutation{
// //       addRole(groupId:"${grpid}",input:{
// //         name:"${name}"
// //         description:"${description}"
// //       })
// //       {
// //         id
// //       }
// //     } `,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // export async function linkuserorg(orgid, userid) {
// //   const operation = {
// //     query: gql`mutation{
// //       linkUserToOrganization(organizationId:"${orgid}",userId:"${userid}")
// //     {
// //       id
// //     }
// //     }`,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // export async function linkuser(grpid, userid) {
// //   const operation = {
// //     query: gql`mutation{
// //       linkUserToGroup(groupId:"${grpid}",userId:"${userid}")
// //       {
// //         id
// //       }
// //     } `,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // // export async function linkuser(grpid, userid) {
// // //   const operation = {
// // //     query: gql`mutation{
// // //       linkUserToGroup(groupId:"${grpid}",userId:"${userid}")
// // //       {
// // //         id
// // //       }
// // //     } `
// // //   };
// // //   return operation;
// // // }
// // export async function addpolicyorg(roleid) {
// //   const operation = {
// //     query: gql`mutation{
// //       addPolicyToRole(roleId:"${roleid}",input:{
// //         effect:ALLOW
// //         resource:ORGANIZATION
// //         permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
// //       })
// //       {
// //         id
// //       }
// //     }`,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // export async function addpolicyuser(roleid) {
// //   const operation = {
// //     query: gql`mutation{
// //       addPolicyToRole(roleId:"${roleid}",input:{
// //         effect:ALLOW,
// //         resource:USER
// //       permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
// //       })
// //       {
// //         id
// //       }
// //     }`,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // export async function addpolicyapp(roleid) {
// //   const operation = {
// //     query: gql`mutation{
// //       addPolicyToRole(roleId:"${roleid}",input:{
// //         effect:ALLOW
// //         resource:ORGANIZATION
// //         permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
// //       })
// //       {
// //         id
// //       }
// //     }
// //     `,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // export async function addpolicygrp(roleid) {
// //   const operation = {
// //     query: gql`mutation{
// //       addPolicyToRole(roleId:"${roleid}",input:{
// //         effect:ALLOW,
// //         resource:GROUP
// //       permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
// //       })
// //       {
// //         id
// //       }
// //     }`,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// // export async function addpolicystore(roleid) {
// //   const operation = {
// //     query: gql`mutation{
// //       addPolicyToRole(roleId:"${roleid}",input:{
// //         effect:ALLOW,
// //         resource:STORE
// //       permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
// //       })
// //       {
// //         id
// //       }
// //     }`,
// //   };
// //   const org = await makePromise(execute(link, operation));
// //   return org;
// // }
// export async function addpolicyorg(roleid) {
//   const operation = {
//     query: gql`mutation{
//       addPolicyToRole(roleId:"${roleid}",input:{
//         effect:ALLOW
//         resource:ORGANIZATION
//         permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
//       })
//       {
//         id
//       }
//     }`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// export async function addpolicyuser(roleid) {
//   const operation = {
//     query: gql`mutation{
//       addPolicyToRole(roleId:"${roleid}",input:{
//         effect:ALLOW,
//         resource:USER
//       permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
//       })
//       {
//         id
//       }
//     }`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// export async function addpolicyapp(roleid) {
//   const operation = {
//     query: gql`mutation{
//       addPolicyToRole(roleId:"${roleid}",input:{
//         effect:ALLOW
//         resource:ORGANIZATION
//         permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
//       })
//       {
//         id
//       }
//     }
//     `,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// export async function addpolicygrp(roleid) {
//   const operation = {
//     query: gql`mutation{
//       addPolicyToRole(roleId:"${roleid}",input:{
//         effect:ALLOW,
//         resource:GROUP
//       permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
//       })
//       {
//         id
//       }
//     }`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// export async function addpolicystore(roleid) {
//   const operation = {
//     query: gql`mutation{
//       addPolicyToRole(roleId:"${roleid}",input:{
//         effect:ALLOW,
//         resource:STORE
//       permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
//       })
//       {
//         id
//       }
//     }`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// export async function addpolicycatalog(roleid) {
//   const operation = {
//     query: gql`mutation{
//       addPolicyToRole(roleId:"${roleid}",input:{
//         effect:ALLOW,
//         resource:CATALOG
//       permissions:[CREATE,READ,UPDATE,DELETE,SHARE]
//       })
//       {
//         id
//       }
//     }`,
//   };
//   const org = await makePromise(execute(link, operation));
//   return org;
// }
// export async function createNewCatalog(orgId, catName, catDesc) {
//   const operation = {
//     query: gql`
//     mutation {
//       createCatalog(input: {
//         name: "${catName}",
//         description: "${catDesc}",
//         organizationId: "${orgId}",
//         usage: {
//           purpose: "IN_APP_ORDER"
//         }
//       }) {
//         id
//         name
//         description
//         organization {
//           id
//           name
//         }
//         usage {
//           purpose
//         }
//       }
//     }
// 		`,
//   };
//   const cat = await makePromise(execute(link, operation));
//   return cat;
// }
