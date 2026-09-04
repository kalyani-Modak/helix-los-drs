import { getHelixBatchMastersApiPath, getHelixBatchExecutionApiPath } from "@shared/config/apiConstants";
import PartitionMaster from "./PartitionMaster";

const batchMastersBase = () => {
  const u = getHelixBatchMastersApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

const batchExecutionBase = () => {
  const u = getHelixBatchExecutionApiPath() || "";
  return u.endsWith("/") ? u : `${u}/`;
};

/** REST paths aligned with helix-batch-framework. */
export const BatchMastersAPI = {
  BatchMasters: (screenMenuId) => `${batchMastersBase()}batch-masters/batches/${screenMenuId}`,
  getBatch: (batchCode,screenMenuId) =>
    `${batchMastersBase()}batch-masters/batches/${screenMenuId}/${encodeURIComponent(batchCode)}`,
  ProcessMaster: (screenMenuId) => `${batchMastersBase()}batch-masters/processes/${screenMenuId}`,
  getProcess: (processId) =>
    `${batchMastersBase()}batch-masters/processes/${processId}`,

  PartitionMaster: (screenMenuId) => `${batchMastersBase()}batch-masters/partitions/${screenMenuId}`,
  /** Single bulk save: create / update / delete from grid delta. */
  listPartitionTypes: (screenMenuId) => `${batchMastersBase()}batch-masters/partition-types/EC-PartitionTypeMaster`,
  updatePartitionTypes: (screenMenuId) => `${batchMastersBase()}batch-masters/partition-types/${screenMenuId}`,

  getBatchProcess: (batchCode, processId) =>
    `${batchMastersBase()}batch-masters/batches/${encodeURIComponent(batchCode)}/processes/${processId}`,
  /** Single bulk save: deletes, creates, updates in one server transaction. */
  BatchProcesses: (batchCode,screenMenuId) =>
    `${batchMastersBase()}batch-masters/batches/${encodeURIComponent(batchCode)}/processes/${screenMenuId}`,
};

/** Run / retry / partition status — align with helix-batch-execution. */
export const BatchExecutionAPI = {
  BatchExecution: (screenMenuId) =>
    `${batchExecutionBase()}batch-execution/${screenMenuId}`,
  completedPartitions: (batchCode) =>
    `${batchExecutionBase()}batch-execution/completed/${encodeURIComponent(batchCode)}/partitions`,
  run: (batchCode) =>
    `${batchExecutionBase()}batch-execution/run/${encodeURIComponent(batchCode)}`,
  retry: (batchCode) =>
    `${batchExecutionBase()}batch-execution/retry/${encodeURIComponent(batchCode)}`,
  abort: (batchCode) =>
    `${batchExecutionBase()}batch-execution/abort/${encodeURIComponent(batchCode)}`,
  status: (batchCode) =>
    `${batchExecutionBase()}batch-execution/status/${encodeURIComponent(batchCode)}`,
};
