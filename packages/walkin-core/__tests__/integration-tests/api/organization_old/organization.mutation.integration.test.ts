// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import {
// 	ORGANIZATION_TYPES,
// 	STATUS
// } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import {
// 	addgroup,
// 	createauthorg,
// 	createneworg,
// 	createneworg1,
// 	createneworg2,
// 	createneworgnode,
// 	createnewuser,
// 	linkgroup,
// 	loginuser,

// } from "../../utils/functions";
// import {

// 	orgt,
// 	randomOrgCode,
// 	randomOrgNAddress,
// 	randomOrgName,
// 	randomOrgNCode,
// 	randomOrgNName,
// 	randomOrgNPhone,
// 	randomOrgNT,
// 	randomOrgNWebsite,
// 	randomOrgPhone,
// 	randomOrgT,
// 	randomOrgWebsite,
// 	statusopt,
// 	UpdateOrgAddress,
// 	UpdateOrgCode,
// 	UpdateOrgName,
// 	UpdateOrgPhone,
// 	UpdateOrgStatus,
// 	UpdateOrgT,
// 	UpdateOrgWebsite
// } from "../../utils/index";
// jest.setTimeout(120000);

// // #######################################################################################################################//

// describe("Create Organization", () => {
// 	test("To test the creation of organization using the random values and status as ACTIVE", async () => {
// 		const status = STATUS.ACTIVE;
// 		const org = await createneworg(randomOrgName, randomOrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);

// 		// positive tests for the create organization root API
// 		expect(org.data.createOrganizationRoot.name).toBeTruthy();
// 		expect(org.data.createOrganizationRoot.id).toBeTruthy();
// 		expect(org.data.createOrganizationRoot.status).toBeTruthy();
// 		expect(org.data.createOrganizationRoot.organizationType).toBeTruthy();
// 		expect(orgt).toContain(org.data.createOrganizationRoot.organizationType);
// 		expect(statusopt).toContain(org.data.createOrganizationRoot.status);
// 		expect(matchUriRE.test(org.data.createOrganizationRoot.phoneNumber)).toBe(
// 			true
// 		);
// 	}, 60000);

// 	// ###################################################################################################################//

// 	// describe("Create OrganizationRoot check", () => {
// 	// 	test("To test the creation of organization using the random values and status as ACTIVE", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const org = await createneworg(randomOrgName, randomOrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);

