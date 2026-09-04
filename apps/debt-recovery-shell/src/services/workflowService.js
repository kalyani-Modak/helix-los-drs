import { HAxiosService } from "@helix/component-library";
import { WorkflowMasterAPI, WorkflowRegistryAPI } from "../api/workflowRegistryApiEndpoints";
import { unwrapApiResponse } from "../utils/apiResponse";

/**
 * Keep workflow-service registry diagram copy in sync with master.
 * Custom properties are stored in the BPMN XML (`los:activityConfiguration`);
 * registry sync is optional for studio tooling.
 */
async function syncWorkflowRegistry(workflowName, bpmnXml) {
  if (!workflowName?.trim() || !bpmnXml?.trim()) {
    return;
  }
  try {
    await HAxiosService.POST(WorkflowRegistryAPI.save(), {
      workflowName: workflowName.trim(),
      bpmnXml,
    });
  } catch (error) {
    console.warn("Failed to sync workflow registry", error);
  }
}

/** Save / upsert DRAFT into master-service (appears in Workflow List). */
export const saveWorkflow = async (workflowName, bpmnXml) => {
  const response = await HAxiosService.POST(WorkflowMasterAPI.save(), {
    workflowName,
    bpmnXml,
  });
  const data = unwrapApiResponse(response, "Failed to save workflow");
  await syncWorkflowRegistry(workflowName, bpmnXml);
  return data;
};

/** @deprecated Designer Deploy no longer deploys to Flowable — use Workflow List. */
export const deployWorkflow = async (workflowName, bpmnXml) => {
  return saveWorkflow(workflowName, bpmnXml);
};

/** Workflow dropdown / Call Activity catalog — from master list. */
export const getAllWorkflows = async () => {
  const response = await HAxiosService.GET(WorkflowMasterAPI.list());
  const data = unwrapApiResponse(response, "Failed to load workflows");
  return (data || []).map((w) => ({
    id: w.id,
    workflowName: w.workflowName,
    workflowCode: w.workflowCode,
    status: w.status,
    processKey: w.processKey ?? null,
  }));
};

export const loadWorkflowByName = async (workflowName) => {
  const response = await HAxiosService.GET(WorkflowMasterAPI.get_by_name(workflowName));
  const detail = unwrapApiResponse(response, "Failed to load workflow");
  // Ensure activity-metadata API can resolve this workflow name
  await syncWorkflowRegistry(detail.workflowName, detail.bpmnXml);
  return detail;
};

export async function validateWorkflowXSD(xml) {
  // HAxiosService.POST is (url, data, params, flag, headers) — see note in
  // masterApi.js's saveWorkflowDraft for why headers can't be the 3rd arg.
  const response = await HAxiosService.POST(
    WorkflowRegistryAPI.validate_xsd(),
    xml,
    {},
    false,
    { "Content-Type": "application/xml" },
  );
  const data = unwrapApiResponse(response, "Validation failed");
  if (!data.valid) {
    console.log(data.errors);
  }
  return data;
}

export async function downloadWorkflow(workflowName) {
  const detail = await loadWorkflowByName(workflowName);
  const blob = new Blob([detail.bpmnXml || ""], { type: "application/xml" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${workflowName}.bpmn`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
