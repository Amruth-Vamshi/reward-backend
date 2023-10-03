// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { EXTEND_ENTITIES } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import { addnewentityextend, createauthorg, createneworg1 } from "../../utils/functions";
// import { randomExtendDescription } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// describe("addenitityextend", () => {
// 	test("addentityextend with random values", async () => {
// 		const randomExtendName = EXTEND_ENTITIES.store;
// 		const extend = await addnewentityextend(orgId, randomExtendName, randomExtendDescription);
// 		expect(extend.data.addEntityExtend.entityName).not.toBeNull();
// 		expect(extend.data.addEntityExtend.description).not.toBeNull();
// 	});
// 	test("addentityextend with random values and org id as empty", async () => {
// 		const ExtendName = EXTEND_ENTITIES.store;
// 		const orgid = "";
// 		const extend = await addnewentityextend(orgid, ExtendName, randomExtendDescription);
// 		console.log(extend)
// 	});
// 	test("addentityextend with random values and org id as invalid", async () => {
// 		const ExtendName = EXTEND_ENTITIES.store;
// 		const orgid = "helloworld";
// 		const extend = await addnewentityextend(orgid, ExtendName, randomExtendDescription);
// 		console.log(extend);

// 	});
// 	test("addentityextend with random values and extend name as empty", async () => {
// 		const ExtendName = EXTEND_ENTITIES.store;
// 		const extend = await addnewentityextend(orgId, ExtendName, randomExtendDescription);
// 		console.log(extend);
// 	});
// 	test("addentityextend with random values and extend name which already exists", async () => {
// 		const ExtendName = EXTEND_ENTITIES.store;
// 		const extend = await addnewentityextend(orgId, ExtendName, randomExtendDescription);
// 		console.log(extend);
// 	});
// });
// beforeAll(async () => {
// 	const authorg = await createauthorg();
// 	const org = await createneworg1();
// 	orgId = org.data.createOrganizationRoot.id;
// });
