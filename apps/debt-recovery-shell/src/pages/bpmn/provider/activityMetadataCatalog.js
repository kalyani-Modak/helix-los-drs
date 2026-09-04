import {
  EMPTY_ACTIVITY_METADATA,
  EMPTY_CALL_ACTIVITY_CONFIGURATION,
  EMPTY_GATEWAY_CONFIGURATION,
  EMPTY_INTERMEDIATE_CATCH_EVENT_CONFIGURATION,
  EMPTY_SERVICE_TASK_CONFIGURATION,
  EMPTY_USER_TASK_CONFIGURATION,
  CALL_ACTIVITY_FIELDS,
  CALL_ACTIVITY_TYPE,
  GATEWAY_ELEMENT_TYPES,
  GATEWAY_FIELDS,
  INTERMEDIATE_CATCH_EVENT_FIELDS,
  INTERMEDIATE_CATCH_EVENT_TYPE,
  SERVICE_TASK_FIELDS,
  SERVICE_TASK_TYPE,
  USER_TASK_FIELDS,
  USER_TASK_TYPE,
  USER_TASK_BOOLEAN_FIELDS,
  isGatewayElementType,
  getActivityMetadataForWorkflow
} from "../../../services/activityMetadataService";
import {
  collectActivityConfigurationsFromModeler,
  writeActivityConfigurationToElement
} from "./bpmnActivityConfiguration.js";

const SAVE_DEBOUNCE_MS = 250;

let currentWorkflowName = "";
let fallbackWorkflowName = "";
/** @type {any} */
let modelerRef = null;
const metadataByActivityId = new Map();
const metadataListeners = new Set();
let loadPromise = null;
let loadedWorkflowName = "";

/** @type {Map<string, { processId: string, elementType: string, updates: Record<string, unknown> }>} */
const pendingByActivity = new Map();
const saveTimerByActivity = new Map();
const elementTypeByActivity = new Map();

const CONFIGURATION_FIELDS_BY_ELEMENT_TYPE = {
  [INTERMEDIATE_CATCH_EVENT_TYPE]: INTERMEDIATE_CATCH_EVENT_FIELDS,
  [SERVICE_TASK_TYPE]: SERVICE_TASK_FIELDS,
  [CALL_ACTIVITY_TYPE]: CALL_ACTIVITY_FIELDS,
  [USER_TASK_TYPE]: USER_TASK_FIELDS
};

GATEWAY_ELEMENT_TYPES.forEach((gatewayType) => {
  CONFIGURATION_FIELDS_BY_ELEMENT_TYPE[gatewayType] = GATEWAY_FIELDS;
});

export const ACTIVITY_CONFIGURATION_FIELDS = [
  ...INTERMEDIATE_CATCH_EVENT_FIELDS,
  ...GATEWAY_FIELDS.filter((field) => !INTERMEDIATE_CATCH_EVENT_FIELDS.includes(field)),
  ...CALL_ACTIVITY_FIELDS.filter((field) => !INTERMEDIATE_CATCH_EVENT_FIELDS.includes(field)),
  ...USER_TASK_FIELDS.filter((field) => !INTERMEDIATE_CATCH_EVENT_FIELDS.includes(field))
];

const BOOLEAN_CONFIGURATION_FIELDS = new Set([
  "displayInSendBack",
  "displayInReinitiate",
  "skipActivityOnFinalError",
  "systemReflowOnlyForChangedEntity",
  "allocateAsPerProcessingBuHierarchy",
  "allocateToSameUserOnReperform",
  ...USER_TASK_BOOLEAN_FIELDS
]);

export function getConfigurationFieldsForElementType(elementType) {
  return CONFIGURATION_FIELDS_BY_ELEMENT_TYPE[elementType] || [];
}

export function supportsCustomMetadataForElementType(elementType) {
  return getConfigurationFieldsForElementType(elementType).length > 0;
}

export function isActivityConfigurationField(fieldName) {
  return ACTIVITY_CONFIGURATION_FIELDS.includes(fieldName);
}

function getDefaultConfigurationForElementType(elementType) {
  if (elementType === INTERMEDIATE_CATCH_EVENT_TYPE) {
    return { ...EMPTY_INTERMEDIATE_CATCH_EVENT_CONFIGURATION };
  }
  if (elementType === SERVICE_TASK_TYPE) {
    return { ...EMPTY_SERVICE_TASK_CONFIGURATION };
  }
  if (elementType === CALL_ACTIVITY_TYPE) {
    return { ...EMPTY_CALL_ACTIVITY_CONFIGURATION };
  }
  if (elementType === USER_TASK_TYPE) {
    return { ...EMPTY_USER_TASK_CONFIGURATION };
  }
  if (isGatewayElementType(elementType)) {
    return { ...EMPTY_GATEWAY_CONFIGURATION };
  }
  return {};
}

