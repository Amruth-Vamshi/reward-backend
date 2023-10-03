// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { link } from "../../../utils/testUtils";
// import { createnewapp1, createneworg1 } from "../../../utils/functions";
// let orgId;
// describe("Query Applications", () => {
// 	test("To display all the applications", async () => {
// 		const operation = {
// 			query: gql`
// 				query {
// 					applications {
// 						id
// 						name
// 						description
// 						auth_key_hooks
// 						platform
// 						organization {
// 							id
// 						}
// 					}
// 				}
// 			`,
// 		};
// 		const Queryapplications = await makePromise(execute(link, operation));
// 	});
// });
// describe("Query Application", () => {
// 	let appId;
// 	beforeEach(async () => {
// 		const app = await createnewapp1(orgId);
// 		appId = app.data.createApplication.id;
// 	});
// 	test("Test to Query Specific Applications", async () => {
// 		// Query Specific Organization
// 		const operation = {
// 			query: gql`query{
//               application(id:"${appId}")
//               {
//                 id
//                 name
//                 description
//                 auth_key_hooks
//                 platform
//                 organization{
//                   id
//                 }
//               }
//             }
//               `,
// 		};
// 		const Queryapplication = await makePromise(execute(link, operation));
// 	});
// 	test("Test to Query Specific Application with invalid application id", async () => {
// 		// Query Specific Organization
// 		const appid = "7897";
// 		const operation = {
// 			query: gql`query{
//               application(id:"${appid}")
//               {
//                 id
//                 name
//                 description
//                 auth_key_hooks
//                 platform
//                 organization{
//                   id
//                 }
//               }
//             }
//               `,
// 		};
// 		const Queryapplication = await makePromise(execute(link, operation));
// 		console.log(Queryapplication.errors[0].message).toEqual("Invalid Application ID");
// 	});
// });
// beforeAll(async () => {
// 	const org = await createneworg1();
// 	orgId = org.data.createOrganizationRoot.id;
// });