// 	// 		//positive tests for the create organization root API
// 	// 		expect(org.data.createOrganizationRoot.name).toBeTruthy();
// 	// 		expect(org.data.createOrganizationRoot.id).toBeTruthy();
// 	// 		expect(org.data.createOrganizationRoot.status).toBeTruthy();
// 	// 		expect(org.data.createOrganizationRoot.organizationType).toBeTruthy();
// 	// 		expect(orgt).toContain(org.data.createOrganizationRoot.organizationType);
// 	// 		expect(statusopt).toContain(org.data.createOrganizationRoot.status);
// 	// 		expect(matchUriRE.test(org.data.createOrganizationRoot.phoneNumber)).toBe(
// 	// 			true
// 	// 		);
// 	// 	}, 60000);
// 	// 	test("To test the creation of organization using the random values and status as INACTIVE", async () => {
// 	// 		const status = STATUS.INACTIVE;
// 	// 		const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 		const org = await createneworg(OrgName, OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
// 	// 		expect(org.data.createOrganizationRoot.id).toBeTruthy();
// 	// 	}, 60000);
// 	// 	test("To test the creation of organization using the random values and status as ACTIVE and name as null", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const OrgName = "";
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 9);
// 	// 		const org = await createneworg(OrgName, OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
// 	// 		expect(org.errors[0].validationErrors[0].message[0].message).toEqual("name cannot be null");
// 	// 	}, 60000);
// 	// 	test("To test the creation of organization using the random values and status as ACTIVE and code as null", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const OrgName = Math.random().toString(36).substr(2, 9);
// 	// 		const OrgCode = "";
// 	// 		const org = await createneworg(OrgName, OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
// 	// 		expect(org.errors[0].validationErrors[0].message[0].message).toEqual("code cannot be null");
// 	// 	}, 60000);
// 	// 	test("To test the creation of organization using the random values and status as ACTIVE and same orgcode as the which already exists", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const OrgName = Math.random().toString(36).substr(2, 9);
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 9);
// 	// 		const org = await createneworg(OrgName, randomOrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
// 	// 		expect(org.errors[0].validationErrors[0].message).toEqual("Organization code already exists");
// 	// 	}, 60000);
// 	// 	test("To test the creation of organization using the random values and status as ACTIVE and invalid phone number(11 digits)", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const OrgPhone = "78746282401";
// 	// 		const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 		const org = await createneworg(OrgName, OrgCode, randomOrgT, OrgPhone, randomOrgWebsite, status);
// 	// 		expect(org.errors[0].validationErrors[0].message[0].message).toEqual("Phone number is not valid");
// 	// 	}, 60000);
// 	// 	test("To test the creation of organization using the random values and status as ACTIVE and invalid phone number(9 digits)", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const OrgPhone = "787462824"
// 	// 		const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 		const org = await createneworg(OrgName, OrgCode, randomOrgT, OrgPhone, randomOrgWebsite, status);
// 	// 		expect(org.errors[0].validationErrors[0].message[0].message).toEqual("Phone number is not valid");
// 	// 	}, 60000);
// 	// 	// test("To test the creation of organization using the random values and status as null", async () => {
// 	// 	// 	const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const org = await createneworg2(OrgName, , OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite);
// 	// 	// 	console.log(org);
// 	// 	// }, 6);
// 	// 	// test("To test the creation of organization using the random values and status as UNDEFINED value", async () => {
// 	// 	// 	const status = "HELLO";
// 	// 	// 	const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const org = await createneworg(OrgName, , OrgCode, randomOrgT, randomOrgPhone, randomOrgWebsite, status);
// 	// 	// 	//positive tests for the create organization root API
// 	// 	// 	console.log(org);
// 	// 	// 	expect(org.data).toBeFalsy();
// 	// 	// }, 6);
// 	// 	// test("To test the creation of organization using the random values and status as ACTIVE and organization type as INVALID", async () => {
// 	// 	// 	const status = "ACTIVE";
// 	// 	// 	const OrgT = "INVALID";
// 	// 	// 	const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const org = await createneworg(OrgName, , OrgCode, OrgT, randomOrgPhone, randomOrgWebsite, status);
// 	// 	// 	//positive tests for the create organization root API;
// 	// 	// 	console.log(org);
// 	// 	// 	//console.log(org.errors[0].validationErrors[0].message[0].message);
// 	// 	// 	//expect(org.errors[0].validationErrors[0].message[0].message).toEqual("Phone number is not valid");
// 	// 	// }, 60000);
// 	// });
// 	// describe("Add organization node", () => {
// 	// 	let orgId;
// 	// 	beforeAll(async () => {
// 	// 		const org = await createneworg1();
// 	// 		orgId = org.data.createOrganizationRoot.id;
// 	// 	})
// 	// 	test("add organization Node with random values", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const orgnode = await createneworgnode(orgId, randomOrgNName, randomOrgNCode, randomOrgNT, randomOrgNPhone, randomOrgNWebsite, status);
// 	// 		expect(orgnode.data.addOrganizationCode.status).toEqual(STATUS.ACTIVE);
// 	// 		//console.log('')
// 	// 	}, 60000);
// 	// });
// 	// // describe("Add group to organization", () => {
// 	// // 	let orgId;
// 	// // 	beforeAll(async () => {
// 	// // 		const org = await createneworg1();
// 	// // 		orgId = org.data.createOrganizationRoot.id;
// 	// // 	})
// 	// // 	test("add group to organization", async () => {
// 	// // 		const name = Math.random().toString(36).substr(2, 9);
// 	// // 		const group = await addgroup(orgId, name);
// 	// // 	}, 60000);
// 	// // });
// 	// // describe("link group to organization", () => {
// 	// // 	let orgId;
// 	// // 	let groupId;
// 	// // 	beforeAll(async () => {
// 	// // 		const org = await createneworg1();
// 	// // 		orgId = org.data.createOrganizationRoot.id;
// 	// // 		const name = Math.random().toString(36).substr(2, 9);
// 	// // 		const group = await addgroup(orgId, name);
// 	// // 		groupId = group.data.addGroupToOrganization.id;
// 	// // 	})
// 	// // 	test("link group to organization", async () => {
// 	// // 		const name = Math.random().toString(36).substr(2, 9);
// 	// // 		const group = await linkgroup(orgId, groupId);
// 	// // 		console.log(group);
// 	// // 	}, 60000);
// 	// // });
// 	// describe("UpdateOrganization", () => {
// 	// 	let orgId;
// 	// 	beforeEach(async () => {
// 	// 		const org = await createneworg1();
// 	// 		orgId = org.data.createOrganizationRoot.id;
// 	// 	});

