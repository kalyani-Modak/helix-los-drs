import { HAxiosService } from "@helix/component-library";
import { WorkflowRegistryAPI } from "../api/workflowRegistryApiEndpoints";
import { unwrapApiResponse } from "../utils/apiResponse";

export const INTERMEDIATE_CATCH_EVENT_TYPE = "bpmn:IntermediateCatchEvent";

/** Palette "System Activity" — same custom metadata fields as Intermediate Catch Event. */
export const SERVICE_TASK_TYPE = "bpmn:ServiceTask";

export const GATEWAY_ELEMENT_TYPES = [
  "bpmn:ExclusiveGateway",
  "bpmn:ParallelGateway",
  "bpmn:InclusiveGateway",
  "bpmn:EventBasedGateway",
  "bpmn:ComplexGateway"
];

export const INTERMEDIATE_CATCH_EVENT_FIELDS = [
  "activityName",
  "description",
  "stage",
  "systemActivity",
  "displayInSendBack",
  "displayInReinitiate",
  "retryCount",
  "retryInterval",
  "retryIntervalUnit",
  "failoverNotifyMode",
  "everyErrorNotifyUser",
  "finalErrorNotifyUser",
  "skipActivityOnFinalError",
  "skipNotifyUser"
];

/** Existing System Activity fields plus the Service Task email configuration. */
export const SERVICE_TASK_FIELDS = [
  ...INTERMEDIATE_CATCH_EVENT_FIELDS,
  "recipientEmail",
  "subject",
  "message"
];

export const GATEWAY_FIELDS = [
  "activityName",
  "description",
  "stage",
  "everyErrorNotifyUser"
];

export const CALL_ACTIVITY_TYPE = "bpmn:CallActivity";

export const CALL_ACTIVITY_FIELDS = [
  "activityName",
  "description",
  "stage",
  "systemReflowOnlyForChangedEntity"
];

export const USER_TASK_TYPE = "bpmn:UserTask";

export const USER_TASK_FIELDS = [
  "activityName",
  "description",
  "stage",
  "subStage",
  "userActivity",
  "cardId",
  "displayInSendBack",
  "displayInReinitiate",
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

export const USER_TASK_BOOLEAN_FIELDS = [
  "displayInSendBack",
  "displayInReinitiate",
  "allocateAsPerProcessingBuHierarchy",
  "allocateToSameUserOnReperform",
  "requiresApproval",
  "doNotPerform",
  "approvalOfCpa",
  "performSystemReflowOnDataChange",
  "emailApproval",
  "skipLevelsAllocateRequiredLevel",
  "notifyOwnerOnAllocation",
  "notifyUserOnReallocation",
  "notifyUserIfApprovalRequired",
  "notifyTeamMembersOnTeamAllocation",
  "notifyTeamMembersOnApprovalToTeam",
  "notifyReferredUser",
  "escalationEnabled",
  "escalationSendNotification",
  "escalationRepeatNotification"
];

export function isGatewayElementType(elementType) {
  return GATEWAY_ELEMENT_TYPES.includes(elementType);
}

export const EMPTY_GATEWAY_CONFIGURATION =
  GATEWAY_FIELDS.reduce((configuration, fieldName) => {
    configuration[fieldName] = "";
    return configuration;
  }, {});

export const EMPTY_CALL_ACTIVITY_CONFIGURATION =
  CALL_ACTIVITY_FIELDS.reduce((configuration, fieldName) => {
    if (fieldName === "systemReflowOnlyForChangedEntity") {
      configuration[fieldName] = false;
    } else {
      configuration[fieldName] = "";
    }
    return configuration;
  }, {});

export const EMPTY_USER_TASK_CONFIGURATION =
  USER_TASK_FIELDS.reduce((configuration, fieldName) => {
    if (USER_TASK_BOOLEAN_FIELDS.includes(fieldName)) {
      configuration[fieldName] = false;
    } else {
      configuration[fieldName] = "";
    }
    return configuration;
  }, {});

export const EMPTY_INTERMEDIATE_CATCH_EVENT_CONFIGURATION =
  INTERMEDIATE_CATCH_EVENT_FIELDS.reduce((configuration, fieldName) => {
    if (
      fieldName === "displayInSendBack"
      || fieldName === "displayInReinitiate"
      || fieldName === "skipActivityOnFinalError"
    ) {
      configuration[fieldName] = false;
    } else {
      configuration[fieldName] = "";
    }
    return configuration;
  }, {});

export const EMPTY_SERVICE_TASK_CONFIGURATION = {
  ...EMPTY_INTERMEDIATE_CATCH_EVENT_CONFIGURATION,
  recipientEmail: "",
  subject: "",
  message: ""
};

export const EMPTY_ACTIVITY_METADATA = {
  processId: "",
  activityConfiguration: { ...EMPTY_INTERMEDIATE_CATCH_EVENT_CONFIGURATION }
};

export async function getActivityMetadataForWorkflow(workflowName) {
  const response = await HAxiosService.GET(WorkflowRegistryAPI.activity_metadata(workflowName));
  return unwrapApiResponse(response, "Failed to load activity metadata");
}

export async function saveActivityCustomMetadata(workflowName, processId, activityId, metadata) {
  const response = await HAxiosService.PUT(
    WorkflowRegistryAPI.activity_metadata_update(workflowName, activityId),
    {
      processId,
      activityConfiguration: metadata.activityConfiguration
    }
  );
  return unwrapApiResponse(response, "Failed to save activity metadata");
}
