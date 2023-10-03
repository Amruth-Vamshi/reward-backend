// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// import { OverlappingFieldsCanBeMerged } from "graphql/validation/rules/OverlappingFieldsCanBeMerged";
// import { AdvancedConsoleLogger } from "typeorm";
// import { SLUGTYPE } from "../../../src/modules/common/constants/constants";
// import { link } from "../../utils/testUtils";
// import { matchUriRE } from "../../utils/regex";
// import { addnewentityextend, addnewentityextendfield, createauthorg, createneworg1 } from "../../utils/functions";
// import {
// 	randomEntType,
// 	randomExtendDescription,
// 	randomExtendType,
// 	randomFieldChoice,
// 	randomFieldDef,
// 	randomFieldhelp,
// 	randomFieldlabel,
// 	randomFieldRequired,
// 	randomFieldSlug,
// 	randomFieldVali,
// } from "../../utils/index";
// jest.setTimeout(120000);
// let orgId;
// let entityExtendId;
// describe("addenitityextendfield", () => {
// 	const randomFieldType = SLUGTYPE.NUMBER;
// 	test("addentityextendfield with random values", async () => {
// 		console.log(entityExtendId);
// 		console.log(randomFieldSlug);
// 		console.log(randomFieldlabel);
// 		console.log(randomFieldhelp);
// 		console.log(randomFieldType);
// 		console.log(randomFieldRequired);
// 		console.log(randomFieldChoice);
// 		console.log(randomFieldDef);
// 		console.log(randomFieldVali);
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			randomFieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			randomFieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with empty extend id", async () => {
// 		const randomFieldType = SLUGTYPE.NUMBER;
// 		const entityextendid = "";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			randomFieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with invalid extend id", async () => {
// 		const randomFieldType = SLUGTYPE.NUMBER;
// 		const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const extendField = await addnewentityextendfield(
// 			entityextendid,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			randomFieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with empty slug", async () => {
// 		const randomFieldType = SLUGTYPE.NUMBER;
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = "";
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			randomFieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with slug which already exists", async () => {

// 		const randomFieldType = SLUGTYPE.NUMBER;
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			randomFieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			randomFieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with field type as DATE", async () => {
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const FieldType = SLUGTYPE.DATE;
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			FieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with field type as TIMESTAMP", async () => {
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const FieldType = SLUGTYPE.TIMESTAMP;
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			FieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with field type as TIME", async () => {
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const FieldType = SLUGTYPE.TIME;
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			FieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with field type as SHORT_TEXT", async () => {
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const FieldType = SLUGTYPE.SHORT_TEXT;
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			FieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with field type as LONG_TEXT", async () => {
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const FieldType = SLUGTYPE.LONG_TEXT;
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			FieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with field type as NUMBER", async () => {
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const FieldType = SLUGTYPE.SHORT_NUMBER;
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			FieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// 	test("addentityextendfield with random values and with field type as BOOLEAN", async () => {
// 		// 	const entityextendid = "helloworld";
// 		const FieldSlug = Math.random().toString(36).substr(2, 14);
// 		const FieldType = SLUGTYPE.BOOLEAN;
// 		const extendField = await addnewentityextendfield(
// 			entityExtendId,
// 			FieldSlug,
// 			randomFieldlabel,
// 			randomFieldhelp,
// 			FieldType,
// 			randomFieldRequired,
// 			randomFieldChoice,
// 			randomFieldDef,
// 			randomFieldVali
// 		);
// 		const extendFieldId = extendField.data.addEntityExtendField.id;
// 		// positive tests for the createActionType API
// 		// expect(extendField.data.addEntityExtendField.entityExtendId.id).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.slug).toBeTruthy();
// 		expect(extendField.data.addEntityExtendField.type).toBeTruthy();
// 	});
// });

// beforeAll(async () => {
// 	const authorg = await createauthorg();
// 	const org = await createneworg1();
// 	orgId = org.data.createOrganizationRoot.id;
// 	const extend = await addnewentityextend(orgId, randomExtendType, randomExtendDescription);
// 	entityExtendId = extend.data.addEntityExtend.id;
// });
