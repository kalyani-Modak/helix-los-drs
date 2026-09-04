/**
 * Convert a workflow name (or typed Call Activity value) into the BPMN process
 * id / Flowable process-definition key used by the designer on save/deploy.
 */
export function toValidBpmnProcessId(name) {
  let id = name.trim().replace(/[^a-zA-Z0-9_]+/g, "_").replace(/_+/g, "_");
  if (!id || !/^[a-zA-Z_]/.test(id)) {
    id = `Process_${id}`;
  }
  return id;
}
