import { getAllWorkflows } from "../../../services/workflowService";
import { toValidBpmnProcessId } from "../../../utils/bpmnProcessId";

const NOT_DEPLOYED_MARKER = "__NOT_DEPLOYED__";

let currentWorkflowName = "";
let cachedOptions = null;
let cachePromise = null;

export function setCurrentWorkflowName(name) {
  currentWorkflowName = (name || "").trim();
}

export function invalidateWorkflowCatalog() {
  cachedOptions = null;
  cachePromise = null;
}

/**
 * Call Activity calledElement must be the Flowable process key, not the display name.
 * Prefer stored processKey after deploy; otherwise derive the same id the designer would sync.
 */
function resolveCalledElementKey(workflow) {
  const key = (workflow.processKey || "").trim();
  if (key && key !== NOT_DEPLOYED_MARKER) {
    return key;
  }
  return toValidBpmnProcessId(workflow.workflowName || "");
}

function toWorkflowOptions(workflows) {
  const seenKeys = new Set();

  return (workflows || [])
    .filter((workflow) => workflow.workflowName && workflow.workflowName !== currentWorkflowName)
    .map((workflow) => {
      const value = resolveCalledElementKey(workflow);
      const label =
        value && value !== workflow.workflowName
          ? `${workflow.workflowName} (${value})`
          : workflow.workflowName;
      return { value, label, workflowName: workflow.workflowName };
    })
    .filter((option) => {
      if (!option.value || seenKeys.has(option.value)) {
        return false;
      }
      seenKeys.add(option.value);
      return true;
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export async function fetchWorkflowOptions() {
  if (cachedOptions) {
    return cachedOptions;
  }

  if (!cachePromise) {
    cachePromise = getAllWorkflows()
      .then((workflows) => {
        cachedOptions = toWorkflowOptions(workflows);
        return cachedOptions;
      })
      .catch((error) => {
        console.error("Failed to load workflows for Call Activity:", error);
        cachedOptions = [];
        return cachedOptions;
      })
      .finally(() => {
        cachePromise = null;
      });
  }

  return cachePromise;
}
