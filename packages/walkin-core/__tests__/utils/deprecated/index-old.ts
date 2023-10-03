// // global arrays
// export const orgt = ["ORGANIZATION", "STORE"];
// export const statusopt = ["ACTIVE", "INACTIVE"];
// export const statusopt1 = ["ACTIVE", "INACTIVE", "DRAFT"];
// export const attrType = ["NUMBER", "STRING", "BOOLEAN", "OBJECT"];
// export const entityExtnType = ["customer", "product", "organization", "store"];
// export const attrEntType = [
//   "Organization",
//   "Product",
//   "Category",
//   "Order",
//   "Store",
//   "Customer",
//   "Campaign",
//   "Segment",
//   "Event",
//   "EventType",
//   "NOTIFICATION",
//   "EXTERNAL_API",
//   "CREATE_CUSTOMER_FEEDBACK_FORM",
//   "JSON",
//   "XML",
//   "INITIATED",
//   "FAILED",
//   "SUCCESS",
//   "TERMINATED",
//   "CANCELLED"
// ];
// export const actionType = [
//   "NOTIFICATION",
//   "EXTERNAL_API",
//   "CREATE_CUSTOMER_FEEDBACK_FORM"
// ];
// export const actionFormat = ["JSON", "XML"];
// export const actionResult = [
//   "INITIATED",
//   "FAILED",
//   "SUCCESS",
//   "TERMINATED",
//   "CANCELLED"
// ];
// export const slugType = [
//   "DATE",
//   "TIMESTAMP",
//   "TIME",
//   "SHORT_TEXT",
//   "LONG_TEXT",
//   "NUMBER",
//   "BOOLEAN"
// ];
// export const bool = ["true", "false"];
// export const gender = ["MALE", "FEMALE", "OTHERS"];
// export const filterType = ["NUMBER", "STRING"];
// export const metricType = ["SCALAR", "SEQUENCE", "MATRIX"];
// export const ruleType = ["SIMPLE", "COMPLEX"];
// // organization variables
// export const randomOrgName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomOrgStatus =
//   statusopt[Math.floor(Math.random() * statusopt.length)];
// export const randomOrgT = orgt[Math.floor(Math.random() * orgt.length)];
// export const randomOrgPhone = Math.floor(
//   6000000000 + Math.random() * 4000000000
// );
// export const randomOrgAddress = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomOrgCode = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomOrgWebsite = Math.random()
//   .toString(36)
//   .substr(2, 9);

// export const randomOrgAddressLine1 = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomOrgAddressLine2 = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomOrgCity = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomOrgCountry = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomOrgPincode = Math.floor(Math.random() * 90000) + 10000;
// export const randomOrgState = Math.random()
//   .toString(36)
//   .substr(2, 9);

// export const walkinProducts = ["hyperx", "nearx", "refinex", "rewardx"];

// // updateorganization variables
// export const UpdateOrgName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateOrgStatus =
//   statusopt[Math.floor(Math.random() * statusopt.length)];
// export const UpdateOrgT = orgt[Math.floor(Math.random() * orgt.length)];
// export const UpdateOrgPhone = Math.floor(
//   6000000000 + Math.random() * 4000000000
// );
// export const UpdateOrgAddress = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateOrgCode = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateOrgWebsite = Math.random()
//   .toString(36)
//   .substr(2, 9);

