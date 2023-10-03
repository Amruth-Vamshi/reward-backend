// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { addCatchUndefinedToSchema } from "graphql-tools";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { async } from "q";
// import { AdvancedConsoleLogger } from "typeorm";
// import { link } from "../../../utils/testUtils";
// import { matchUriRE } from "../../../utils/regex";
// import {
// 	addgroup,
// 	addpolicycatalog,
// 	addpolicyorg,
// 	addrole,
// 	createNewCatalog,
// 	createneworg1,
// 	createnewuser,
// 	linkuser,
// 	linkuserorg,
// } from "../../../utils/functions";
// import {
// 	randomCatalogDescription,
// 	randomCatalogName,
// 	randomGroupName,
// 	randomRoleDescription,
// 	randomRoleName,
// } from "../../../utils/index";
// let orgId;

// describe("createCatalog", () => {
// 	test("createCatalog with randomValues", async () => {
// 		const catalog = await createNewCatalog(orgId, randomCatalogName, randomCatalogDescription);
// 		expect(catalog.data.createCatalog.name).toBeTruthy();
// 	});
// 	// test("createApplication with randomValues and name as empty", async () => {
// 	// 	const AppName = "";
// 	// 	const application = await createnewapp(orgId, AppName, randomAppDescription, randomAppAuth, randomAppPlatform);
// 	// 	expect(application.errors[0].validationErrors[0].message).toEqual("name cannot be null");
// 	// });
// 	// test("createApplication with randomValues and repeating the name of the applcation", async () => {
// 	// 	const application = await createnewapp(orgId, randomAppName, randomAppDescription, randomAppAuth, randomAppPlatform);
// 	// 	expect(application.errors[0].validationErrors[0].message).toEqual("Application name already exists");
// 	// });
// });

// // beforeAll(async () => {
// // 	const org = await createneworg1();
// // 	orgId = org.data.createOrganizationRoot.id;
// // });
// beforeAll(async () => {
// 	let userId, orgid, grpId, roleId;
// 	let linkGrpId;
// 	let linkUserId;
// 	const user = await createnewuser();
// 	userId = user.data.createUser.id;
// 	const org = await createneworg1();
// 	orgid = org.data.createOrganizationRoot.id;
// 	// const grp = await addgroup(orgid, randomGroupName);
// 	// grpId = grp.data.addGroupToOrganization.id;
// 	// const lgrp = await linkgroup(orgid, grpId);
// 	// console.log(lgrp);
// 	// linkGrpId = lgrp.data.linkGroupToOrganization.id;
// 	console.log("~~~~~~~ Creating Role");
// 	const role = await addrole(grpId, randomRoleName, randomRoleDescription);
// 	roleId = role.data.addRole.id;
// 	console.log("~~~~~~~ Creating Role");
// 	const luserorg = await linkuserorg(orgid, userId);
// 	console.log("~~~~~~~ Creating Role");
// 	const luser = await linkuser(grpId, userId);
// 	linkUserId = luser.data.linkUserToGroup.id;
// 	console.log("~~~~~~~ Creating Org Policy");
// 	const porg = await addpolicyorg(roleId);
// 	console.log("~~~~~~~ Creating Catalog Policy");
// 	const pcatalog = await addpolicycatalog(roleId);
// });
// // beforeAll(async () => {
// //     ;
// // })
// // beforeAll(async () => {

// //     // beforeAll(async () => {

// //     // })
// //     beforeAll(async () => {

// //     })
// //     beforeAll(async () => {

// //     })
// //     beforeAll(async () => {

// //     })
// //     beforeAll(async () => {

// //     })
// // // beforeAll(async () => {
// // //     const pgrp = await addpolicygrp(roleId);
// // // })
// // // beforeAll(async () => {
// // //     const papp = await addpolicyapp(roleId);
// // // })
// // // beforeAll(async () => {
// // //     const puser = await addpolicyuser(roleId);
// // // })
// // // beforeAll(async () => {
// // //     const pstore = await addpolicystore(roleId);
// // // })
