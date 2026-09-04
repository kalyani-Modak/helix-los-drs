import { d2 as getHelixBatchExecutionApiPath, d3 as getHelixBatchMastersApiPath } from "./index-BhdgJqva.js";
function unwrapCommonResponse(res) {
  const d = res == null ? void 0 : res.data;
  if (d && typeof d === "object" && "status" in d && "responseJson" in d) {
    if (String(d.status).toLowerCase() === "failure") {
      const err = new Error(d.message || "Request failed");
      err.apiMessage = d.message;
      throw err;
    }
    return d.responseJson;
  }
  return d;
}
const batchMastersBase = () => {
  const u = getHelixBatchMastersApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};
const batchExecutionBase = () => {
  const u = getHelixBatchExecutionApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};
const BatchMastersAPI = {
  BatchMasters: (screenMenuId) => `${batchMastersBase()}batch-masters/batches/${screenMenuId}`,
  getBatch: (batchCode, screenMenuId) => `${batchMastersBase()}batch-masters/batches/${screenMenuId}/${encodeURIComponent(batchCode)}`,
  ProcessMaster: (screenMenuId) => `${batchMastersBase()}batch-masters/processes/${screenMenuId}`,
  getProcess: (processId) => `${batchMastersBase()}batch-masters/processes/${processId}`,
  PartitionMaster: (screenMenuId) => `${batchMastersBase()}batch-masters/partitions/${screenMenuId}`,
  /** Single bulk save: create / update / delete from grid delta. */
  listPartitionTypes: (screenMenuId) => `${batchMastersBase()}batch-masters/partition-types/EC-PartitionTypeMaster`,
  updatePartitionTypes: (screenMenuId) => `${batchMastersBase()}batch-masters/partition-types/${screenMenuId}`,
  getBatchProcess: (batchCode, processId) => `${batchMastersBase()}batch-masters/batches/${encodeURIComponent(batchCode)}/processes/${processId}`,
  /** Single bulk save: deletes, creates, updates in one server transaction. */
  BatchProcesses: (batchCode, screenMenuId) => `${batchMastersBase()}batch-masters/batches/${encodeURIComponent(batchCode)}/processes/${screenMenuId}`
};
const BatchExecutionAPI = {
  BatchExecution: (screenMenuId) => `${batchExecutionBase()}batch-execution/${screenMenuId}`,
  completedPartitions: (batchCode) => `${batchExecutionBase()}batch-execution/completed/${encodeURIComponent(batchCode)}/partitions`,
  run: (batchCode) => `${batchExecutionBase()}batch-execution/run/${encodeURIComponent(batchCode)}`,
  retry: (batchCode) => `${batchExecutionBase()}batch-execution/retry/${encodeURIComponent(batchCode)}`,
  abort: (batchCode) => `${batchExecutionBase()}batch-execution/abort/${encodeURIComponent(batchCode)}`,
  status: (batchCode) => `${batchExecutionBase()}batch-execution/status/${encodeURIComponent(batchCode)}`
};
export {
  BatchExecutionAPI as B,
  BatchMastersAPI as a,
  unwrapCommonResponse as u
};