// // application variable
// export const randomAppDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomAppAuth = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomAppPlatform = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomAppName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // updateApplication variable
// export const UpdateAppDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateAppAuth = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateAppPlatform = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateAppName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // rule_attribute variable
// export const randomAttrStatus =
//   statusopt1[Math.floor(Math.random() * statusopt1.length)];
// export const randomAttrType =
//   attrType[Math.floor(Math.random() * attrType.length)];
// export const randomAttrName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomAttrDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // rule_entity variables
// export const randomRuleEntName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomRuleEntCode = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomRuleEntStatus =
//   statusopt1[Math.floor(Math.random() * statusopt1.length)];
// // rule_configuration variables
// export const randomConfigName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomConfigDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomConfigStatus =
//   statusopt1[Math.floor(Math.random() * statusopt1.length)];
// // rule variables
// export const randomRuleName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomRuleDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomRuleStatus =
//   statusopt1[Math.floor(Math.random() * statusopt1.length)];
// export const randomRuleType =
//   ruleType[Math.floor(Math.random() * ruleType.length)];
// // updaterule variables
// export const UpdateRuleName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateRuleDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateRuleStatus =
//   statusopt1[Math.floor(Math.random() * statusopt1.length)];
// export const UpdateRuleType =
//   ruleType[Math.floor(Math.random() * ruleType.length)];
// // business rule variables
// export const randomBRuleType = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomBRuleValue = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // segment variables
// export const randomSegName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomSegDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomSegType = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomSegStatus =
//   statusopt1[Math.floor(Math.random() * statusopt1.length)];
// // updateSegment variables
// export const UpdateSegName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateSegDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateSegType = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateSegStatus =
//   statusopt1[Math.floor(Math.random() * statusopt1.length)];
// // campaign variables
// export const randomCampName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const newDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
// export const newDate1 = new Date(Date.now() + 48 * 60 * 60 * 1000);
// export const campStartDate = newDate.toISOString();
// export const campEndDate = newDate1.toISOString();
// export const randomCampType = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const currentDate = new Date().toISOString().toString();
// // updateCampaign Variables
// export const UpdateCampName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateDate = new Date(Date.now() + 48 * 60 * 60 * 1000);
// export const UpdateDate1 = new Date(Date.now() + 96 * 60 * 60 * 1000);
// export const UpdatecampStartDate = newDate.toISOString();
// export const UpdatecampEndDate = newDate1.toISOString();
// export const UpdateCampType = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // actionType variables
// export const randomactType =
//   actionType[Math.floor(Math.random() * actionType.length)];
// // actionDefinition variables
// export const randomActDefForm =
//   actionFormat[Math.floor(Math.random() * actionFormat.length)];
// export const randomActDefName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // action variables
// export const randomActName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomActMessage = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomActResult =
//   actionResult[Math.floor(Math.random() * actionResult.length)];
// // updateAction Variables
// export const UpdateActName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateActMessage = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateActResult =
//   actionResult[Math.floor(Math.random() * actionResult.length)];
// // extendentity variables
// export const randomExtendName =
//   entityExtnType[Math.floor(Math.random() * entityExtnType.length)];
// export const randomExtendDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // entityextendfield
// export const randomFieldChoice = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomFieldDef = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomFieldRequired =
//   bool[Math.floor(Math.random() * bool.length)];
// export const randomFieldSlug = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomFieldType =
//   slugType[Math.floor(Math.random() * slugType.length)];
// export const randomFieldVali = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomFieldhelp = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomFieldlabel = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // customer variables
// export const randomCustDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
// export const randomCustEmail = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomCustExId = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomCustFirstname = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomCustGender =
//   gender[Math.floor(Math.random() * gender.length)];
// export const randomCustIdentifier = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomCustLastname = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomCustPhno = Math.floor(
//   6000000000 + Math.random() * 4000000000
// );
// // updateCustomer variables
// export const UpdateCustDate = new Date(Date.now() - 96 * 60 * 60 * 1000);
// export const UpdateCustEmail = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateCustExId = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateCustFirstname = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateCustGender =
//   gender[Math.floor(Math.random() * gender.length)];
// export const UpdateCustIdentifier = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateCustLastname = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateCustPhno = Math.floor(
//   6000000000 + Math.random() * 4000000000
// );
// // metricFilter variables
// export const randomMetricFilterKey = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomMetricFilterName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomMetricFilterType =
//   filterType[Math.floor(Math.random() * filterType.length)];
// // updateMetricfilter variables
// export const UpdateMetricFilterKey = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateMetricFilterName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateMetricFilterType =
//   filterType[Math.floor(Math.random() * filterType.length)];
// // metric variables
// export const randomMetricName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomMetricQuery = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomMetricDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomMetricType =
//   metricType[Math.floor(Math.random() * metricType.length)];
// // updateMetric variables
// export const UpdateMetricName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateMetricQuery = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateMetricDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const UpdateMetricType =
//   metricType[Math.floor(Math.random() * metricType.length)];
// // feedback variables
// export const feedbackTitle = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // group variables
// export const randomGroupName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // role variables
// export const randomRoleName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomRoleDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);
// // catalog variables
// export const randomCatalogName = Math.random()
//   .toString(36)
//   .substr(2, 9);
// export const randomCatalogDescription = Math.random()
//   .toString(36)
//   .substr(2, 9);

// // Workflow variables
// export const workflowName = ["NO_STATE"];

// export const workflowState = [
//   "NO_STATE",
//   "DRAFT",
//   "LIVE",
//   "COMPLETE",
//   "PAUSE",
//   "ABANDONED"
// ];

// export const workflowProcess = [
//   "CREATE_CAMPAIGN",
//   "LAUNCH_CAMPAIGN",
//   "COMPLETE_CAMPAIGN",
//   "ABANDON_CAMPAIGN",
//   "PAUSE_CAMPAIGN",
//   "UNPAUSE_CAMPAIGN"
// ];

// export const workflowProcessTransition = [
//   "CREATE_CAMPAIGN",
//   "LAUNCH_CAMPAIGN",
//   "COMPLETE_CAMPAIGN",
//   "ABANDON_CAMPAIGN",
//   "PAUSE_CAMPAIGN",
//   "UNPAUSE_CAMPAIGN"
// ];
