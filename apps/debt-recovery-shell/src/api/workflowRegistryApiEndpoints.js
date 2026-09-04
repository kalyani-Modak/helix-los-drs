import { getWorkflowMasterApiPath, getWorkflowRegistryApiPath, getLosApplicationApiPath } from "@shared/config/apiConstants";

/**
 * URL-builder functions only — no axios/HAxiosService here. Same shape as
 * products/user-management/modules/idmUI/apiEndpoints.jsx. Base URLs come
 * from shared/config/apiConstants.jsx (VITE_BASE_WORKFLOW_MASTER_API_PATH /
 * VITE_BASE_WORKFLOW_REGISTRY_API_PATH / VITE_BASE_LOS_APPLICATION_API_PATH
 * in dev, public/config.json in a built/staging/production deployment).
 */

/** master-service — workflow definitions: draft upload, save, list, deploy, activate. */
export const WorkflowMasterAPI = {
  save_draft: () => `${getWorkflowMasterApiPath()}api/master/draft`,
  save: () => `${getWorkflowMasterApiPath()}api/master/save`,
  list: () => `${getWorkflowMasterApiPath()}api/master/list`,
  get_by_id: (id) => `${getWorkflowMasterApiPath()}api/master/${id}`,
  get_bpmn: (id) => `${getWorkflowMasterApiPath()}api/master/${id}/bpmn`,
  deploy: (id) => `${getWorkflowMasterApiPath()}api/master/${id}/deploy`,
  activate: (id) => `${getWorkflowMasterApiPath()}api/master/activate/${id}`,
  deactivate: (id) => `${getWorkflowMasterApiPath()}api/master/deactivate/${id}`,
  move_to_draft: (id) => `${getWorkflowMasterApiPath()}api/master/${id}/move-to-draft`,
  get_by_name: (workflowName) =>
    `${getWorkflowMasterApiPath()}api/master/name/${encodeURIComponent(workflowName)}`,
};

/** workflow-registry service — registry sync, activity metadata, BPMN XSD validation. */
export const WorkflowRegistryAPI = {
  save: () => `${getWorkflowRegistryApiPath()}api/workflows/save`,
  activity_metadata: (workflowName) =>
    `${getWorkflowRegistryApiPath()}api/workflows/${encodeURIComponent(workflowName)}/activity-metadata`,
  activity_metadata_update: (workflowName, activityId) =>
    `${getWorkflowRegistryApiPath()}api/workflows/${encodeURIComponent(workflowName)}/activity-metadata/${encodeURIComponent(activityId)}`,
  validate_xsd: () => `${getWorkflowRegistryApiPath()}api/bpmn/validate`,
};

/**
 * transaction-service — LOS application entry: save draft / submit (creates
 * the application, stamps the active BPMN snapshot, starts the process
 * instance) / list (search grid) / get_by_number / get_diagram /
 * list_child_workflows / complete_task (WF Graphical Log page).
 */
export const LosApplicationAPI = {
  save_draft: () => `${getLosApplicationApiPath()}api/los/applications/draft`,
  submit: () => `${getLosApplicationApiPath()}api/los/applications/submit`,
  /** @param {{ applicationNo?: string, status?: string, stage?: string }} [params] */
  list: (params = {}) => {
    const qs = new URLSearchParams();
    if (params.applicationNo) qs.set("applicationNo", params.applicationNo);
    if (params.status) qs.set("status", params.status);
    if (params.stage) qs.set("stage", params.stage);
    const s = qs.toString();
    return `${getLosApplicationApiPath()}api/los/applications${s ? `?${s}` : ""}`;
  },
  get_by_number: (appNo) => `${getLosApplicationApiPath()}api/los/applications/${encodeURIComponent(appNo)}`,
  get_diagram: (appNo, processInstanceId) =>
    `${getLosApplicationApiPath()}api/los/applications/${encodeURIComponent(appNo)}/workflows/${encodeURIComponent(processInstanceId)}/diagram`,
  list_child_workflows: (appNo, processInstanceId) => {
    const qs = processInstanceId ? `?processInstanceId=${encodeURIComponent(processInstanceId)}` : "";
    return `${getLosApplicationApiPath()}api/los/applications/${encodeURIComponent(appNo)}/child-workflows${qs}`;
  },
  complete_task: (appNo) =>
    `${getLosApplicationApiPath()}api/los/applications/${encodeURIComponent(appNo)}/tasks/complete`,
};

/**
 * transaction-service — LOS operations: retry / skip a failed or running
 * activity. Root `api/applications/...` path (not under `api/los/...`) —
 * matches the reference backend's separate operations controller.
 */
export const LosOperationsAPI = {
  retry: (appNo) => `${getLosApplicationApiPath()}api/applications/${encodeURIComponent(appNo)}/retry`,
  skip: (appNo) => `${getLosApplicationApiPath()}api/applications/${encodeURIComponent(appNo)}/skip`,
};
