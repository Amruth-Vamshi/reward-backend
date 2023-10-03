import {
  AttemptApi,
  ProjectApi,
  Config,
  Id,
  ConfigFactory,
  RestSessionAttemptRequest,
} from "../integrations/digdag";

export const startEntityClickhouseSyncJob = async (
  organizationId,
  entityName,
  syncType
) => {
  console.log("Inside startEntityClickhouseSyncJob");
  console.log(organizationId, entityName, syncType);
  let projectName = "wcore_clickhouse_sync";
  let workflowName = "wcore_clickhouse_sync_table";
  let basepath = process.env.DIGDAG_URL;
  let username = process.env.DIGDAG_USERNAME;
  let password = process.env.DIGDAG_PASSWORD;
  console.log(basepath, username, password);
  let projectApi = null;
  if (password) {
    projectApi = new ProjectApi(username, password, basepath);
  } else {
    projectApi = new ProjectApi(basepath);
  }

  let project = await projectApi.getProject(projectName);
  console.log(project.response.body);
  let projectID = project.response.body.id;
  let workflow = await projectApi.getWorkflow(projectID, workflowName);
  let workflowId = workflow.response.body.id;
  let sessionTime = new Date().toISOString();

  let restSessionAttemptRequest = new RestSessionAttemptRequest();

  let workflowParams = {};
  workflowParams["organization_id"] = organizationId;
  workflowParams["rdbms_source_tablename"] = entityName;
  workflowParams["sync_type"] = syncType;
  workflowParams["test_param"] = "N.A";
  workflowParams["job_trigger_source"] = "walkin_server";

  restSessionAttemptRequest.params = workflowParams;
  restSessionAttemptRequest.sessionTime = sessionTime;
  restSessionAttemptRequest.workflowId = workflowId;

  console.log("calling attempt", restSessionAttemptRequest);

  let attemptApi = null;
  if (password) {
    attemptApi = new AttemptApi(username, password, basepath);
  } else {
    attemptApi = new AttemptApi(basepath);
  }

  let attempt = await attemptApi.startAttempt(restSessionAttemptRequest);
  console.log(attempt.response.body);
};

export const startStoreSyncJob = async (storeId: string) => {
  console.log("Inside startEntityClickhouseSyncJob");
  console.log(storeId);
  const projectName = "load_store";
  const workflowName = "load_store";
  const basepath = process.env.DIGDAG_URL;
  const username = process.env.DIGDAG_USERNAME;
  const password = process.env.DIGDAG_PASSWORD;
  let projectApi = new ProjectApi(basepath);
  if (password) {
    projectApi = new ProjectApi(username, password, basepath);
  }
  projectApi.useQuerystring = true;
  console.log("project api initialized");
  const project = await projectApi.getProject(projectName);
  console.log(project.response.body);
  const projectID = project.response.body.id;
  const workflow = await projectApi.getWorkflow(projectID, workflowName);
  const workflowId = workflow.response.body.id;
  const sessionTime = new Date().toISOString();

  const restSessionAttemptRequest = new RestSessionAttemptRequest();

  const workflowParams = {};
  workflowParams["store_id"] = storeId;
  restSessionAttemptRequest.params = workflowParams;
  restSessionAttemptRequest.sessionTime = sessionTime;
  restSessionAttemptRequest.workflowId = workflowId;

  console.log("calling attempt", restSessionAttemptRequest);

  let attemptApi = new AttemptApi(basepath);
  if (password) {
    attemptApi = new AttemptApi(username, password, basepath);
  }
  const attempt = await attemptApi.startAttempt(restSessionAttemptRequest);
  console.log(attempt.response.body);
};