// 	// 	test("To test updateOrganization using random values", async () => {
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const operation = {
// 	// 			query: gql`mutation {
// 	//                       updateOrganization(
// 	//                         organization: {
// 	//                           id: "${orgId}"
// 	//                           name: "${UpdateOrgName}"
// 	//                           code: "${UpdateOrgCode}"
// 	//                           phoneNumber: "${UpdateOrgPhone}"
// 	//                           website: "${UpdateOrgWebsite}"
// 	//                           organizationType:${UpdateOrgT}
// 	//                           status: "${status}"
// 	//                         }
// 	//                       ) {
// 	//                         id
// 	//                         name
// 	//                         code
// 	//                         status
// 	//                         phoneNumber
// 	//                         organizationType
// 	//                       }
// 	//                     }
// 	//                    `
// 	// 		};

// 	// 		const organizationUpdate = await makePromise(execute(link, operation));
// 	// 		//positive tests for the create organization root API
// 	// 		expect(organizationUpdate.data.updateOrganization.name).toBeTruthy();
// 	// 		expect(organizationUpdate.data.updateOrganization.id).toBeTruthy();
// 	// 		expect(organizationUpdate.data.updateOrganization.status).toBeTruthy();
// 	// 		expect(organizationUpdate.data.updateOrganization.organizationType).toBeTruthy();
// 	// 		expect(orgt).toContain(organizationUpdate.data.updateOrganization.organizationType);
// 	// 		expect(statusopt).toContain(organizationUpdate.data.updateOrganization.status);
// 	// 		expect(matchUriRE.test(organizationUpdate.data.updateOrganization.phoneNumber)).toBe(true);
// 	// 	});
// 	// 	test("To test updateOrganization using random values and org code as invalid", async () => {
// 	// 		const orgid = "helloworld";
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const operation = {
// 	// 			query: gql`mutation {
// 	// 				  updateOrganization(
// 	// 					organization: {
// 	// 					  id: "${orgid}"
// 	// 					  name: "${UpdateOrgName}"
// 	// 					  code: "${UpdateOrgCode}"
// 	// 					  phoneNumber: "${UpdateOrgPhone}"
// 	// 					  website: "${UpdateOrgWebsite}"
// 	// 					  organizationType:${UpdateOrgT}
// 	// 					  status:"${status}"
// 	// 					}
// 	// 				  ) {
// 	// 					id
// 	// 					name
// 	// 					code
// 	// 					status
// 	// 					phoneNumber
// 	// 					organizationType
// 	// 				  }
// 	// 				}
// 	// 			   `
// 	// 		};

// 	// 		const organizationUpdate = await makePromise(execute(link, operation));
// 	// 		expect(organizationUpdate.errors[0].validationErrors[0].message).toEqual("Organization not found");
// 	// 	});
// 	// 	test("To test updateOrganization using random values and code as empty", async () => {
// 	// 		const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const OrgCode = "";
// 	// 		const operation = {
// 	// 			query: gql`mutation {
// 	// 				  updateOrganization(
// 	// 					organization: {
// 	// 					  id: "${orgId}"
// 	// 					  name: "${OrgName}"
// 	// 					  code: "${OrgCode}"
// 	// 					  phoneNumber: "${UpdateOrgPhone}"
// 	// 					  website: "${UpdateOrgWebsite}"
// 	// 					  organizationType:${UpdateOrgT}
// 	// 					  status:"${status}"
// 	// 					}
// 	// 				  ) {
// 	// 					id
// 	// 					name
// 	// 					code
// 	// 					status
// 	// 					phoneNumber
// 	// 					organizationType
// 	// 				  }
// 	// 				}
// 	// 			   `
// 	// 		};

// 	// 		const organizationUpdate = await makePromise(execute(link, operation));
// 	// 		expect(organizationUpdate.errors[0].validationErrors[0].message[0].message).toEqual("code cannot be null");
// 	// 	});
// 	// 	test("To test updateOrganization using random values and phone number to 9 digits", async () => {
// 	// 		const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgPhone = "787462824";
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const operation = {
// 	// 			query: gql`mutation {
// 	// 				  updateOrganization(
// 	// 					organization: {
// 	// 					  id: "${orgId}"
// 	// 					  name: "${OrgName}"

// 	// 					  code: "${OrgCode}"
// 	// 					  phoneNumber: "${OrgPhone}"
// 	// 					  website: "${UpdateOrgWebsite}"
// 	// 					  organizationType:${UpdateOrgT}
// 	// 					  status: "${status}"
// 	// 					}
// 	// 				  ) {
// 	// 					id
// 	// 					name

// 	// 					code
// 	// 					status
// 	// 					phoneNumber
// 	// 					organizationType
// 	// 				  }
// 	// 				}
// 	// 			   `
// 	// 		};

// 	// 		const organizationUpdate = await makePromise(execute(link, operation));
// 	// 		expect(organizationUpdate.errors[0].validationErrors[0].message[0].message).toEqual("Phone number is not valid");
// 	// 	});
// 	// 	test("To test updateOrganization using random values and phone number to 11 digits", async () => {
// 	// 		const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgPhone = "78746282401";
// 	// 		const status = STATUS.ACTIVE;
// 	// 		const operation = {
// 	// 			query: gql`mutation {
// 	// 				  updateOrganization(
// 	// 					organization: {
// 	// 					  id: "${orgId}"
// 	// 					  name: "${OrgName}"

// 	// 					  code: "${OrgCode}"
// 	// 					  phoneNumber: "${OrgPhone}"
// 	// 					  website: "${UpdateOrgWebsite}"
// 	// 					  organizationType:${UpdateOrgT}
// 	// 					  status:"${status}"
// 	// 					}
// 	// 				  ) {
// 	// 					id
// 	// 					name

// 	// 					code
// 	// 					status
// 	// 					phoneNumber
// 	// 					organizationType
// 	// 				  }
// 	// 				}
// 	// 			   `
// 	// 		};

// 	// 		const organizationUpdate = await makePromise(execute(link, operation));
// 	// 		expect(organizationUpdate.errors[0].validationErrors[0].message[0].message).toEqual("Phone number is not valid");
// 	// 	});
// 	// 	test("To test updateOrganization using random values and status as INVALID", async () => {
// 	// 		const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 		const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 		const operation = {
// 	// 			query: gql`mutation {
// 	// 				  updateOrganization(
// 	// 					organization: {
// 	// 					  id: "${orgId}"
// 	// 					  name: "${OrgName}"

// 	// 					  code: "${OrgCode}"
// 	// 					  phoneNumber: "${randomOrgPhone}"
// 	// 					  website: "${UpdateOrgWebsite}"
// 	// 					  organizationType:${UpdateOrgT}
// 	// 					  status:"INVALID"
// 	// 					}
// 	// 				  ) {
// 	// 					id
// 	// 					name

// 	// 					code
// 	// 					status
// 	// 					phoneNumber
// 	// 					organizationType
// 	// 				  }
// 	// 				}
// 	// 			   `
// 	// 		};

// 	// 		const organizationUpdate = await makePromise(execute(link, operation));
// 	// 		expect(organizationUpdate.errors[0].message).toEqual(`Expected a value of type "STATUS" but received: "INVALID"`);
// 	// 	});
// 	// 	// test("To test updateOrganization using random values and organization type as INVALID", async () => {
// 	// 	// 	const OrgName = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const OrgCode = Math.random().toString(36).substr(2, 14);
// 	// 	// 	const operation = {
// 	// 	// 		query: gql`mutation {
// 	// 	// 			  updateOrganization(
// 	// 	// 				organization: {
// 	// 	// 				  id: "${orgId}"
// 	// 	// 				  name: "${OrgName}"
// 	// 	//
// 	// 	// 				  code: "${OrgCode}"
// 	// 	// 				  phoneNumber: "${randomOrgPhone}"
// 	// 	// 				  website: "${UpdateOrgWebsite}"
// 	// 	// 				  organizationType:INVALID
// 	// 	// 				  status:"ACTIVE"
// 	// 	// 				}
// 	// 	// 			  ) {
// 	// 	// 				id
// 	// 	// 				name
// 	// 	//
// 	// 	// 				code
// 	// 	// 				status
// 	// 	// 				phoneNumber
// 	// 	// 				organizationType
// 	// 	// 			  }
// 	// 	// 			}
// 	// 	// 		   `
// 	// 	// 	};

// 	// 	// 	const organizationUpdate = await makePromise(execute(link, operation));
// 	// 	// 	console.log(organizationUpdate.errors);
// 	// 	// 	expect(organizationUpdate.errors[0].message).toEqual("Expected a value of type ORGANIZATIONTYPE but received: INVALID");
// 	// 	// });
// 	// });
// 	// // describe("DeleteOrganization check", () => {
// 	// // 	let orgId;

// 	// // 	beforeEach(async () => {
// 	// // 		const org = await createneworg1();
// 	// // 		console.log(org);
// 	// // 		orgId = org.data.createOrganizationRoot.id;
// 	// // 	});

// 	// // 	test("To test deleteOrganzation API", async () => {
// 	// // 		const operation = {
// 	// // 			query: gql`mutation{
// 	// //               deleteOrganization(id:"${orgId}")
// 	// //               {
// 	// //                 name
// 	// //
// 	// //                 code
// 	// //               }
// 	// //             }

// 	// //                  `
// 	// // 		};

// 	// // 		const Deleteorganization = await makePromise(execute(link, operation));
// 	// // 	});
// 	// // });
// 	// describe("DeleteOrganization hierarchy", () => {
// 	// 	let orgId;

// 	// 	beforeEach(async () => {
// 	// 		const org = await createneworg1();
// 	// 		orgId = org.data.createOrganizationRoot.id;
// 	// 	});

// 	// 	test("To test deleteOrganzationhierarchy API", async () => {
// 	// 		const operation = {
// 	// 			query: gql`mutation{
// 	// 				deleteOrganizationHierarchy(id:"${orgId}")
// 	// 				{
// 	// 				  name

// 	// 				}
// 	// 			  }
// 	// 	                 `
// 	// 		};

// 	// 		const Deleteorganization = await makePromise(execute(link, operation));
// 	// 		//console.log(Deleteorganization);
// 	// 	});
// });
// beforeAll(async () => {
// 	const authorg = await createauthorg();
// 	console.log(authorg);
// })