function normalizeFieldValue(fieldName, value) {
  if (BOOLEAN_CONFIGURATION_FIELDS.has(fieldName)) {
    return value === true;
  }
  return value != null ? String(value) : "";
}

function normalizeConfiguration(configuration = {}, elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  const defaults = getDefaultConfigurationForElementType(elementType);
  const fields = getConfigurationFieldsForElementType(elementType);
  const normalized = { ...defaults };

  fields.forEach((fieldName) => {
    normalized[fieldName] = normalizeFieldValue(fieldName, configuration[fieldName]);
  });

  return normalized;
}

function normalizeMetadata(metadata = {}, elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  const configuration = metadata.activityConfiguration || metadata;
  return normalizeConfiguration(configuration, elementType);
}

export function buildActivityConfiguration(flatMetadata = {}, elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  return normalizeConfiguration(flatMetadata, elementType);
}

export function buildSavePayload(processId, flatMetadata = {}, elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  return {
    processId: processId || "",
    activityConfiguration: buildActivityConfiguration(flatMetadata, elementType)
  };
}

function emptyMetadata(elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  return normalizeMetadata(EMPTY_ACTIVITY_METADATA, elementType);
}

function getEffectiveWorkflowName() {
  return currentWorkflowName.trim() || fallbackWorkflowName.trim();
}

export function setActivityMetadataWorkflowName(name) {
  const trimmed = (name || "").trim();
  if (trimmed !== currentWorkflowName) {
    currentWorkflowName = trimmed;
    invalidateActivityMetadataCatalog();
  } else {
    currentWorkflowName = trimmed;
  }
}

export function setActivityMetadataFallbackWorkflowName(name) {
  fallbackWorkflowName = (name || "").trim();
}

/** Bind the live bpmn-js modeler so custom props write into the BPMN XML. */
export function setActivityMetadataModeler(modeler) {
  modelerRef = modeler || null;
}

/**
 * Load custom props from BPMN elements currently in the modeler.
 * Optionally merges legacy activity-metadata.json once when BPMN has no config yet.
 */
export function hydrateActivityMetadataFromBpmn(modeler = modelerRef) {
  if (!modeler) return;
  const fromBpmn = collectActivityConfigurationsFromModeler(modeler);
  fromBpmn.forEach(({ elementType, configuration }, activityId) => {
    setActivityMetadata(activityId, configuration, elementType || INTERMEDIATE_CATCH_EVENT_TYPE);
  });
  notifyMetadataListeners();
}

function notifyMetadataListeners() {
  metadataListeners.forEach((listener) => listener());
}

export function onActivityMetadataChanged(listener) {
  metadataListeners.add(listener);
  return () => metadataListeners.delete(listener);
}

export function invalidateActivityMetadataCatalog() {
  metadataByActivityId.clear();
  elementTypeByActivity.clear();
  pendingByActivity.clear();
  saveTimerByActivity.forEach((timer) => clearTimeout(timer));
  saveTimerByActivity.clear();
  loadPromise = null;
  loadedWorkflowName = "";
}

export function getActivityMetadata(activityId, elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  const resolvedElementType = elementType || elementTypeByActivity.get(activityId) || INTERMEDIATE_CATCH_EVENT_TYPE;
  const stored = metadataByActivityId.get(activityId);
  if (!stored) {
    return emptyMetadata(resolvedElementType);
  }
  return normalizeConfiguration(stored, resolvedElementType);
}

export function setActivityMetadata(activityId, metadata, elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  const configuration = metadata.activityConfiguration
    ? { ...metadata.activityConfiguration }
    : { ...metadata };
  const resolvedElementType = elementType || elementTypeByActivity.get(activityId) || INTERMEDIATE_CATCH_EVENT_TYPE;
  if (elementType) {
    elementTypeByActivity.set(activityId, elementType);
  }
  metadataByActivityId.set(activityId, configuration);
}

export function hasActivityMetadata(activityId, elementType = INTERMEDIATE_CATCH_EVENT_TYPE) {
  const metadata = getActivityMetadata(activityId, elementType);
  const fields = getConfigurationFieldsForElementType(
    elementTypeByActivity.get(activityId) || elementType
  );

  return fields.some((key) => {
    const value = metadata[key];
    if (typeof value === "boolean") {
      return value;
    }
    return Boolean(value);
  });
}

