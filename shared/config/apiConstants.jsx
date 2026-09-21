
import AppConfig from './AppConfig';

export function getBaseApiPath() {
  return AppConfig.get('BASE_API_PATH') || import.meta.env.VITE_BASE_API_PATH;
}

export function getKeycloakApiPath() {
  return AppConfig.get('BASE_KEYCLOAK_API_PATH') || import.meta.env.VITE_BASE_KEYCLOAK_API_PATH;
}

export function getRuleEngineApiPath() {
  return AppConfig.get('BASE_RULEENINGE_API_PATH') || import.meta.env.VITE_BASE_RULEENINGE_API_PATH;
}

export function getHelixEarlyCollectionsApiPath() {
  return AppConfig.get('BASE_HELIX_EARLY_COLLECTIONS_API_PATH') || import.meta.env.VITE_BASE_HELIX_EARLY_COLLECTIONS_API_PATH;
}

export function getAiPredictApiPath() {
  return AppConfig.get('BASE_AI_PREDICT_API_PATH') || import.meta.env.VITE_BASE_AI_PREDICT_API_PATH;
}

export function getUtilityApiPath() {
  return AppConfig.get('BASE_UTILITY_API_PATH') || import.meta.env.VITE_BASE_UTILITY_API_PATH;
}

/** Dialer service origin (trailing slash optional). */
export function getDialerApiPath() {
  const raw = AppConfig.get('BASE_DIALER_API_PATH') || import.meta.env.VITE_BASE_DIALER_API_PATH;
  if (raw == null || String(raw).trim() === '') {
    return '';
  }
  const s = String(raw).trim();
  return s.endsWith('/') ? s : `${s}/`;
}

/** Helix DMS service origin (trailing slash optional). Append `v1/api/...` for REST paths. */
export function getDmsApiPath() {
  const raw = AppConfig.get('BASE_DMS_API_PATH') || import.meta.env.VITE_BASE_DMS_API_PATH;
  if (raw == null || String(raw).trim() === '') {
    return '';
  }
  const s = String(raw).trim();
  return s.endsWith('/') ? s : `${s}/`;
}

export function getIntegrationFrameworkApiPath() {
  return AppConfig.get('BASE_INTEGRATION_FRAMEWORK_API_PATH') || import.meta.env.VITE_BASE_INTEGRATION_FRAMEWORK_API_PATH;
}

export function getAllocationApiPath() {
  return AppConfig.get('BASE_ALLOCATION_API_PATH') ||import.meta.env.VITE_BASE_ALLOCATION_API_PATH;
}

export function getCommonMasterApiPath() {
  return AppConfig.get('BASE_COMMON_MASTER_API_PATH') || import.meta.env.VITE_BASE_COMMON_MASTER_API_PATH;
}

/** Workflow Registry — master-service (workflow definitions: draft, save, list, deploy, activate). */
export function getWorkflowMasterApiPath() {
  return AppConfig.get('BASE_WORKFLOW_MASTER_API_PATH') || import.meta.env.VITE_BASE_WORKFLOW_MASTER_API_PATH;
}

/** Workflow Registry — workflow-registry service (registry sync, activity metadata, BPMN XSD validation). */
export function getWorkflowRegistryApiPath() {
  return AppConfig.get('BASE_WORKFLOW_REGISTRY_API_PATH') || import.meta.env.VITE_BASE_WORKFLOW_REGISTRY_API_PATH;
}

/** LOS application entry — transaction-service (save draft / submit application, starts the BPMN process instance). */
export function getLosApplicationApiPath() {
  return AppConfig.get('BASE_LOS_APPLICATION_API_PATH') || import.meta.env.VITE_BASE_LOS_APPLICATION_API_PATH;
}

/** LOS quick data entry — application-entry service (draft / submit / KYC verification / pincode lookup). */
export function getLosQdeApiPath() {
  return (AppConfig.get('BASE_LOS_QDE_API_PATH') ||import.meta.env.VITE_BASE_LOS_QDE_API_PATH );
}

export function getHelixBatchMastersApiPath() {
  return (
    AppConfig.get('BASE_HELIX_BATCH_MASTERS_API_PATH') ||
    import.meta.env.VITE_BASE_HELIX_BATCH_MASTERS_API_PATH
  );
}

/** Batch execution service (run / retry / status), e.g. helix-batch-execution app origin. */
export function getHelixBatchExecutionApiPath() {
  return (
    AppConfig.get('BASE_HELIX_BATCH_EXECUTION_API_PATH') ||
    import.meta.env.VITE_BASE_HELIX_BATCH_EXECUTION_API_PATH ||
    ''
  );
}
export const SEARCH_API_ENDPOINTS = {
  COMMON_MASTER: () =>
    `${getCommonMasterApiPath()}common/fetch-search-common-data`,

  EARLY_COLLECTIONS: () =>
    `${getHelixEarlyCollectionsApiPath()}common/fetch-search-common-data`,

  ALLOCATION: () =>
    `${getAllocationApiPath()}common/fetch-search-common-data`,

  BATCH_FRAMEWORK: () =>
    `${getHelixBatchMastersApiPath()}common/fetch-search-common-data`,
};