export const startAudienceCreationJob = async (
  organizationId,
  campaignId,
  jwt
) => {
  console.log("Inside startAudienceCreationJob");
  console.log(organizationId, campaignId);

  let projectName = "start_campaign";
  let workflowName = "workflow_process_campaign";

  let basepath = process.env.DIGDAG_URL;
  let username = process.env.DIGDAG_USERNAME;
  let password = process.env.DIGDAG_PASSWORD;
  let projectApi = null;
  if (password) {
    projectApi = new ProjectApi(username, password, basepath);
  } else {
    projectApi = new ProjectApi(basepath);
  }

  let project = await projectApi.getProject(projectName);
  let projectID = project.response.body.id;
  let workflow = await projectApi.getWorkflow(projectID, workflowName);
  let workflowId = workflow.response.body.id;
  let sessionTime = new Date().toISOString();

  let restSessionAttemptRequest = new RestSessionAttemptRequest();

  let workflowParams = {};
  workflowParams["organization_id"] = organizationId;
  workflowParams["campaign_id"] = campaignId;
  workflowParams["wcore_jwt"] = jwt;
  workflowParams["test_param"] = "N.A";
  workflowParams["job_trigger_source"] = "walkin_server";

  restSessionAttemptRequest.params = workflowParams;
  restSessionAttemptRequest.sessionTime = sessionTime;
  restSessionAttemptRequest.workflowId = workflowId;

  console.log("calling attempt", restSessionAttemptRequest);
  let attemptApi = null;
  if (password) {
    attemptApi = new AttemptApi(username, password, basepath);
  } else {
    attemptApi = new AttemptApi(basepath);
  }

  let attempt = await attemptApi.startAttempt(restSessionAttemptRequest);
  console.log(attempt.response.body);
};

export const startLoyaltyTransactionJob = async (
  organizationId,
  jwt,
  loyaltyTransactionInput
) => {
  console.log("Inside startLoyaltyTransactionJob");
  console.log(organizationId);

  let projectName = "JFL_RewardX_ETL_Sync_Loyalty_Check";
  let workflowName = "JFL_etl_trigger_workflow";

  let basepath = process.env.DIGDAG_URL;
  let username = process.env.DIGDAG_USERNAME;
  let password = process.env.DIGDAG_PASSWORD;
  let projectApi = null;
  if (password) {
    projectApi = new ProjectApi(username, password, basepath);
  } else {
    projectApi = new ProjectApi(basepath);
  }

  let project = await projectApi.getProject(projectName);
  let projectID = project.response.body.id;
  let workflow = await projectApi.getWorkflow(projectID, workflowName);
  let workflowId = workflow.response.body.id;

  let sessions = await projectApi.getSessionsByProjectId(
    projectID,
    workflowName
  );

  for (let i = 0; i < sessions.response.body.sessions.length; i++) {
    let s = sessions.response.body.sessions[i];
    let attempt = s.lastAttempt;
    if (attempt.done) {
      continue;
    } else {
      return { status: "success", message: "already running" };
    }
  }

  let sessionTime = new Date().toISOString();

  let restSessionAttemptRequest = new RestSessionAttemptRequest();

  let workflowParams = {};
  workflowParams["eventType"] = loyaltyTransactionInput.eventType;
  workflowParams["loyaltyDate"] = loyaltyTransactionInput.loyaltyDate;
  workflowParams["recordCount"] = loyaltyTransactionInput.recordCount;
  // workflowParams["test_param"] = "N.A";
  // workflowParams["job_trigger_source"] = "walkin_server";

  restSessionAttemptRequest.params = workflowParams;
  restSessionAttemptRequest.sessionTime = sessionTime;
  restSessionAttemptRequest.workflowId = workflowId;

  console.log("calling attempt", restSessionAttemptRequest);
  let attemptApi = null;
  if (password) {
    attemptApi = new AttemptApi(username, password, basepath);
  } else {
    attemptApi = new AttemptApi(basepath);
  }

  let attempt = await attemptApi.startAttempt(restSessionAttemptRequest);
  console.log(attempt.response.body);
  return { status: "success", message: "started" };
};