export async function ensureActivityMetadataLoaded(workflowName, options = {}) {
  const name = (workflowName || getEffectiveWorkflowName()).trim();
  const force = options.force === true;

  // Always prefer BPMN as source of truth when the modeler is available.
  if (modelerRef) {
    hydrateActivityMetadataFromBpmn(modelerRef);
  }

  if (!name) {
    return;
  }

  if (!force && loadedWorkflowName === name && !loadPromise) {
    return;
  }

  if (force || !loadPromise || loadedWorkflowName !== name) {
    const pendingSnapshot = new Map(pendingByActivity);

    loadPromise = getActivityMetadataForWorkflow(name)
      .then((records) => {
        // Migrate legacy JSON → BPMN only when the element has no los:activityConfiguration yet.
        (records || []).forEach((record) => {
          const activityId = record.activityId;
          if (!activityId) return;
          const inferredType = inferElementTypeFromConfiguration(record.activityConfiguration);
          const existing = metadataByActivityId.get(activityId);
          const hasBpmnConfig = existing && Object.keys(existing).some((k) => {
            const v = existing[k];
            return typeof v === "boolean" ? v : Boolean(v);
          });
          if (hasBpmnConfig) {
            return;
          }
          setActivityMetadata(activityId, record, inferredType);
          if (modelerRef) {
            const element = modelerRef.get("elementRegistry")?.get(activityId);
            if (element) {
              writeActivityConfigurationToElement(
                modelerRef,
                element,
                normalizeConfiguration(record.activityConfiguration || {}, inferredType)
              );
            }
          }
        });

        pendingSnapshot.forEach((pending, activityId) => {
          const elementType =
            pending.elementType ||
            elementTypeByActivity.get(activityId) ||
            INTERMEDIATE_CATCH_EVENT_TYPE;
          setActivityMetadata(
            activityId,
            {
              ...getActivityMetadata(activityId, elementType),
              ...pending.updates
            },
            elementType
          );
          pendingByActivity.set(activityId, pending);
          elementTypeByActivity.set(activityId, elementType);
        });

        if (modelerRef) {
          hydrateActivityMetadataFromBpmn(modelerRef);
        }

        loadedWorkflowName = name;
        notifyMetadataListeners();
      })
      .catch((error) => {
        const status = error?.response?.status;
        if (status === 404) {
          pendingSnapshot.forEach((pending, activityId) => {
            pendingByActivity.set(activityId, pending);
            elementTypeByActivity.set(activityId, pending.elementType);
            setActivityMetadata(activityId, pending.updates, pending.elementType);
          });
          loadedWorkflowName = name;
          notifyMetadataListeners();
          return;
        }
        // BPMN hydrate already ran — treat registry miss as non-fatal.
        console.warn("Legacy activity-metadata load skipped:", error?.message || error);
        loadedWorkflowName = name;
        notifyMetadataListeners();
      })
      .finally(() => {
        loadPromise = null;
      });
  }

  return loadPromise;
}

function hasIceSpecificConfiguration(configuration = {}) {
  const iceOnlyFields = [
    "systemActivity",
    "displayInSendBack",
    "displayInReinitiate",
    "retryCount",
    "retryInterval",
    "retryIntervalUnit",
    "failoverNotifyMode",
    "finalErrorNotifyUser",
    "skipActivityOnFinalError",
    "skipNotifyUser"
  ];

  return iceOnlyFields.some((fieldName) => {
    const value = configuration[fieldName];
    if (typeof value === "boolean") {
      return value;
    }
    return Boolean(value && String(value).trim());
  });
}

function hasUserTaskSpecificConfiguration(configuration = {}) {
  const userTaskOnlyFields = [
    "subStage",
    "userActivity",
    "cardId",
    "allocationMode",
    "allocateToUserWhoDidActivity",
    "searchAllocateRole",
    "searchAllocateLevel",
    "doNotAllocateToUserWhoDid",
    "allocateAsPerProcessingBuHierarchy",
    "allocateToSameUserOnReperform",
    "requiresApproval",
    "doNotPerform",
    "approvalOfCpa",
    "performSystemReflowOnDataChange",
    "approvalLevelSource",
    "approvalFromLevel",
    "approvalRoleLevel",
    "emailApproval",
    "emailFromLevelAndAbove",
    "emailTemplate",
    "skipLevelsAllocateRequiredLevel",
    "notifyOwnerOnAllocation",
    "notifyOwnerOnAllocationTemplate",
    "notifyUserOnReallocation",
    "notifyUserOnReallocationTemplate",
    "notifyUserIfApprovalRequired",
    "notifyUserIfApprovalRequiredTemplate",
    "notifyTeamMembersOnTeamAllocation",
    "notifyTeamMembersOnTeamAllocationTemplate",
    "notifyTeamMembersOnApprovalToTeam",
    "notifyTeamMembersOnApprovalToTeamTemplate",
    "notifyReferredUser",
    "notifyReferredUserTemplate",
    "escalationEnabled",
    "escalationAfterValue",
    "escalationAfterUnit",
    "escalationSendNotification",
    "escalationRepeatNotification",
    "escalationRepeatEveryValue",
    "escalationRepeatEveryUnit"
  ];

  return userTaskOnlyFields.some((fieldName) => {
    const value = configuration[fieldName];
    if (typeof value === "boolean") {
      return value;
    }
    return Boolean(value && String(value).trim());
  });
}

