import { HAxiosService } from "@helix/component-library";
import { WorkflowMasterAPI } from "./workflowRegistryApiEndpoints";
import { unwrapApiResponse } from "../utils/apiResponse";

/**
 * @typedef {Object} WorkflowDraftResponse
 * @property {number} id
 * @property {string} workflowCode
 * @property {string} status
 * @property {string} message
 */

/**
 * @typedef {Object} WorkflowListItem
 * @property {number} id
 * @property {string} workflowCode
 * @property {string} workflowName
 * @property {string|null} description
 * @property {number|null} version
 * @property {string} status
 * @property {string|null} [processKey]
 * @property {string|null} deploymentDate
 * @property {boolean} currentActive
 */

/**
 * @typedef {Object} WorkflowDefinitionDetail
 * @property {number} id
 * @property {string} workflowCode
 * @property {string} workflowName
 * @property {string|null} description
 * @property {string} status
 * @property {string|null} bpmnXml
 * @property {string|null} deploymentId
 * @property {string|null} processDefinitionId
 * @property {string|null} processKey
 * @property {number|null} version
 */

/**
 * @param {{ file: File, workflowName: string, description?: string }} params
 * @returns {Promise<WorkflowDraftResponse>}
 */
export async function saveWorkflowDraft(params) {
  const fd = new FormData();
  fd.append("file", params.file);
  fd.append("workflowName", params.workflowName);
  if (params.description) fd.append("description", params.description);
  // HAxiosService.POST signature is (url, data, params, flag, headers) —
  // NOT axios-style (url, data, config). Passing headers as the 3rd arg
  // silently gets serialized as a query string instead (?headers[...]=...).
  // Matches the pattern already used in UploadUsers.jsx / UploadFederationUsers.jsx.
  const response = await HAxiosService.POST(
    WorkflowMasterAPI.save_draft(),
    fd,
    {},
    false,
    { "Content-Type": "multipart/form-data" },
  );
  return unwrapApiResponse(response, "Failed to save workflow draft");
}

/** Designer JSON save — upserts DRAFT by name. */
export async function saveWorkflowFromDesigner(params) {
  const response = await HAxiosService.POST(WorkflowMasterAPI.save(), params);
  return unwrapApiResponse(response, "Failed to save workflow");
}

export async function deployWorkflow(id, activateAfterDeploy = true) {
  const response = await HAxiosService.POST(WorkflowMasterAPI.deploy(id), { activateAfterDeploy });
  return unwrapApiResponse(response, "Failed to deploy workflow");
}

export async function listWorkflowDefinitions() {
  const response = await HAxiosService.GET(WorkflowMasterAPI.list());
  const data = unwrapApiResponse(response, "Failed to load workflow list");
  // Guard: a misconfigured base URL can resolve to a relative path that the
  // Vite dev server's SPA fallback answers with 200 + index.html instead of
  // a real 404 — which would otherwise slip through as a non-array "list"
  // and crash the table with "paged.map is not a function".
  if (!Array.isArray(data)) {
    throw new Error(
      "Workflow list request did not return a list — check that VITE_BASE_WORKFLOW_MASTER_API_PATH is set correctly and master-service is reachable."
    );
  }
  return data;
}

export async function activateWorkflow(id) {
  const response = await HAxiosService.PUT(WorkflowMasterAPI.activate(id));
  unwrapApiResponse(response, "Failed to activate workflow");
}

export async function deactivateWorkflow(id) {
  const response = await HAxiosService.PUT(WorkflowMasterAPI.deactivate(id));
  unwrapApiResponse(response, "Failed to deactivate workflow");
}

/** Move INACTIVE → DRAFT so Designer Save is allowed. */
export async function moveWorkflowToDraft(id) {
  const response = await HAxiosService.POST(WorkflowMasterAPI.move_to_draft(id));
  return unwrapApiResponse(response, "Failed to move workflow to draft");
}

export async function getWorkflowDefinition(id) {
  const response = await HAxiosService.GET(WorkflowMasterAPI.get_by_id(id));
  return unwrapApiResponse(response, "Failed to load workflow");
}

export async function fetchWorkflowBpmnXml(id) {
  const response = await HAxiosService.GET(WorkflowMasterAPI.get_bpmn(id), {
    responseType: "text",
    headers: { Accept: "application/xml" },
  });
  const data = unwrapApiResponse(response, "Failed to load workflow BPMN");
  return typeof data === "string" ? data : String(data);
}
