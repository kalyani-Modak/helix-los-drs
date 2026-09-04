import { HAxiosService } from "@helix/component-library";
import { LosApplicationAPI, LosOperationsAPI } from "./workflowRegistryApiEndpoints";
import { unwrapApiResponse } from "../utils/apiResponse";

/**
 * @typedef {Object} LosApplication
 * @property {number} id
 * @property {string} applicationNumber
 * @property {string} applicantName
 * @property {string} mobileNumber
 * @property {string} status
 * @property {string|null} processInstanceId
 * @property {string|null} currentTaskId
 * @property {string|null} currentStage
 * @property {string|null} currentActivity
 * @property {string|null} processDefinitionId
 * @property {string|null} processDefinitionKey
 * @property {number|null} processDefinitionVersion
 * @property {string|null} deploymentId
 * @property {number|null} workflowDefinitionId
 * @property {string|null} workflowCode
 * @property {string|null} workflowName
 * @property {string|null} workflowStatus
 * @property {string|null} failedActivityId
 * @property {string|null} failedActivityName
 * @property {string|null} errorMessage
 * @property {string|null} failedTimestamp
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {boolean} [hasRetryableJobs]
 * @property {string[]} [retryableActivityIds]
 */

/**
 * @typedef {Object} LosChildWorkflow
 * @property {string} workflowId
 * @property {string} workflowName
 * @property {string} status
 * @property {string|null} callActivityId
 * @property {string|null} calledElement
 * @property {string|null} [childActivityName]
 * @property {string|null} [processName]
 * @property {string|null} [startTime]
 * @property {string|null} [endTime]
 * @property {string|null} [errorDetails]
 */

/**
 * @typedef {Object} LosActivityRow
 * @property {string} activityId
 * @property {string} activityName
 * @property {string} activityType
 * @property {string} status
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} assignee
 * @property {string} duration
 * @property {string} remarks
 */

/**
 * @typedef {Object} LosDiagramActivityState
 * @property {string} activityId
 * @property {string} activityType
 * @property {string} status
 * @property {string|null} detail
 */

/**
 * @typedef {Object} LosWorkflowDiagram
 * @property {string} processInstanceId
 * @property {string} workflowName
 * @property {string|null} processDefinitionKey
 * @property {string} status
 * @property {string} bpmnXml
 * @property {LosDiagramActivityState[]} activityStates
 * @property {LosActivityRow[]} activities
 */

/**
 * Save a draft application (no process instance started).
 * @param {{ applicantName: string, mobileNumber: string }} body
 * @returns {Promise<LosApplication>}
 */
export async function saveDraft(body) {
  const response = await HAxiosService.POST(LosApplicationAPI.save_draft(), body);
  return unwrapApiResponse(response, "Failed to save application draft");
}

/**
 * Submit an application — creates the record, stamps the active BPMN
 * snapshot, and starts the workflow process instance.
 * @param {{ applicantName: string, mobileNumber: string, extraVariables?: Record<string, unknown> }} body
 * @returns {Promise<LosApplication>}
 */
export async function submitApplication(body) {
  const response = await HAxiosService.POST(LosApplicationAPI.submit(), body);
  return unwrapApiResponse(response, "Failed to submit application");
}

/**
 * List / search applications (Application list page grid).
 * @param {{ applicationNo?: string, status?: string, stage?: string }} [params]
 * @returns {Promise<LosApplication[]>}
 */
export async function listApplications(params = {}) {
  const response = await HAxiosService.GET(LosApplicationAPI.list(params));
  const data = unwrapApiResponse(response, "Failed to load applications");
  if (!Array.isArray(data)) {
    throw new Error(
      "Applications list request did not return a list — check that VITE_BASE_LOS_APPLICATION_API_PATH is set correctly and transaction-service is reachable."
    );
  }
  return data;
}

/**
 * Fetch a single application by its application number.
 * @param {string} applicationNumber
 * @returns {Promise<LosApplication>}
 */
export async function getApplication(applicationNumber) {
  const response = await HAxiosService.GET(LosApplicationAPI.get_by_number(applicationNumber));
  return unwrapApiResponse(response, "Failed to load application");
}

/**
 * WF Graphical Log — BPMN snapshot + live execution status for one process instance.
 * @param {string} applicationNumber
 * @param {string} processInstanceId
 * @returns {Promise<LosWorkflowDiagram>}
 */
export async function getWorkflowDiagram(applicationNumber, processInstanceId) {
  const response = await HAxiosService.GET(LosApplicationAPI.get_diagram(applicationNumber, processInstanceId));
  return unwrapApiResponse(response, "Failed to load workflow diagram");
}

/**
 * Child process instances started from Call Activities on the given process instance.
 * @param {string} applicationNumber
 * @param {string} [processInstanceId]
 * @returns {Promise<LosChildWorkflow[]>}
 */
export async function listChildWorkflows(applicationNumber, processInstanceId) {
  const response = await HAxiosService.GET(
    LosApplicationAPI.list_child_workflows(applicationNumber, processInstanceId),
  );
  const data = unwrapApiResponse(response, "Failed to load child workflows");
  return Array.isArray(data) ? data : [];
}

/**
 * Complete the selected running user task / system activity.
 * @param {string} applicationNumber
 * @param {string|null} taskId
 * @param {Record<string, unknown>} [variables]
 * @param {{ activityId?: string|null, processInstanceId?: string|null }} [opts]
 */
export async function completeLosTask(applicationNumber, taskId, variables = {}, opts = {}) {
  const response = await HAxiosService.POST(LosApplicationAPI.complete_task(applicationNumber), {
    taskId: taskId ?? null,
    activityId: opts.activityId ?? null,
    processInstanceId: opts.processInstanceId ?? null,
    variables: variables ?? {},
  });
  unwrapApiResponse(response, "Failed to complete task");
}

/**
 * @param {string} applicationNumber
 * @param {string|null|undefined} [processInstanceId]
 * @param {string|null|undefined} [activityId]
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function retryApplication(applicationNumber, processInstanceId, activityId) {
  const response = await HAxiosService.POST(LosOperationsAPI.retry(applicationNumber), {
    processInstanceId: processInstanceId ?? null,
    activityId: activityId ?? null,
  });
  return unwrapApiResponse(response, "Failed to retry workflow activity");
}

/**
 * @param {string} applicationNumber
 * @param {string} [skipReason]
 * @param {string|null|undefined} [processInstanceId]
 * @param {string|null|undefined} [activityId]
 * @returns {Promise<{ success: boolean, message: string, skippedActivityId: string|null, skippedActivityName: string|null, nextActivityId: string|null, nextActivityName: string|null }>}
 */
export async function skipApplication(applicationNumber, skipReason, processInstanceId, activityId) {
  const response = await HAxiosService.POST(LosOperationsAPI.skip(applicationNumber), {
    skipReason: skipReason ?? null,
    processInstanceId: processInstanceId ?? null,
    activityId: activityId ?? null,
  });
  return unwrapApiResponse(response, "Failed to skip workflow activity");
}