function inferElementTypeFromConfiguration(configuration = {}) {
  if (hasIceSpecificConfiguration(configuration)) {
    return INTERMEDIATE_CATCH_EVENT_TYPE;
  }

  if (configuration.systemReflowOnlyForChangedEntity !== undefined) {
    return CALL_ACTIVITY_TYPE;
  }

  if (hasUserTaskSpecificConfiguration(configuration)) {
    return USER_TASK_TYPE;
  }

  const hasGatewayData = GATEWAY_FIELDS.some((fieldName) => {
    const value = configuration[fieldName];
    return Boolean(value && String(value).trim());
  });

  if (hasGatewayData) {
    return GATEWAY_ELEMENT_TYPES[0];
  }

  return INTERMEDIATE_CATCH_EVENT_TYPE;
}

async function flushActivityMetadataSave(activityId) {
  if (!activityId) {
    throw new Error("Cannot save activity metadata without an activity id.");
  }

  const pending = pendingByActivity.get(activityId);
  if (!pending) {
    return null;
  }

  pendingByActivity.delete(activityId);

  const resolvedElementType =
    pending.elementType ||
    elementTypeByActivity.get(activityId) ||
    INTERMEDIATE_CATCH_EVENT_TYPE;

  const current = getActivityMetadata(activityId, resolvedElementType);
  const nextFlat = {
    ...current,
    ...pending.updates
  };
  const normalized = normalizeConfiguration(nextFlat, resolvedElementType);

  setActivityMetadata(activityId, normalized, resolvedElementType);

  if (!modelerRef) {
    console.warn("No BPMN modeler bound — custom properties kept in memory until Save.");
    notifyMetadataListeners();
    return normalized;
  }

  const element = modelerRef.get("elementRegistry")?.get(activityId);
  if (!element) {
    console.warn(`BPMN element ${activityId} not found for custom properties write.`);
    notifyMetadataListeners();
    return normalized;
  }

  writeActivityConfigurationToElement(modelerRef, element, normalized);
  notifyMetadataListeners();
  return normalized;
}

function scheduleActivityMetadataSave(activityId) {
  const existingTimer = saveTimerByActivity.get(activityId);
  if (existingTimer) {
    clearTimeout(existingTimer);
  }

  const timer = setTimeout(() => {
    saveTimerByActivity.delete(activityId);
    flushActivityMetadataSave(activityId).catch((error) => {
      console.error("Failed to flush activity metadata into BPMN:", error);
    });
  }, SAVE_DEBOUNCE_MS);

  saveTimerByActivity.set(activityId, timer);
}

/**
 * Flush all debounced custom-property edits into the BPMN model
 * before Designer Save / Deploy exports XML.
 */
export async function flushAllPendingActivityMetadataSaves() {
  saveTimerByActivity.forEach((timer) => clearTimeout(timer));
  saveTimerByActivity.clear();

  const activityIds = [...pendingByActivity.keys()];
  for (const activityId of activityIds) {
    await flushActivityMetadataSave(activityId);
  }
}

export async function persistActivityMetadata(
  processId,
  activityId,
  updates,
  elementType = INTERMEDIATE_CATCH_EVENT_TYPE
) {
  if (!activityId) {
    console.warn("Cannot save activity metadata without an activity id.");
    throw new Error("Activity id is missing.");
  }

  if (!supportsCustomMetadataForElementType(elementType)) {
    return;
  }

  elementTypeByActivity.set(activityId, elementType);

  const existingPending = pendingByActivity.get(activityId);
  pendingByActivity.set(activityId, {
    processId: processId || existingPending?.processId || "",
    elementType,
    updates: {
      ...(existingPending?.updates || {}),
      ...updates
    }
  });

  setActivityMetadata(
    activityId,
    {
      ...getActivityMetadata(activityId, elementType),
      ...updates
    },
    elementType
  );
  notifyMetadataListeners();

  scheduleActivityMetadataSave(activityId);
}

export { EMPTY_INTERMEDIATE_CATCH_EVENT_CONFIGURATION as EMPTY_ACTIVITY_CONFIGURATION };
