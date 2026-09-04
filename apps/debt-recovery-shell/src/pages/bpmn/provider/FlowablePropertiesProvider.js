import { html } from "htm/preact";
import { useEffect, useState } from "@bpmn-io/properties-panel/preact/hooks";
import {
  Group,
  ListGroup,
  SelectEntry,
  TextAreaEntry,
  TextFieldEntry,
  CheckboxEntry,
  isSelectEntryEdited,
  isTextAreaEntryEdited,
  isTextFieldEntryEdited,
  isCheckboxEntryEdited
} from "@bpmn-io/properties-panel";
import { is, isAny } from "bpmn-js/lib/util/ModelUtil";
import { useService } from "bpmn-js-properties-panel";
import { fetchWorkflowOptions } from "./workflowCatalog.js";
import {
  ensureActivityMetadataLoaded,
  getActivityMetadata,
  hasActivityMetadata,
  onActivityMetadataChanged,
  persistActivityMetadata
} from "./activityMetadataCatalog.js";

// bpmn-js-properties-panel's EventBus fires HIGHER priority listeners first.
// The core BpmnPropertiesProvider registers with no explicit priority, which
// defaults to 1000. To run AFTER it (so "general" / "message" groups already
// exist when we append Custom properties), use a LOWER number than 1000.
const RUN_AFTER_CORE_PROVIDER_PRIORITY = 50;
const DEFAULT_TASK_LISTENER_CLASS = "autoClaimListener";

const INTERMEDIATE_CATCH_EVENT_TYPE = "bpmn:IntermediateCatchEvent";

const GATEWAY_ELEMENT_TYPES = [
  "bpmn:ExclusiveGateway",
  "bpmn:ParallelGateway",
  "bpmn:InclusiveGateway",
  "bpmn:EventBasedGateway",
  "bpmn:ComplexGateway"
];

/** System Activity (Service Task) intentionally omitted — MI is not offered in the designer UI. */
const MULTI_INSTANCE_ACTIVITY_TYPES = [
  "bpmn:UserTask",
  "bpmn:ScriptTask",
  "bpmn:SendTask",
  "bpmn:BusinessRuleTask",
  "bpmn:ManualTask",
  "bpmn:ReceiveTask",
  "bpmn:SubProcess",
  "bpmn:CallActivity"
];

const EXECUTION_CAPABLE_ELEMENT_TYPES = [
  "bpmn:StartEvent",
  "bpmn:EndEvent",
  "bpmn:IntermediateCatchEvent",
  "bpmn:IntermediateThrowEvent",
  "bpmn:BoundaryEvent",
  "bpmn:ExclusiveGateway",
  "bpmn:ParallelGateway",
  "bpmn:InclusiveGateway",
  "bpmn:EventBasedGateway",
  "bpmn:ComplexGateway",
  "bpmn:UserTask",
  "bpmn:ServiceTask",
  "bpmn:SendTask",
  "bpmn:ReceiveTask",
  "bpmn:ManualTask",
  "bpmn:BusinessRuleTask",
  "bpmn:ScriptTask",
  "bpmn:Task",
  "bpmn:CallActivity",
  "bpmn:SubProcess",
  "bpmn:Transaction",
  "bpmn:AdHocSubProcess"
];

function FlowablePropertiesProvider(propertiesPanel, modeling, moddle, translate) {
  this.getGroups = function (element) {
    return function (groups) {
      groups = groups.filter((group) => group.id !== "documentation");

      injectNameIdRowIntoGeneral(groups, element);

      if (!is(element, "bpmn:SequenceFlow")) {
        injectMessageFieldsRow(groups, element);
      }

      if (is(element, "bpmn:SequenceFlow")) {
        groups.push(
          createGroup(
            element,
            "flowable-sequence-flow",
            "Sequence flow",
            sequenceFlowEntries(element),
            translate,
            true
          )
        );
      }

      if (is(element, "bpmn:CallActivity")) {
        injectCalledWorkflowIntoGeneral(groups, element);
        groups.push(
          createGroup(element, "flowable-call-activity", "Call activity", callActivityEntries(element))
        );

        // Passing the multi-instance elementVariable (or any other parent
        // variable) into the launched child process instance requires an
        // explicit <flowable:in>/<flowable:out> mapping — Flowable does not
        // auto-share parent variables with the child by default.
        groups.push(inOutParameterGroup(element, modeling, moddle, translate, "flowable:In", "flowable-in-parameters", "In parameters", "in"));
        groups.push(inOutParameterGroup(element, modeling, moddle, translate, "flowable:Out", "flowable-out-parameters", "Out parameters", "out"));
      }

      if (supportsExecutionProperties(element)) {
        injectExecutionFieldsIntoGeneral(groups, element);
      }

      if (is(element, "bpmn:UserTask")) {
        groups.push(createGroup(element, "flowable-user-task", "Flowable", userTaskEntries(element)));
      }

      if (is(element, "bpmn:ServiceTask")) {
        groups.push(
          createGroup(
            element,
            "flowable-service-task-email",
            "Email Configuration",
            serviceTaskEmailEntries(element),
            translate,
            true
          )
        );
      }

      if (supportsIntermediateCatchEventCustomMetadata(element)) {
        appendCustomMetadataGroup(
          groups,
          element,
          translate,
          createIntermediateCatchEventCustomMetadataEntries(element)
        );
      }

      if (supportsServiceTaskCustomMetadata(element)) {
        appendCustomMetadataGroup(
          groups,
          element,
          translate,
          createServiceTaskCustomMetadataEntries(element)
        );
      }

      if (supportsGatewayCustomMetadata(element)) {
        appendCustomMetadataGroup(
          groups,
          element,
          translate,
          createGatewayCustomMetadataEntries(element)
        );
      }

      if (supportsCallActivityCustomMetadata(element)) {
        appendCustomMetadataGroup(
          groups,
          element,
          translate,
          createCallActivityCustomMetadataEntries(element)
        );
      }

      if (supportsUserTaskCustomMetadata(element)) {
        appendCustomMetadataGroup(
          groups,
          element,
          translate,
          createUserTaskCustomMetadataEntries(element)
        );
      }

      // Always strip the core bpmn-js Multi-instance group for System Activity
      // (Service Task); we do not expose MI for that element type.
      if (is(element, "bpmn:ServiceTask") || supportsMultiInstance(element)) {
        groups = groups.filter((group) => group.id !== "multiInstance");
      }

      if (supportsMultiInstance(element)) {
        // Replace the core panel's own "multiInstance" group with a friendlier,
        // Flowable-correct version (Loop Cardinality / Completion Condition).
        groups.push(
          createGroup(
            element,
            "flowable-multi-instance",
            "Multi-instance (for each)",
            multiInstanceEntries(element)
          )
        );
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(RUN_AFTER_CORE_PROVIDER_PRIORITY, this);
}

FlowablePropertiesProvider.$inject = ["propertiesPanel", "modeling", "moddle", "translate"];

function createGroup(element, id, label, entries, translate, shouldOpen = false) {
  return {
    id,
    label: translate ? translate(label) : label,
    element,
    entries,
    component: Group,
    shouldOpen
  };
}

function supportsIntermediateCatchEventCustomMetadata(element) {
  return is(element, INTERMEDIATE_CATCH_EVENT_TYPE);
}

function supportsServiceTaskCustomMetadata(element) {
  return is(element, "bpmn:ServiceTask");
}

function supportsGatewayCustomMetadata(element) {
  return isAny(element, GATEWAY_ELEMENT_TYPES);
}

function supportsCallActivityCustomMetadata(element) {
  return is(element, "bpmn:CallActivity");
}

function supportsUserTaskCustomMetadata(element) {
  return is(element, "bpmn:UserTask");
}

function getSequenceFlowConditionExpression(element) {
  return element.businessObject?.conditionExpression?.body || "";
}

function isSequenceFlowDefault(element) {
  const source = element.businessObject?.sourceRef;
  return source?.default?.id === element.businessObject?.id;
}

function supportsSequenceFlowDefault(element) {
  const source = element.source;
  if (!source) {
    return false;
  }

  return isAny(source, [
    "bpmn:ExclusiveGateway",
    "bpmn:InclusiveGateway",
    "bpmn:ComplexGateway",
    "bpmn:UserTask",
    "bpmn:ServiceTask",
    "bpmn:SendTask",
    "bpmn:ReceiveTask",
    "bpmn:ManualTask",
    "bpmn:BusinessRuleTask",
    "bpmn:ScriptTask",
    "bpmn:Task",
    "bpmn:CallActivity",
    "bpmn:SubProcess"
  ]);
}

function sequenceFlowEntries(element) {
  return [
    {
      id: "flowable-sequence-flow-condition",
      element,
      component: SequenceFlowConditionExpression,
      isEdited: isSequenceFlowConditionEdited
    },
    {
      id: "flowable-sequence-flow-default",
      element,
      component: SequenceFlowDefaultFlowCheckbox,
      isEdited: isSequenceFlowDefaultEdited
    }
  ];
}

function isSequenceFlowConditionEdited(_node, _entry, element) {
  return Boolean(getSequenceFlowConditionExpression(element).trim());
}

function isSequenceFlowDefaultEdited(_node, _entry, element) {
  return isSequenceFlowDefault(element);
}

function supportsExecutionProperties(element) {
  return isAny(element, EXECUTION_CAPABLE_ELEMENT_TYPES);
}

function injectExecutionFieldsIntoGeneral(groups, element) {
  const generalGroup = groups.find((group) => group.id === "general");
  if (!generalGroup) {
    return;
  }

  if (generalGroup.entries.some((entry) => entry.id === "flowable-execution-row")) {
    return;
  }

  const entries = [
    {
      id: "flowable-execution-row",
      element,
      component: ExecutionFieldsRow
    }
  ];

  const insertAt = findGeneralGroupInsertIndex(generalGroup);
  generalGroup.entries.splice(insertAt, 0, ...entries);
}

/** Move System Activity (Service Task) Flowable fields into the General group. */
function injectServiceTaskFieldsIntoGeneral(groups, element) {
  const generalGroup = groups.find((group) => group.id === "general");
  if (!generalGroup) {
    return;
  }

  if (generalGroup.entries.some((entry) => entry.id === "flowable-service-task-type-topic-row")) {
    return;
  }

  const entries = serviceTaskEntries(element);

  // Prefer placing after Execution so General reads: Name / Id / Execution / Type…
  const executionIndex = generalGroup.entries.findIndex((entry) => entry.id === "flowable-execution-row");
  const insertAt =
    executionIndex >= 0 ? executionIndex + 1 : findGeneralGroupInsertIndex(generalGroup);
  generalGroup.entries.splice(insertAt, 0, ...entries);
}

function findGeneralGroupInsertIndex(generalGroup) {
  const anchorIds = ["flowable-called-workflow", "flowable-name-id-row", "id", "name"];

  for (const anchorId of anchorIds) {
    const index = generalGroup.entries.findIndex((entry) => entry.id === anchorId);
    if (index >= 0) {
      return index + 1;
    }
  }

  return generalGroup.entries.length;
}

function ExecutionFieldsRow(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const moddle = useService("moddle");
  const translate = useService("translate");

  const renderCheckbox = (property, label) => {
    const attrName = `flowable:${property}`;
    const checked = element.businessObject.get(attrName) === true;

    const onChange = (event) => {
      modeling.updateProperties(element, {
        [attrName]: event.target.checked ? true : undefined
      });
    };

    return html`<label class="flowable-inline-checkbox">
      <input type="checkbox" checked=${checked} onChange=${onChange} />
      <span>${translate(label)}</span>
    </label>`;
  };

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <span class="flowable-panel-row__heading">${translate("Execution")}</span>
    ${renderCheckbox("asyncBefore", "Async before")}
    ${renderCheckbox("asyncAfter", "Async after")}
    ${renderCheckbox("exclusive", "Exclusive")}
    ${is(element, "bpmn:UserTask")
      ? html`<${TaskListenerEntry}
          element=${element}
          modeling=${modeling}
          moddle=${moddle}
          translate=${translate}
        />`
      : null}
  </div>`;
}

function getManagedTaskListeners(element) {
  const extensionElements = getExtensionElements(element);
  return (extensionElements?.get("values") || []).filter(
    (value) =>
      value.$type === "flowable:TaskListener" &&
      value.event === "create" &&
      Boolean(value.delegateExpression)
  );
}

function updateTaskListeners(modeling, moddle, element, enabled, delegateName) {
  const extensionElements = enabled
    ? ensureExtensionElements(modeling, moddle, element)
    : getExtensionElements(element);
  if (!extensionElements) {
    return;
  }

  const values = extensionElements.get("values") || [];
  const managedListeners = getManagedTaskListeners(element);
  const delegateExpression = `\${${delegateName || DEFAULT_TASK_LISTENER_CLASS}}`;

  if (enabled) {
    const listener = managedListeners[0] || moddle.create("flowable:TaskListener", {
      event: "create",
      delegateExpression
    });
    modeling.updateModdleProperties(element, listener, {
      event: "create",
      delegateExpression
    });
    const retainedValues = values.filter((value) => !managedListeners.includes(value));
    modeling.updateModdleProperties(element, extensionElements, {
      values: [...retainedValues, listener]
    });
    return;
  }

  modeling.updateModdleProperties(element, extensionElements, {
    values: values.filter((value) => !managedListeners.includes(value))
  });
}

function TaskListenerEntry(props) {
  const { element, id, modeling, moddle, translate } = props;
  const [checked, setChecked] = useState(getManagedTaskListeners(element).length > 0);
  const [delegateName, setDelegateName] = useState(
    getManagedTaskListeners(element)[0]?.delegateExpression?.replace(/^\$\{(.*)\}$/, "$1") ||
      DEFAULT_TASK_LISTENER_CLASS
  );
  const debounce = useService("debounceInput");

  const onCheckedChange = (event) => {
    const nextChecked = event.target.checked;
    setChecked(nextChecked);
    updateTaskListeners(modeling, moddle, element, nextChecked, delegateName);
  };

  const onDelegateNameChange = (value) => {
    setDelegateName(value);
    if (checked) {
      updateTaskListeners(modeling, moddle, element, true, value);
    }
  };

  return html`<div class="flowable-task-listener-entry">
    <label class="flowable-inline-checkbox">
      <input type="checkbox" checked=${checked} onChange=${onCheckedChange} />
      <span>${translate("Task Listener")}</span>
    </label>
    ${checked
      ? html`<${TextFieldEntry}
          id=${`${id}-class`}
          element=${element}
          label=${translate("Task Listener Class")}
          getValue=${() => delegateName}
          setValue=${onDelegateNameChange}
          debounce=${debounce}
        />`
      : null}
  </div>`;
}

function createIntermediateCatchEventCustomMetadataEntries(element) {
  return [
    {
      id: "flowable-custom-activity-identity",
      element,
      component: CustomActivityIdentityRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-custom-stage",
      element,
      component: CustomStageSelect,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-activity-configuration-label",
      element,
      component: ActivityConfigurationSectionLabel
    },
    {
      id: "flowable-custom-activity-config",
      element,
      component: CustomActivityConfigRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-failover-action",
      element,
      component: CustomFailoverActionPanel,
      isEdited: isCustomMetadataEdited
    }
  ];
}

/** System Activity uses the same Custom properties fields as Intermediate Catch Event. */
function createServiceTaskCustomMetadataEntries(element) {
  return createIntermediateCatchEventCustomMetadataEntries(element);
}

function createGatewayCustomMetadataEntries(element) {
  return [
    {
      id: "flowable-custom-activity-identity",
      element,
      component: CustomActivityIdentityRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-custom-stage",
      element,
      component: CustomStageSelect,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-gateway-failover-action",
      element,
      component: CustomGatewayFailoverActionPanel,
      isEdited: isCustomMetadataEdited
    }
  ];
}

function createCallActivityCustomMetadataEntries(element) {
  return [
    {
      id: "flowable-custom-activity-identity",
      element,
      component: CustomActivityIdentityRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-custom-stage",
      element,
      component: CustomStageSelect,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-call-activity-system-reflow",
      element,
      component: CustomCallActivitySystemReflowRow,
      isEdited: isCustomMetadataEdited
    }
  ];
}

function createUserTaskCustomMetadataEntries(element) {
  return [
    {
      id: "flowable-custom-activity-identity",
      element,
      component: CustomActivityIdentityRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-user-task-stage-sub-stage",
      element,
      component: CustomUserTaskStageSubStageRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-user-task-user-activity-card",
      element,
      component: CustomUserTaskUserActivityCardIdRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-user-task-display-flags",
      element,
      component: CustomUserTaskDisplayFlagsRow,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-allocation-configuration-label",
      element,
      component: AllocationConfigurationSectionLabel
    },
    {
      id: "flowable-user-task-allocation",
      element,
      component: CustomUserTaskAllocationPanel,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-approval-configuration-label",
      element,
      component: ApprovalConfigurationSectionLabel
    },
    {
      id: "flowable-user-task-approval",
      element,
      component: CustomUserTaskApprovalConfigurationPanel,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-user-task-email-approval",
      element,
      component: CustomUserTaskEmailApprovalPanel,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-notifications-label",
      element,
      component: NotificationsSectionLabel
    },
    {
      id: "flowable-user-task-notifications",
      element,
      component: CustomUserTaskNotificationsPanel,
      isEdited: isCustomMetadataEdited
    },
    {
      id: "flowable-user-task-escalation",
      element,
      component: CustomUserTaskEscalationPanel,
      isEdited: isCustomMetadataEdited
    }
  ];
}

function appendCustomMetadataGroup(groups, element, translate, entries) {
  if (groups.some((group) => group.id === "flowable-custom-metadata")) {
    return;
  }

  const customGroup = createGroup(
    element,
    "flowable-custom-metadata",
    "Custom properties",
    entries,
    translate,
    true
  );

  const preferredAfter = [
    "flowable-out-parameters",
    "flowable-in-parameters",
    "flowable-call-activity",
    "flowable-user-task",
    "message",
    "documentation",
    "general"
  ];

  for (const groupId of preferredAfter) {
    const index = groups.findIndex((group) => group.id === groupId);
    if (index >= 0) {
      groups.splice(index + 1, 0, customGroup);
      return;
    }
  }

  groups.push(customGroup);
}

function injectCalledWorkflowIntoGeneral(groups, element) {
  const generalGroup = groups.find((group) => group.id === "general");
  if (!generalGroup) {
    return;
  }

  const entry = {
    id: "flowable-called-workflow",
    element,
    component: CalledWorkflowSelect,
    isEdited: isSelectEntryEdited
  };

  const idIndex = generalGroup.entries.findIndex(
    (item) => item.id === "flowable-name-id-row" || item.id === "id"
  );
  const insertAt = idIndex >= 0 ? idIndex + 1 : generalGroup.entries.length;
  generalGroup.entries.splice(insertAt, 0, entry);
}

function injectNameIdRowIntoGeneral(groups, element) {
  const generalGroup = groups.find((group) => group.id === "general");
  if (!generalGroup) {
    return;
  }

  if (generalGroup.entries.some((entry) => entry.id === "flowable-name-id-row")) {
    return;
  }

  const nameIndex = generalGroup.entries.findIndex((entry) => entry.id === "name");
  const idIndex = generalGroup.entries.findIndex((entry) => entry.id === "id");

  // Nothing to combine (e.g. element type has no name/id entries in "general").
  if (nameIndex < 0 && idIndex < 0) {
    return;
  }

  const insertAt = Math.min(
    ...[nameIndex, idIndex].filter((index) => index >= 0)
  );

  // Remove the core panel's separate "name" and "id" rows; we render both
  // in a single combined row below instead.
  generalGroup.entries = generalGroup.entries.filter(
    (entry) => entry.id !== "name" && entry.id !== "id"
  );

  generalGroup.entries.splice(insertAt, 0, {
    id: "flowable-name-id-row",
    element,
    component: NameIdRow,
    isEdited: isTextFieldEntryEdited
  });
}

function NameIdRow(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");

  const businessObject = element.businessObject;
  const name = businessObject.get("name") || "";
  const elementId = element.id || "";

  const onChangeName = (event) => {
    modeling.updateProperties(element, { name: event.target.value });
  };

  const onChangeId = (event) => {
    const value = event.target.value.trim();
    if (!value || value === elementId) {
      return;
    }
    modeling.updateProperties(element, { id: value });
  };

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-name`}>
        ${translate("Name")}
      </label>
      <input
        id=${`${id}-name`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${name}
        onInput=${onChangeName}
      />
    </div>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-id`}>
        ${translate("Id")}
      </label>
      <input
        id=${`${id}-id`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${elementId}
        onChange=${onChangeId}
      />
    </div>
  </div>`;
}

const MESSAGE_EMPTY_OPTION = "";
const MESSAGE_CREATE_NEW_OPTION = "create-new";

function supportsMessageFields(element) {
  return (
    is(element, "bpmn:ReceiveTask")
    || (isAny(element, [
      "bpmn:StartEvent",
      "bpmn:EndEvent",
      "bpmn:IntermediateThrowEvent",
      "bpmn:BoundaryEvent",
      "bpmn:IntermediateCatchEvent"
    ]) && !!getMessageEventDefinition(element))
  );
}

function getEventDefinition(element, eventType) {
  const businessObject = element.businessObject;
  const eventDefinitions = businessObject.get("eventDefinitions") || [];
  return eventDefinitions.find((definition) => is(definition, eventType));
}

function getMessageEventDefinition(element) {
  if (is(element, "bpmn:ReceiveTask")) {
    return element.businessObject;
  }
  return getEventDefinition(element, "bpmn:MessageEventDefinition");
}

function getLinkedMessage(element) {
  const messageEventDefinition = getMessageEventDefinition(element);
  return messageEventDefinition && messageEventDefinition.get("messageRef");
}

function getDefinitionsRoot(businessObject) {
  let parent = businessObject;
  while (parent.$parent) {
    parent = parent.$parent;
  }
  return parent;
}

function findMessages(businessObject) {
  const root = getDefinitionsRoot(businessObject);
  const rootElements = root.get("rootElements") || [];
  return rootElements.filter((item) => is(item, "bpmn:Message"));
}

function findMessageById(businessObject, id) {
  return findMessages(businessObject).find((message) => message.id === id);
}

function nextMessageId() {
  return `Message_${Date.now().toString(36)}`;
}

function injectMessageFieldsRow(groups, element) {
  const messageGroup = groups.find((group) => group.id === "message");
  if (!messageGroup || !supportsMessageFields(element)) {
    return;
  }

  if (messageGroup.entries.some((entry) => entry.id === "flowable-message-row")) {
    return;
  }

  messageGroup.entries = messageGroup.entries.filter(
    (entry) => entry.id !== "messageRef" && entry.id !== "messageName"
  );

  messageGroup.entries.unshift({
    id: "flowable-message-row",
    element,
    component: MessageFieldsRow,
    isEdited: isSelectEntryEdited
  });
}

function MessageFieldsRow(props) {
  const { element, id } = props;
  const bpmnFactory = useService("bpmnFactory");
  const commandStack = useService("commandStack");
  const translate = useService("translate");
  const messageEventDefinition = getMessageEventDefinition(element);
  const linkedMessage = getLinkedMessage(element);

  const getMessageRefValue = () => {
    if (linkedMessage) {
      return linkedMessage.get("id");
    }
    return MESSAGE_EMPTY_OPTION;
  };

  const getMessageOptions = () => {
    const options = [
      { value: MESSAGE_EMPTY_OPTION, label: translate("<none>") },
      { value: MESSAGE_CREATE_NEW_OPTION, label: translate("Create new ...") }
    ];

    findMessages(element.businessObject)
      .slice()
      .sort((left, right) => (left.name || "").localeCompare(right.name || "", undefined, { sensitivity: "base" }))
      .forEach((message) => {
        options.push({
          value: message.get("id"),
          label: message.get("name")
        });
      });

    return options;
  };

  const onMessageRefChange = (event) => {
    const value = event.target.value;
    const root = getDefinitionsRoot(messageEventDefinition);
    const commands = [];
    let message;

    if (value === MESSAGE_CREATE_NEW_OPTION) {
      const messageId = nextMessageId();
      message = bpmnFactory.create("bpmn:Message", {
        id: messageId,
        name: messageId
      });
      message.$parent = root;
      commands.push({
        cmd: "element.updateModdleProperties",
        context: {
          element,
          moddleElement: root,
          properties: {
            rootElements: [...(root.get("rootElements") || []), message]
          }
        }
      });
    } else {
      message = value ? findMessageById(element.businessObject, value) : undefined;
    }

    commands.push({
      cmd: "element.updateModdleProperties",
      context: {
        element,
        moddleElement: messageEventDefinition,
        properties: {
          messageRef: message
        }
      }
    });

    commandStack.execute("properties-panel.multi-command-executor", commands);
  };

  const onMessageNameChange = (event) => {
    if (!linkedMessage) {
      return;
    }

    commandStack.execute("element.updateModdleProperties", {
      element,
      moddleElement: linkedMessage,
      properties: {
        name: event.target.value
      }
    });
  };

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-message-ref`}>
        ${translate("Global message reference")}
      </label>
      <select
        id=${`${id}-message-ref`}
        class="bio-properties-panel-input flowable-inline-field__input"
        value=${getMessageRefValue()}
        onChange=${onMessageRefChange}
      >
        ${getMessageOptions().map((option) =>
          html`<option key=${option.value} value=${option.value}>${option.label}</option>`
        )}
      </select>
    </div>
    ${linkedMessage
      ? html`<div class="flowable-inline-field flowable-inline-field--grow">
          <label class="flowable-inline-field__label" for=${`${id}-message-name`}>
            ${translate("Name")}
          </label>
          <input
            id=${`${id}-message-name`}
            class="bio-properties-panel-input flowable-inline-field__input"
            type="text"
            value=${linkedMessage.get("name") || ""}
            onInput=${onMessageNameChange}
          />
        </div>`
      : null}
  </div>`;
}

function getProcessId(element) {
  let current = element;
  while (current) {
    if (current.type === "bpmn:Process") {
      return current.businessObject?.id || current.id || "";
    }
    current = current.parent;
  }

  let businessObject = element?.businessObject;
  while (businessObject) {
    if (businessObject.$type === "bpmn:Process") {
      return businessObject.id || "";
    }
    businessObject = businessObject.$parent;
  }

  return "";
}

function isCustomMetadataEdited(_node, _entry, element) {
  const diagramElement = element;
  if (!diagramElement?.businessObject) {
    return false;
  }

  const activityId = diagramElement.businessObject.id || diagramElement.id;
  return hasActivityMetadata(activityId, element.type);
}

function userTaskEntries(element) {
  return [
    flowableTextField(element, "assignee", "Assignee"),
    flowableTextField(element, "candidateUsers", "Candidate users"),
    flowableTextField(element, "candidateGroups", "Candidate groups"),
    flowableTextField(element, "dueDate", "Due date")
  ];
}

function serviceTaskEntries(element) {
  return [
    {
      id: "flowable-service-task-type-topic-row",
      element,
      component: ServiceTaskTypeTopicRow,
      isEdited: isSelectEntryEdited
    },
    {
      id: "flowable-service-task-implementation-row",
      element,
      component: ServiceTaskImplementationRow,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function serviceTaskEmailEntries(element) {
  return [
    flowableMetadataTextField(element, "recipientEmail", "Recipient Email"),
    flowableMetadataTextField(element, "subject", "Subject"),
    {
      id: "flowable-service-task-message",
      element,
      component: ServiceTaskMessageField,
      isEdited: isTextAreaEntryEdited
    }
  ];
}

function flowableMetadataTextField(element, property, label) {
  return {
    id: `flowable-service-task-${property}`,
    element,
    component: ServiceTaskMetadataTextField,
    isEdited: isTextFieldEntryEdited,
    property,
    label
  };
}

function ServiceTaskMetadataTextField(props) {
  const { element, id, property, label } = props;
  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const activityId = element.businessObject?.id || element.id;
  const { value, loading, persistValue } = useCustomMetadataField(element, activityId, property);

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate(label)}
    getValue=${() => value}
    setValue=${persistValue}
    disabled=${loading}
    debounce=${debounce}
  />`;
}

function ServiceTaskMessageField(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const activityId = element.businessObject?.id || element.id;
  const { value, loading, persistValue } = useCustomMetadataField(element, activityId, "message");

  return html`<${TextAreaEntry}
    id=${id}
    element=${element}
    label=${translate("Message")}
    getValue=${() => value}
    setValue=${persistValue}
    disabled=${loading}
    debounce=${debounce}
  />`;
}

function ServiceTaskTypeTopicRow(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");

  const typeValue = element.businessObject.get("flowable:type") || "";
  const topicValue = element.businessObject.get("flowable:topic") || "";

  const onChangeType = (event) => {
    const nextType = event.target.value || undefined;
    const updates = { "flowable:type": nextType };
    if (nextType !== "external") {
      updates["flowable:topic"] = undefined;
    }
    modeling.updateProperties(element, updates);
  };

  const onChangeTopic = (event) => {
    const topic = (event.target.value || "").trim();
    if (topic) {
      modeling.updateProperties(element, {
        "flowable:type": "external",
        "flowable:topic": topic
      });
    } else {
      modeling.updateProperties(element, {
        "flowable:topic": undefined
      });
    }
  };

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-type`}>
        ${translate("Type")}
      </label>
      <select
        id=${`${id}-type`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        value=${typeValue}
        onChange=${onChangeType}
      >
        <option value="">${translate("Java / expression (engine)")}</option>
        <option value="external">${translate("External (worker topic)")}</option>
      </select>
    </div>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-topic`}>
        ${translate("Topic")}
      </label>
      <input
        id=${`${id}-topic`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${topicValue}
        placeholder=${translate("e.g. dummysys")}
        onInput=${onChangeTopic}
      />
    </div>
  </div>`;
}

function ServiceTaskImplementationRow(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");

  const javaClass = element.businessObject.get("flowable:class") || "";
  const delegateExpression = element.businessObject.get("flowable:delegateExpression") || "";
  const expression = element.businessObject.get("flowable:expression") || "";

  const onChangeAttr = (attrName) => (event) => {
    const value = (event.target.value || "").trim();
    modeling.updateProperties(element, {
      [attrName]: value || undefined
    });
  };

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-class`}>
        ${translate("Java class")}
      </label>
      <input
        id=${`${id}-class`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${javaClass}
        onInput=${onChangeAttr("flowable:class")}
      />
    </div>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-delegate`}>
        ${translate("Delegate expression")}
      </label>
      <input
        id=${`${id}-delegate`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${delegateExpression}
        onInput=${onChangeAttr("flowable:delegateExpression")}
      />
    </div>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-expression`}>
        ${translate("Expression")}
      </label>
      <input
        id=${`${id}-expression`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${expression}
        onInput=${onChangeAttr("flowable:expression")}
      />
    </div>
  </div>`;
}

function callActivityEntries(element) {
  return [
    flowableCheckboxField(
      element,
      "inheritVariables",
      "Inherit variables",
      "Copy all parent process variables into the child process instance"
    )
  ];
}

function supportsMultiInstance(element) {
  return isAny(element, MULTI_INSTANCE_ACTIVITY_TYPES);
}

function getExtensionElements(element) {
  return element.businessObject.get("extensionElements");
}

function ensureExtensionElements(modeling, moddle, element) {
  let extensionElements = getExtensionElements(element);
  if (!extensionElements) {
    extensionElements = moddle.create("bpmn:ExtensionElements", { values: [] });
    modeling.updateProperties(element, { extensionElements });
  }
  return extensionElements;
}

function getInOutBindings(element, type) {
  const extensionElements = getExtensionElements(element);
  if (!extensionElements) {
    return [];
  }
  return (extensionElements.get("values") || []).filter((value) => value.$type === type);
}

function addInOutBinding(modeling, moddle, element, type) {
  const extensionElements = ensureExtensionElements(modeling, moddle, element);
  const binding = moddle.create(type, { source: "", target: "" });
  const values = extensionElements.get("values") || [];
  modeling.updateModdleProperties(element, extensionElements, {
    values: [...values, binding]
  });
}

function removeInOutBinding(modeling, element, binding) {
  const extensionElements = getExtensionElements(element);
  if (!extensionElements) {
    return;
  }
  const values = (extensionElements.get("values") || []).filter((value) => value !== binding);
  modeling.updateModdleProperties(element, extensionElements, { values });
}

// Builds a repeatable "In parameters" / "Out parameters" list group for a
// Call Activity. flowable:In / flowable:Out map a parent-scope variable
// (source, e.g. the multi-instance elementVariable "applicantid") onto a
// variable name inside the launched child process instance (target). Without
// at least one In mapping, the child process never sees the per-instance
// value — Flowable does not share parent variables with a called process
// automatically.
function inOutParameterGroup(element, modeling, moddle, translate, type, groupId, label, idPrefix) {
  const bindings = getInOutBindings(element, type);

  const items = bindings.map((binding, index) => {
    const id = `${element.id}-${idPrefix}-${index}`;
    return {
      id,
      label: binding.get("target") || binding.get("source") || translate("(unnamed)"),
      entries: inOutBindingEntries(id, binding),
      autoFocusEntry: `${id}-source`,
      remove: (event) => {
        event.stopPropagation();
        removeInOutBinding(modeling, element, binding);
      }
    };
  });

  return {
    id: groupId,
    label: translate(label),
    component: ListGroup,
    element,
    items,
    add: (event) => {
      event.stopPropagation();
      addInOutBinding(modeling, moddle, element, type);
    }
  };
}

function inOutBindingEntries(idPrefix, binding) {
  return [
    {
      id: `${idPrefix}-source`,
      component: InOutBindingSourceField,
      isEdited: isTextFieldEntryEdited,
      binding
    },
    {
      id: `${idPrefix}-target`,
      component: InOutBindingTargetField,
      isEdited: isTextFieldEntryEdited,
      binding
    }
  ];
}

function InOutBindingSourceField(props) {
  // "element" is injected automatically by the ListItem renderer.
  const { element, id, binding } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => binding.get("source") || "";

  const setValue = (value) => {
    modeling.updateModdleProperties(element, binding, { source: value || undefined });
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate("Source")}
    description=${translate("Parent-scope variable, e.g. applicantid")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function InOutBindingTargetField(props) {
  const { element, id, binding } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => binding.get("target") || "";

  const setValue = (value) => {
    modeling.updateModdleProperties(element, binding, { target: value || undefined });
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate("Target")}
    description=${translate("Variable name inside the child process, e.g. applicantId")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function getMultiInstanceLoopCharacteristics(businessObject) {
  const loopCharacteristics = businessObject?.loopCharacteristics;
  if (!loopCharacteristics || loopCharacteristics.$type !== "bpmn:MultiInstanceLoopCharacteristics") {
    return null;
  }
  return loopCharacteristics;
}

function readCollection(loopCharacteristics) {
  return loopCharacteristics.get?.("flowable:collection") || "";
}

function readElementVariable(loopCharacteristics) {
  return loopCharacteristics.get?.("flowable:elementVariable") || "";
}

function readMultiInstanceMode(loopCharacteristics) {
  if (!loopCharacteristics) {
    return "none";
  }
  return loopCharacteristics.isSequential ? "sequential" : "parallel";
}

function ensureMultiInstanceLoopCharacteristics(modeling, moddle, element, isSequential) {
  const businessObject = element.businessObject;
  let loopCharacteristics = getMultiInstanceLoopCharacteristics(businessObject);

  if (!loopCharacteristics) {
    loopCharacteristics = moddle.create("bpmn:MultiInstanceLoopCharacteristics", {
      isSequential
    });
    modeling.updateProperties(element, { loopCharacteristics });
    return loopCharacteristics;
  }

  const updates = {};
  if (loopCharacteristics.isSequential !== isSequential) {
    updates.isSequential = isSequential;
  }
  // Self-heal any stale reference left over from an earlier buggy version.
  if (loopCharacteristics.loopDataInputRef || loopCharacteristics.inputDataItem) {
    updates.loopDataInputRef = undefined;
    updates.inputDataItem = undefined;
  }
  if (Object.keys(updates).length) {
    modeling.updateModdleProperties(element, loopCharacteristics, updates);
  }

  return loopCharacteristics;
}

// Flowable's engine only ever reads flowable:collection and
// flowable:elementVariable for multi-instance iteration data — it does not
// interpret the standard BPMN loopDataInputRef/inputDataItem constructs
// (those require full ItemAwareElement/DataInput modeling that Flowable
// never implemented). We also actively clear any stale loopDataInputRef/
// inputDataItem left over from an earlier buggy version of this file: those
// aren't just inert, they can trip a "variable is not defined" error during
// deploy, because loopDataInputRef is a genuine reference and was pointing
// at an id that isn't validly resolvable (the inputDataItem nested inside
// the same loopCharacteristics, not a process-level DataObject/Property).
function applyMultiInstanceCollection(modeling, element, loopCharacteristics, collectionValue, elementVariable) {
  modeling.updateModdleProperties(element, loopCharacteristics, {
    "flowable:collection": collectionValue || undefined,
    "flowable:elementVariable": elementVariable || undefined,
    loopDataInputRef: undefined,
    inputDataItem: undefined
  });
}

function createOrUpdateCompletionCondition(modeling, moddle, element, loopCharacteristics, value) {
  const trimmed = value.trim();
  const existing = loopCharacteristics.completionCondition;

  if (!trimmed) {
    if (existing) {
      modeling.updateModdleProperties(element, loopCharacteristics, {
        completionCondition: undefined
      });
    }
    return;
  }

  if (existing) {
    modeling.updateModdleProperties(element, existing, { body: trimmed });
    return;
  }

  const expression = moddle.create("bpmn:FormalExpression", { body: trimmed });
  modeling.updateModdleProperties(element, loopCharacteristics, {
    completionCondition: expression
  });
}

function multiInstanceEntries(element) {
  return [
    {
      id: "flowable-multi-instance-mode",
      element,
      component: MultiInstanceModeSelect,
      isEdited: isSelectEntryEdited
    },
    {
      id: "flowable-mi-collection",
      element,
      component: CollectionField,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: "flowable-mi-element-variable",
      element,
      component: ElementVariableField,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: "flowable-multi-instance-completion",
      element,
      component: MultiInstanceCompletionConditionField,
      isEdited: isTextAreaEntryEdited
    }
  ];
}

function MultiInstanceModeSelect(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const moddle = useService("moddle");
  const translate = useService("translate");

  const getValue = () => readMultiInstanceMode(getMultiInstanceLoopCharacteristics(element.businessObject));

  const setValue = (value) => {
    if (value === "none") {
      modeling.updateProperties(element, { loopCharacteristics: undefined });
      return;
    }

    const isSequential = value === "sequential";
    ensureMultiInstanceLoopCharacteristics(modeling, moddle, element, isSequential);
  };

  const getOptions = () => [
    { value: "none", label: translate("None") },
    { value: "parallel", label: translate("Parallel (for each)") },
    { value: "sequential", label: translate("Sequential (for each)") }
  ];

  return html`<${SelectEntry}
    id=${id}
    element=${element}
    label=${translate("Multi-instance type")}
    getValue=${getValue}
    setValue=${setValue}
    getOptions=${getOptions}
  />`;
}

function CollectionField(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const moddle = useService("moddle");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    const loopCharacteristics = getMultiInstanceLoopCharacteristics(element.businessObject);
    return loopCharacteristics ? readCollection(loopCharacteristics) : "";
  };

  const setValue = (value) => {
    let loopCharacteristics = getMultiInstanceLoopCharacteristics(element.businessObject);
    if (!loopCharacteristics) {
      loopCharacteristics = ensureMultiInstanceLoopCharacteristics(modeling, moddle, element, false);
    }

    const elementVariable = readElementVariable(loopCharacteristics);
    applyMultiInstanceCollection(modeling, element, loopCharacteristics, value, elementVariable);
  };

  if (readMultiInstanceMode(getMultiInstanceLoopCharacteristics(element.businessObject)) === "none") {
    return null;
  }

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate("Collection")}
    description=${translate("Process variable to iterate, e.g. ${approverList}")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function ElementVariableField(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const moddle = useService("moddle");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    const loopCharacteristics = getMultiInstanceLoopCharacteristics(element.businessObject);
    return loopCharacteristics ? readElementVariable(loopCharacteristics) : "";
  };

  const setValue = (value) => {
    let loopCharacteristics = getMultiInstanceLoopCharacteristics(element.businessObject);
    if (!loopCharacteristics) {
      loopCharacteristics = ensureMultiInstanceLoopCharacteristics(modeling, moddle, element, false);
    }

    const collectionValue = readCollection(loopCharacteristics);
    applyMultiInstanceCollection(modeling, element, loopCharacteristics, collectionValue, value);
  };

  if (readMultiInstanceMode(getMultiInstanceLoopCharacteristics(element.businessObject)) === "none") {
    return null;
  }

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate("Element variable")}
    description=${translate("Name each instance uses for its own item, e.g. approver")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function MultiInstanceCompletionConditionField(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const moddle = useService("moddle");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    const loopCharacteristics = getMultiInstanceLoopCharacteristics(element.businessObject);
    return loopCharacteristics?.completionCondition?.body || "";
  };

  const setValue = (value) => {
    let loopCharacteristics = getMultiInstanceLoopCharacteristics(element.businessObject);
    if (!loopCharacteristics) {
      loopCharacteristics = ensureMultiInstanceLoopCharacteristics(modeling, moddle, element, false);
    }

    createOrUpdateCompletionCondition(modeling, moddle, element, loopCharacteristics, value);
  };

  if (readMultiInstanceMode(getMultiInstanceLoopCharacteristics(element.businessObject)) === "none") {
    return null;
  }

  return html`<${TextAreaEntry}
    id=${id}
    element=${element}
    label=${translate("Completion condition")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function flowableTextField(element, property, label) {
  return {
    id: `flowable-${property}`,
    element,
    component: FlowableField,
    isEdited: isTextFieldEntryEdited,
    property,
    label
  };
}

function flowableCheckboxField(element, property, label, description) {
  return {
    id: `flowable-${property}`,
    element,
    component: FlowableCheckboxField,
    isEdited: isCheckboxEntryEdited,
    property,
    label,
    description
  };
}

function FlowableCheckboxField(props) {
  const { element, id, property, label, description } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const attrName = `flowable:${property}`;

  const getValue = () => element.businessObject.get(attrName) === true;

  const setValue = (value) => {
    modeling.updateProperties(element, {
      [attrName]: value ? true : undefined
    });
  };

  return html`<${CheckboxEntry}
    id=${id}
    element=${element}
    label=${translate(label)}
    description=${description ? translate(description) : undefined}
    getValue=${getValue}
    setValue=${setValue}
  />`;
}

function FlowableField(props) {
  const { element, id, property, label } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");
  const attrName = `flowable:${property}`;

  const getValue = () => element.businessObject.get(attrName) || "";

  const setValue = (value) => {
    modeling.updateProperties(element, {
      [attrName]: value || undefined
    });
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate(label)}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function CalledWorkflowSelect(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const [workflowOptions, setWorkflowOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);
    fetchWorkflowOptions()
      .then((options) => {
        if (active) {
          setWorkflowOptions(options);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [element.id]);

  const getValue = () => element.businessObject.calledElement || "";

  const setValue = (value) => {
    modeling.updateProperties(element, {
      calledElement: value || undefined
    });
  };

  const getOptions = () => {
    const options = [
      {
        value: "",
        label: translate(loading ? "Loading workflows..." : "Select workflow")
      }
    ];

    workflowOptions.forEach((workflow) => {
      options.push({
        value: workflow.value,
        label: workflow.label
      });
    });

    const currentValue = getValue();
    if (currentValue && !options.some((option) => option.value === currentValue)) {
      options.push({
        value: currentValue,
        label: currentValue
      });
    }

    return options;
  };

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`flowable-called-workflow-${element.id}`}>
        ${translate("Called workflow")}
      </label>
      <select
        id=${`flowable-called-workflow-${element.id}`}
        class="bio-properties-panel-input flowable-inline-field__input"
        value=${getValue()}
        disabled=${loading}
        onChange=${(event) => setValue(event.target.value)}
      >
        ${getOptions().map((option) =>
          html`<option key=${option.value} value=${option.value}>${option.label}</option>`
        )}
      </select>
    </div>
  </div>`;
}

const STAGE_OPTIONS = [
  { value: "", label: "Select stage" },
  { value: "Pre-Submission", label: "Pre-Submission" },
  { value: "Data Entry", label: "Data Entry" },
  { value: "Pre-Decision", label: "Pre-Decision" },
  { value: "Pre-Disbursement", label: "Pre-Disbursement" },
  { value: "Disbursement", label: "Disbursement" },
  { value: "Post Disbursement", label: "Post Disbursement" },
  { value: "Closed", label: "Closed" }
];

const NOTIFY_USER_OPTIONS = [
  { value: "", label: "Select a value" },
  { value: "workflow_admin", label: "Workflow Admin" },
  { value: "process_owner", label: "Process Owner" },
  { value: "assigned_user", label: "Assigned User" }
];

const RETRY_INTERVAL_UNIT_OPTIONS = [
  { value: "", label: "Select a value" },
  { value: "Minute(s)", label: "Minute(s)" },
  { value: "Hour(s)", label: "Hour(s)" },
  { value: "Day(s)", label: "Day(s)" },
  { value: "Month(s)", label: "Month(s)" },
  { value: "Year(s)", label: "Year(s)" }
];

const SUB_STAGE_OPTIONS = [
  { value: "", label: "Select sub-stage" },
  { value: "Initial Review", label: "Initial Review" },
  { value: "Detailed Review", label: "Detailed Review" },
  { value: "Final Review", label: "Final Review" }
];

const USER_ACTIVITY_OPTIONS = [
  { value: "", label: "Select user activity" },
  { value: "credit_review", label: "Credit Review" },
  { value: "document_verification", label: "Document Verification" },
  { value: "approval", label: "Approval" }
];

const PRIOR_ACTIVITY_OPTIONS = [
  { value: "", label: "Select activity" },
  { value: "data_entry", label: "Data Entry" },
  { value: "credit_check", label: "Credit Check" },
  { value: "underwriting", label: "Underwriting" }
];

const ROLE_OPTIONS = [
  { value: "", label: "Select role" },
  { value: "workflow_admin", label: "Workflow Admin" },
  { value: "process_owner", label: "Process Owner" },
  { value: "assigned_user", label: "Assigned User" },
  { value: "spoc", label: "SPOC" },
  { value: "arm", label: "ARM" },
  { value: "cpa", label: "CPA" },
  { value: "dsa", label: "DSA" }
];

const LEVEL_OPTIONS = [
  { value: "", label: "Select level" },
  { value: "L1", label: "L1" },
  { value: "L2", label: "L2" },
  { value: "L3", label: "L3" }
];

const APPROVAL_LEVEL_SOURCES = {
  LEVEL_GTE: "level_gte",
  APPROVAL_ROLE: "approval_role"
};

const APPROVAL_ROLE_OPTIONS = [
  { value: "", label: "Select approval role" },
  { value: "credit_approver", label: "Credit Approver" },
  { value: "operations_approver", label: "Operations Approver" },
  { value: "senior_approver", label: "Senior Approver" }
];

const EMAIL_TEMPLATE_OPTIONS = [
  { value: "", label: "Select template" },
  { value: "approval_request", label: "Approval Request" },
  { value: "approval_reminder", label: "Approval Reminder" },
  { value: "approval_completed", label: "Approval Completed" }
];

const NOTIFICATION_TEMPLATE_OPTIONS = [
  { value: "", label: "Select template" },
  { value: "allocation_notice", label: "Allocation Notice" },
  { value: "reallocation_notice", label: "Reallocation Notice" },
  { value: "approval_required_notice", label: "Approval Required Notice" },
  { value: "team_allocation_notice", label: "Team Allocation Notice" },
  { value: "team_approval_notice", label: "Team Approval Notice" },
  { value: "referred_user_notice", label: "Referred User Notice" }
];

const ALLOCATION_MODES = {
  LAST_ACTIVITY_USER: "last_activity_user",
  SPOC_ARM: "spoc_arm",
  CPA: "cpa",
  DSA: "dsa",
  USER_WHO_DID: "user_who_did",
  SEARCH_BY_ROLE: "search_by_role",
  PD_USER: "pd_user",
  FCU_ALLOCATION: "fcu_allocation"
};

function renderSelectOptions(options, translate) {
  return options.map((option) =>
    html`<option key=${option.value} value=${option.value}>${translate(option.label)}</option>`
  );
}

function useCustomMetadataField(element, activityId, fieldName) {
  const elementType = element.type;
  const [value, setValue] = useState(() => getActivityMetadata(activityId, elementType)[fieldName] || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);
    ensureActivityMetadataLoaded()
      .then(() => {
        if (active) {
          setValue(getActivityMetadata(activityId, elementType)[fieldName] || "");
        }
      })
      .catch((error) => {
        console.error("Failed to load activity metadata:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [activityId, fieldName, elementType]);

  useEffect(() => {
    const refreshValue = () => {
      setValue(getActivityMetadata(activityId, elementType)[fieldName] || "");
    };

    return onActivityMetadataChanged(refreshValue);
  }, [activityId, fieldName, elementType]);

  const persistValue = async (nextValue) => {
    setValue(nextValue);
    const processId = getProcessId(element);
    try {
      await persistActivityMetadata(processId, activityId, { [fieldName]: nextValue }, elementType);
      setValue(getActivityMetadata(activityId, elementType)[fieldName] || nextValue || "");
    } catch (error) {
      console.error("Failed to save activity metadata:", error);
      alert(error?.message || "Failed to save activity property into the BPMN diagram.");
    }
  };

  return { value, loading, persistValue };
}

function useCustomMetadataBooleanField(element, activityId, fieldName) {
  const elementType = element.type;
  const [value, setValue] = useState(() => getActivityMetadata(activityId, elementType)[fieldName] === true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    setLoading(true);
    ensureActivityMetadataLoaded()
      .then(() => {
        if (active) {
          setValue(getActivityMetadata(activityId, elementType)[fieldName] === true);
        }
      })
      .catch((error) => {
        console.error("Failed to load activity metadata:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [activityId, fieldName, elementType]);

  useEffect(() => {
    const refreshValue = () => {
      setValue(getActivityMetadata(activityId, elementType)[fieldName] === true);
    };

    return onActivityMetadataChanged(refreshValue);
  }, [activityId, fieldName, elementType]);

  const persistValue = async (nextValue) => {
    setValue(nextValue);
    const processId = getProcessId(element);
    try {
      await persistActivityMetadata(processId, activityId, { [fieldName]: nextValue }, elementType);
      setValue(getActivityMetadata(activityId, elementType)[fieldName] === true);
    } catch (error) {
      console.error("Failed to save activity metadata:", error);
      alert(error?.message || "Failed to save activity property into the BPMN diagram.");
    }
  };

  return { value, loading, persistValue };
}

function ActivityConfigurationSectionLabel() {
  const translate = useService("translate");

  return html`<div class="bio-properties-panel-entry flowable-panel-section-label" data-entry-id="flowable-activity-configuration-label">
    <div class="bio-properties-panel-label">
      ${translate("Activity Configuration")}
    </div>
  </div>`;
}

function CustomActivityIdentityRow(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const activityName = useCustomMetadataField(element, activityId, "activityName");
  const description = useCustomMetadataField(element, activityId, "description");
  const loading = activityName.loading || description.loading;

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-activity-name`}>
        ${translate("Activity Name")}
      </label>
      <input
        id=${`${id}-activity-name`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${activityName.value}
        disabled=${loading}
        onInput=${(event) => activityName.persistValue(event.target.value)}
      />
    </div>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-description`}>
        ${translate("Description")}
      </label>
      <input
        id=${`${id}-description`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${description.value}
        disabled=${loading}
        onInput=${(event) => description.persistValue(event.target.value)}
      />
    </div>
  </div>`;
}

function CustomStageSelect(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const { value, loading, persistValue } = useCustomMetadataField(element, activityId, "stage");

  const options = STAGE_OPTIONS.map((option) => ({
    value: option.value,
    label: translate(option.label)
  }));

  return html`<div class="bio-properties-panel-entry flowable-panel-row flowable-panel-row--compact" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--medium">
      <label class="flowable-inline-field__label" for=${`${id}-stage`}>${translate("Stage")}</label>
      <select
        id=${`${id}-stage`}
        class="bio-properties-panel-input flowable-inline-field__input"
        value=${value}
        disabled=${loading}
        onChange=${(event) => persistValue(event.target.value)}
      >
        ${options.map((option) =>
          html`<option key=${option.value} value=${option.value}>${option.label}</option>`
        )}
      </select>
    </div>
  </div>`;
}

function CustomActivityConfigRow(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const systemActivity = useCustomMetadataField(element, activityId, "systemActivity");
  const displayInSendBack = useCustomMetadataBooleanField(element, activityId, "displayInSendBack");
  const displayInReinitiate = useCustomMetadataBooleanField(element, activityId, "displayInReinitiate");
  const loading = systemActivity.loading || displayInSendBack.loading || displayInReinitiate.loading;

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-system-activity`}>
        ${translate("System Activity")}
      </label>
      <input
        id=${`${id}-system-activity`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${systemActivity.value}
        disabled=${loading}
        onInput=${(event) => systemActivity.persistValue(event.target.value)}
      />
    </div>
    <label class="flowable-inline-checkbox">
      <input
        type="checkbox"
        checked=${displayInSendBack.value}
        disabled=${loading}
        onChange=${(event) => displayInSendBack.persistValue(event.target.checked)}
      />
      <span>${translate("Display in Send Back")}</span>
    </label>
    <label class="flowable-inline-checkbox">
      <input
        type="checkbox"
        checked=${displayInReinitiate.value}
        disabled=${loading}
        onChange=${(event) => displayInReinitiate.persistValue(event.target.checked)}
      />
      <span>${translate("Display in Reinitiate")}</span>
    </label>
  </div>`;
}

function CustomFailoverActionPanel(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;

  const retryCount = useCustomMetadataField(element, activityId, "retryCount");
  const retryInterval = useCustomMetadataField(element, activityId, "retryInterval");
  const retryIntervalUnit = useCustomMetadataField(element, activityId, "retryIntervalUnit");
  const failoverNotifyMode = useCustomMetadataField(element, activityId, "failoverNotifyMode");
  const everyErrorNotifyUser = useCustomMetadataField(element, activityId, "everyErrorNotifyUser");
  const skipOnFinalError = useCustomMetadataBooleanField(element, activityId, "skipActivityOnFinalError");
  const skipNotifyUser = useCustomMetadataField(element, activityId, "skipNotifyUser");

  const loading =
    retryCount.loading
    || retryInterval.loading
    || retryIntervalUnit.loading
    || failoverNotifyMode.loading
    || everyErrorNotifyUser.loading
    || skipOnFinalError.loading
    || skipNotifyUser.loading;

  const notifyModeName = `failover-mode-${activityId}`;
  const isEveryErrorMode = failoverNotifyMode.value === "every_error";
  const isPreviousUserMode = failoverNotifyMode.value === "previous_user";
  const hasRetryCount = String(retryCount.value || "").trim().length > 0;
  const notifyModeOptionsEnabled = !loading && hasRetryCount;

  const renderNotifyUserOptions = () =>
    NOTIFY_USER_OPTIONS.map((option) =>
      html`<option key=${option.value} value=${option.value}>${translate(option.label)}</option>`
    );

  const renderRetryIntervalUnitOptions = () =>
    RETRY_INTERVAL_UNIT_OPTIONS.map((option) =>
      html`<option key=${option.value} value=${option.value}>${translate(option.label)}</option>`
    );

  return html`<div class="bio-properties-panel-entry flowable-failover-panel" data-entry-id=${id}>
    <div class="flowable-failover-panel__label-row">
      <span class="flowable-inline-field__label">${translate("Failover Action")}</span>
    </div>

    <div class="flowable-failover-panel__retry-row">
      <span class="flowable-failover-panel__text">${translate("Retry")}</span>
      <input
        class="bio-properties-panel-input flowable-panel-textbox flowable-failover-panel__input"
        type="text"
        value=${retryCount.value}
        disabled=${loading}
        onInput=${(event) => retryCount.persistValue(event.target.value)}
      />
      <span class="flowable-failover-panel__text">${translate("times after every")}</span>
      <input
        class="bio-properties-panel-input flowable-panel-textbox flowable-failover-panel__input"
        type="text"
        value=${retryInterval.value}
        disabled=${loading}
        onInput=${(event) => retryInterval.persistValue(event.target.value)}
      />
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${retryIntervalUnit.value}
        disabled=${loading}
        onChange=${(event) => retryIntervalUnit.persistValue(event.target.value)}
      >
        ${renderRetryIntervalUnitOptions()}
      </select>
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <label class="flowable-failover-panel__radio">
        <input
          type="radio"
          name=${notifyModeName}
          checked=${isEveryErrorMode}
          disabled=${!notifyModeOptionsEnabled}
          onChange=${() => failoverNotifyMode.persistValue("every_error")}
        />
        <span>${translate("On Every Error, notify to user")}</span>
      </label>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${everyErrorNotifyUser.value}
        disabled=${!notifyModeOptionsEnabled || !isEveryErrorMode}
        onChange=${(event) => everyErrorNotifyUser.persistValue(event.target.value)}
      >
        ${renderNotifyUserOptions()}
      </select>
      <label class="flowable-failover-panel__checkbox">
        <input
          type="checkbox"
          checked=${skipOnFinalError.value}
          disabled=${loading}
          onChange=${(event) => skipOnFinalError.persistValue(event.target.checked)}
        />
        <span>${translate("skip this activity to move ahead and notify to user")}</span>
      </label>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${skipNotifyUser.value}
        disabled=${loading}
        onChange=${(event) => skipNotifyUser.persistValue(event.target.value)}
      >
        ${renderNotifyUserOptions()}
      </select>
    </div>

    <div class="flowable-failover-panel__option-row">
      <label class="flowable-failover-panel__radio">
        <input
          type="radio"
          name=${notifyModeName}
          checked=${isPreviousUserMode}
          disabled=${!notifyModeOptionsEnabled}
          onChange=${() => failoverNotifyMode.persistValue("previous_user")}
        />
        <span>${translate("Notify to previous useractivity user")}</span>
      </label>
    </div>

    <p class="flowable-failover-panel__note">
      ${translate("Note: Failed system activities which cannot be skipped will be available for troubleshooting in Error Log.")}
    </p>
  </div>`;
}

function CustomPanelSectionLabel({ label, entryId }) {
  const translate = useService("translate");

  return html`<div class="bio-properties-panel-entry flowable-panel-section-label" data-entry-id=${entryId}>
    <div class="bio-properties-panel-label">
      ${translate(label)}
    </div>
  </div>`;
}

function AllocationConfigurationSectionLabel() {
  return CustomPanelSectionLabel({
    label: "Allocation Configuration",
    entryId: "flowable-allocation-configuration-label"
  });
}

function ApprovalConfigurationSectionLabel() {
  return CustomPanelSectionLabel({
    label: "Approval Configuration",
    entryId: "flowable-approval-configuration-label"
  });
}

function NotificationsSectionLabel() {
  return CustomPanelSectionLabel({
    label: "Notifications",
    entryId: "flowable-notifications-label"
  });
}

function CustomUserTaskApprovalConfigurationPanel(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const requiresApproval = useCustomMetadataBooleanField(element, activityId, "requiresApproval");
  const doNotPerform = useCustomMetadataBooleanField(element, activityId, "doNotPerform");
  const approvalOfCpa = useCustomMetadataBooleanField(element, activityId, "approvalOfCpa");
  const performSystemReflowOnDataChange = useCustomMetadataBooleanField(
    element,
    activityId,
    "performSystemReflowOnDataChange"
  );
  const approvalLevelSource = useCustomMetadataField(element, activityId, "approvalLevelSource");
  const approvalFromLevel = useCustomMetadataField(element, activityId, "approvalFromLevel");
  const approvalRoleLevel = useCustomMetadataField(element, activityId, "approvalRoleLevel");

  const loading =
    requiresApproval.loading
    || doNotPerform.loading
    || approvalOfCpa.loading
    || performSystemReflowOnDataChange.loading
    || approvalLevelSource.loading
    || approvalFromLevel.loading
    || approvalRoleLevel.loading;

  const requiresApprovalEnabled = requiresApproval.value === true;
  const levelSource = approvalLevelSource.value || "";
  const approvalRadioName = `user-task-approval-level-source-${activityId}`;
  const isLevelGteSource = levelSource === APPROVAL_LEVEL_SOURCES.LEVEL_GTE;
  const isApprovalRoleSource = levelSource === APPROVAL_LEVEL_SOURCES.APPROVAL_ROLE;

  return html`<div class="bio-properties-panel-entry flowable-user-task-approval-panel" data-entry-id=${id}>
    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <label class="flowable-inline-checkbox">
        <input
          type="checkbox"
          checked=${requiresApproval.value}
          disabled=${loading}
          onChange=${(event) => requiresApproval.persistValue(event.target.checked)}
        />
        <span>${translate("Requires Approval")}</span>
      </label>
      <label class="flowable-inline-checkbox">
        <input
          type="checkbox"
          checked=${doNotPerform.value}
          disabled=${loading}
          onChange=${(event) => doNotPerform.persistValue(event.target.checked)}
        />
        <span>${translate("Do Not Perform")}</span>
      </label>
    </div>

    ${requiresApprovalEnabled ? html`
      <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
        <label class="flowable-inline-checkbox">
          <input
            type="checkbox"
            checked=${approvalOfCpa.value}
            disabled=${loading}
            onChange=${(event) => approvalOfCpa.persistValue(event.target.checked)}
          />
          <span>${translate("Approval of CPA")}</span>
        </label>
        <label class="flowable-inline-checkbox">
          <input
            type="checkbox"
            checked=${performSystemReflowOnDataChange.value}
            disabled=${loading}
            onChange=${(event) => performSystemReflowOnDataChange.persistValue(event.target.checked)}
          />
          <span>${translate("Perform System Reflow activity immediately for any data change on activity submit")}</span>
        </label>
      </div>

      <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
        <label class="flowable-failover-panel__radio">
          <input
            type="radio"
            name=${approvalRadioName}
            checked=${isLevelGteSource}
            disabled=${loading}
            onChange=${() => approvalLevelSource.persistValue(APPROVAL_LEVEL_SOURCES.LEVEL_GTE)}
          />
          <span>${translate("From user having level greater than or equal to")}</span>
        </label>
        <select
          class="bio-properties-panel-input flowable-failover-panel__select"
          value=${approvalFromLevel.value}
          disabled=${loading || !isLevelGteSource}
          onChange=${(event) => {
            approvalLevelSource.persistValue(APPROVAL_LEVEL_SOURCES.LEVEL_GTE);
            approvalFromLevel.persistValue(event.target.value);
          }}
        >
          ${renderSelectOptions(LEVEL_OPTIONS, translate)}
        </select>
      </div>

      <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
        <label class="flowable-failover-panel__radio">
          <input
            type="radio"
            name=${approvalRadioName}
            checked=${isApprovalRoleSource}
            disabled=${loading}
            onChange=${() => approvalLevelSource.persistValue(APPROVAL_LEVEL_SOURCES.APPROVAL_ROLE)}
          />
          <span>${translate("From user having level greater than or equal to level decided by")}</span>
        </label>
        <span class="flowable-failover-panel__text flowable-failover-panel__link">${translate("Approval Role")}</span>
        <select
          class="bio-properties-panel-input flowable-failover-panel__select"
          value=${approvalRoleLevel.value}
          disabled=${loading || !isApprovalRoleSource}
          onChange=${(event) => {
            approvalLevelSource.persistValue(APPROVAL_LEVEL_SOURCES.APPROVAL_ROLE);
            approvalRoleLevel.persistValue(event.target.value);
          }}
        >
          ${renderSelectOptions(APPROVAL_ROLE_OPTIONS, translate)}
        </select>
      </div>
    ` : null}
  </div>`;
}

function CustomUserTaskEmailApprovalPanel(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const emailApproval = useCustomMetadataBooleanField(element, activityId, "emailApproval");
  const emailFromLevelAndAbove = useCustomMetadataField(element, activityId, "emailFromLevelAndAbove");
  const emailTemplate = useCustomMetadataField(element, activityId, "emailTemplate");
  const skipLevelsAllocateRequiredLevel = useCustomMetadataBooleanField(
    element,
    activityId,
    "skipLevelsAllocateRequiredLevel"
  );

  const loading =
    emailApproval.loading
    || emailFromLevelAndAbove.loading
    || emailTemplate.loading
    || skipLevelsAllocateRequiredLevel.loading;

  return html`<div class="bio-properties-panel-entry flowable-user-task-approval-panel" data-entry-id=${id}>
    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <label class="flowable-inline-checkbox">
        <input
          type="checkbox"
          checked=${emailApproval.value}
          disabled=${loading}
          onChange=${(event) => emailApproval.persistValue(event.target.checked)}
        />
        <span>${translate("Email Approval")}</span>
      </label>
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <span class="flowable-inline-field__label">${translate("Email from level and Above")}</span>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${emailFromLevelAndAbove.value}
        disabled=${loading}
        onChange=${(event) => emailFromLevelAndAbove.persistValue(event.target.value)}
      >
        ${renderSelectOptions(LEVEL_OPTIONS, translate)}
      </select>
      <span class="flowable-inline-field__label">${translate("Email Template")}</span>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${emailTemplate.value}
        disabled=${loading}
        onChange=${(event) => emailTemplate.persistValue(event.target.value)}
      >
        ${renderSelectOptions(EMAIL_TEMPLATE_OPTIONS, translate)}
      </select>
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <label class="flowable-inline-checkbox">
        <input
          type="checkbox"
          checked=${skipLevelsAllocateRequiredLevel.value}
          disabled=${loading}
          onChange=${(event) => skipLevelsAllocateRequiredLevel.persistValue(event.target.checked)}
        />
        <span>${translate("Skip levels & allocate user having required level")}</span>
      </label>
    </div>
  </div>`;
}

function renderNotificationTemplateRow({
  translate,
  loading,
  checkboxField,
  templateField,
  label
}) {
  const enabled = checkboxField.value === true;

  return html`<div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
    <label class="flowable-inline-checkbox">
      <input
        type="checkbox"
        checked=${checkboxField.value}
        disabled=${loading}
        onChange=${(event) => checkboxField.persistValue(event.target.checked)}
      />
      <span>${translate(label)}</span>
    </label>
    <span class="flowable-inline-field__label">${translate("Select Template")}</span>
    <select
      class="bio-properties-panel-input flowable-failover-panel__select"
      value=${templateField.value}
      disabled=${loading || !enabled}
      onChange=${(event) => templateField.persistValue(event.target.value)}
    >
      ${renderSelectOptions(NOTIFICATION_TEMPLATE_OPTIONS, translate)}
    </select>
  </div>`;
}

function CustomUserTaskNotificationsPanel(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const notifyOwnerOnAllocation = useCustomMetadataBooleanField(element, activityId, "notifyOwnerOnAllocation");
  const notifyOwnerOnAllocationTemplate = useCustomMetadataField(element, activityId, "notifyOwnerOnAllocationTemplate");
  const notifyUserOnReallocation = useCustomMetadataBooleanField(element, activityId, "notifyUserOnReallocation");
  const notifyUserOnReallocationTemplate = useCustomMetadataField(element, activityId, "notifyUserOnReallocationTemplate");
  const notifyUserIfApprovalRequired = useCustomMetadataBooleanField(element, activityId, "notifyUserIfApprovalRequired");
  const notifyUserIfApprovalRequiredTemplate = useCustomMetadataField(
    element,
    activityId,
    "notifyUserIfApprovalRequiredTemplate"
  );
  const notifyTeamMembersOnTeamAllocation = useCustomMetadataBooleanField(
    element,
    activityId,
    "notifyTeamMembersOnTeamAllocation"
  );
  const notifyTeamMembersOnTeamAllocationTemplate = useCustomMetadataField(
    element,
    activityId,
    "notifyTeamMembersOnTeamAllocationTemplate"
  );
  const notifyTeamMembersOnApprovalToTeam = useCustomMetadataBooleanField(
    element,
    activityId,
    "notifyTeamMembersOnApprovalToTeam"
  );
  const notifyTeamMembersOnApprovalToTeamTemplate = useCustomMetadataField(
    element,
    activityId,
    "notifyTeamMembersOnApprovalToTeamTemplate"
  );
  const notifyReferredUser = useCustomMetadataBooleanField(element, activityId, "notifyReferredUser");
  const notifyReferredUserTemplate = useCustomMetadataField(element, activityId, "notifyReferredUserTemplate");

  const loading =
    notifyOwnerOnAllocation.loading
    || notifyOwnerOnAllocationTemplate.loading
    || notifyUserOnReallocation.loading
    || notifyUserOnReallocationTemplate.loading
    || notifyUserIfApprovalRequired.loading
    || notifyUserIfApprovalRequiredTemplate.loading
    || notifyTeamMembersOnTeamAllocation.loading
    || notifyTeamMembersOnTeamAllocationTemplate.loading
    || notifyTeamMembersOnApprovalToTeam.loading
    || notifyTeamMembersOnApprovalToTeamTemplate.loading
    || notifyReferredUser.loading
    || notifyReferredUserTemplate.loading;

  return html`<div class="bio-properties-panel-entry flowable-user-task-approval-panel" data-entry-id=${id}>
    ${renderNotificationTemplateRow({
      translate,
      loading,
      checkboxField: notifyOwnerOnAllocation,
      templateField: notifyOwnerOnAllocationTemplate,
      label: "Send notification to owner on allocation"
    })}
    ${renderNotificationTemplateRow({
      translate,
      loading,
      checkboxField: notifyUserOnReallocation,
      templateField: notifyUserOnReallocationTemplate,
      label: "Send notification to user on reallocation"
    })}
    ${renderNotificationTemplateRow({
      translate,
      loading,
      checkboxField: notifyUserIfApprovalRequired,
      templateField: notifyUserIfApprovalRequiredTemplate,
      label: "Send notification to user if his approval is required"
    })}
    ${renderNotificationTemplateRow({
      translate,
      loading,
      checkboxField: notifyTeamMembersOnTeamAllocation,
      templateField: notifyTeamMembersOnTeamAllocationTemplate,
      label: "Send template to team members in case of team allocation"
    })}
    ${renderNotificationTemplateRow({
      translate,
      loading,
      checkboxField: notifyTeamMembersOnApprovalToTeam,
      templateField: notifyTeamMembersOnApprovalToTeamTemplate,
      label: "Send notification to team members in case of approval activity is assigned to team"
    })}
    ${renderNotificationTemplateRow({
      translate,
      loading,
      checkboxField: notifyReferredUser,
      templateField: notifyReferredUserTemplate,
      label: "Send notification to referred user"
    })}
  </div>`;
}

function CustomUserTaskEscalationPanel(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const escalationEnabled = useCustomMetadataBooleanField(element, activityId, "escalationEnabled");
  const escalationAfterValue = useCustomMetadataField(element, activityId, "escalationAfterValue");
  const escalationAfterUnit = useCustomMetadataField(element, activityId, "escalationAfterUnit");
  const escalationSendNotification = useCustomMetadataBooleanField(element, activityId, "escalationSendNotification");
  const escalationRepeatNotification = useCustomMetadataBooleanField(
    element,
    activityId,
    "escalationRepeatNotification"
  );
  const escalationRepeatEveryValue = useCustomMetadataField(element, activityId, "escalationRepeatEveryValue");
  const escalationRepeatEveryUnit = useCustomMetadataField(element, activityId, "escalationRepeatEveryUnit");

  const loading =
    escalationEnabled.loading
    || escalationAfterValue.loading
    || escalationAfterUnit.loading
    || escalationSendNotification.loading
    || escalationRepeatNotification.loading
    || escalationRepeatEveryValue.loading
    || escalationRepeatEveryUnit.loading;

  const escalationActive = escalationEnabled.value === true;

  return html`<div class="bio-properties-panel-entry flowable-user-task-approval-panel" data-entry-id=${id}>
    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <label class="flowable-inline-checkbox">
        <input
          type="checkbox"
          checked=${escalationEnabled.value}
          disabled=${loading}
          onChange=${(event) => escalationEnabled.persistValue(event.target.checked)}
        />
        <span class="flowable-panel-section-label__text">${translate("Escalation")}</span>
      </label>
    </div>

    ${escalationActive ? html`
      <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
        <span class="flowable-inline-field__label">${translate("Escalation after")}</span>
        <input
          class="bio-properties-panel-input flowable-failover-panel__input"
          type="text"
          value=${escalationAfterValue.value}
          disabled=${loading}
          onInput=${(event) => escalationAfterValue.persistValue(event.target.value)}
        />
        <select
          class="bio-properties-panel-input flowable-failover-panel__select"
          value=${escalationAfterUnit.value}
          disabled=${loading}
          onChange=${(event) => escalationAfterUnit.persistValue(event.target.value)}
        >
          ${renderSelectOptions(RETRY_INTERVAL_UNIT_OPTIONS, translate)}
        </select>
        <span class="flowable-failover-panel__text">${translate("from start")}</span>
      </div>

      <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
        <label class="flowable-inline-checkbox">
          <input
            type="checkbox"
            checked=${escalationSendNotification.value}
            disabled=${loading}
            onChange=${(event) => escalationSendNotification.persistValue(event.target.checked)}
          />
          <span>${translate("Send notification")}</span>
        </label>
      </div>

      <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
        <label class="flowable-inline-checkbox">
          <input
            type="checkbox"
            checked=${escalationRepeatNotification.value}
            disabled=${loading}
            onChange=${(event) => escalationRepeatNotification.persistValue(event.target.checked)}
          />
          <span>${translate("Repeat notification every")}</span>
        </label>
        <input
          class="bio-properties-panel-input flowable-failover-panel__input"
          type="text"
          value=${escalationRepeatEveryValue.value}
          disabled=${loading || !escalationRepeatNotification.value}
          onInput=${(event) => escalationRepeatEveryValue.persistValue(event.target.value)}
        />
        <select
          class="bio-properties-panel-input flowable-failover-panel__select"
          value=${escalationRepeatEveryUnit.value}
          disabled=${loading || !escalationRepeatNotification.value}
          onChange=${(event) => escalationRepeatEveryUnit.persistValue(event.target.value)}
        >
          ${renderSelectOptions(RETRY_INTERVAL_UNIT_OPTIONS, translate)}
        </select>
      </div>
    ` : null}
  </div>`;
}

function CustomUserTaskStageSubStageRow(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const stage = useCustomMetadataField(element, activityId, "stage");
  const subStage = useCustomMetadataField(element, activityId, "subStage");
  const loading = stage.loading || subStage.loading;

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-stage`}>${translate("Stage")}</label>
      <select
        id=${`${id}-stage`}
        class="bio-properties-panel-input flowable-inline-field__input"
        value=${stage.value}
        disabled=${loading}
        onChange=${(event) => stage.persistValue(event.target.value)}
      >
        ${renderSelectOptions(STAGE_OPTIONS, translate)}
      </select>
    </div>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-sub-stage`}>${translate("Sub-Stage")}</label>
      <select
        id=${`${id}-sub-stage`}
        class="bio-properties-panel-input flowable-inline-field__input"
        value=${subStage.value}
        disabled=${loading}
        onChange=${(event) => subStage.persistValue(event.target.value)}
      >
        ${renderSelectOptions(SUB_STAGE_OPTIONS, translate)}
      </select>
    </div>
  </div>`;
}

function CustomUserTaskUserActivityCardIdRow(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const userActivity = useCustomMetadataField(element, activityId, "userActivity");
  const cardId = useCustomMetadataField(element, activityId, "cardId");
  const loading = userActivity.loading || cardId.loading;

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-user-activity`}>${translate("User Activity")}</label>
      <select
        id=${`${id}-user-activity`}
        class="bio-properties-panel-input flowable-inline-field__input"
        value=${userActivity.value}
        disabled=${loading}
        onChange=${(event) => userActivity.persistValue(event.target.value)}
      >
        ${renderSelectOptions(USER_ACTIVITY_OPTIONS, translate)}
      </select>
    </div>
    <div class="flowable-inline-field flowable-inline-field--grow">
      <label class="flowable-inline-field__label" for=${`${id}-card-id`}>${translate("Card Id")}</label>
      <input
        id=${`${id}-card-id`}
        class="bio-properties-panel-input flowable-inline-field__input flowable-panel-textbox"
        type="text"
        value=${cardId.value}
        disabled=${loading}
        onInput=${(event) => cardId.persistValue(event.target.value)}
      />
    </div>
  </div>`;
}

function CustomUserTaskDisplayFlagsRow(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const displayInSendBack = useCustomMetadataBooleanField(element, activityId, "displayInSendBack");
  const displayInReinitiate = useCustomMetadataBooleanField(element, activityId, "displayInReinitiate");
  const loading = displayInSendBack.loading || displayInReinitiate.loading;

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <label class="flowable-inline-checkbox">
      <input
        type="checkbox"
        checked=${displayInSendBack.value}
        disabled=${loading}
        onChange=${(event) => displayInSendBack.persistValue(event.target.checked)}
      />
      <span>${translate("Display in Send Back")}</span>
    </label>
    <label class="flowable-inline-checkbox">
      <input
        type="checkbox"
        checked=${displayInReinitiate.value}
        disabled=${loading}
        onChange=${(event) => displayInReinitiate.persistValue(event.target.checked)}
      />
      <span>${translate("Display in Reinitiate")}</span>
    </label>
  </div>`;
}

function CustomUserTaskAllocationPanel(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const allocationMode = useCustomMetadataField(element, activityId, "allocationMode");
  const allocateToUserWhoDidActivity = useCustomMetadataField(element, activityId, "allocateToUserWhoDidActivity");
  const searchAllocateRole = useCustomMetadataField(element, activityId, "searchAllocateRole");
  const searchAllocateLevel = useCustomMetadataField(element, activityId, "searchAllocateLevel");
  const doNotAllocateToUserWhoDid = useCustomMetadataField(element, activityId, "doNotAllocateToUserWhoDid");
  const allocateAsPerProcessingBuHierarchy = useCustomMetadataBooleanField(
    element,
    activityId,
    "allocateAsPerProcessingBuHierarchy"
  );
  const allocateToSameUserOnReperform = useCustomMetadataBooleanField(
    element,
    activityId,
    "allocateToSameUserOnReperform"
  );

  const loading =
    allocationMode.loading
    || allocateToUserWhoDidActivity.loading
    || searchAllocateRole.loading
    || searchAllocateLevel.loading
    || doNotAllocateToUserWhoDid.loading
    || allocateAsPerProcessingBuHierarchy.loading
    || allocateToSameUserOnReperform.loading;

  const mode = allocationMode.value || "";
  const radioName = `user-task-allocation-mode-${activityId}`;
  const isUserWhoDidMode = mode === ALLOCATION_MODES.USER_WHO_DID;
  const isSearchByRoleMode = mode === ALLOCATION_MODES.SEARCH_BY_ROLE;

  const renderRadio = (value, label) => html`<label class="flowable-failover-panel__radio">
    <input
      type="radio"
      name=${radioName}
      checked=${mode === value}
      disabled=${loading}
      onChange=${() => allocationMode.persistValue(value)}
    />
    <span>${translate(label)}</span>
  </label>`;

  return html`<div class="bio-properties-panel-entry flowable-user-task-allocation-panel" data-entry-id=${id}>
    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      ${renderRadio(ALLOCATION_MODES.LAST_ACTIVITY_USER, "Allocate activity to the user of last activity")}
      ${renderRadio(ALLOCATION_MODES.SPOC_ARM, "Allocate to Spoc person / ARM")}
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      ${renderRadio(ALLOCATION_MODES.CPA, "Allocate to CPA")}
      ${renderRadio(ALLOCATION_MODES.DSA, "Allocate to DSA")}
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <label class="flowable-failover-panel__radio">
        <input
          type="radio"
          name=${radioName}
          checked=${isUserWhoDidMode}
          disabled=${loading}
          onChange=${() => allocationMode.persistValue(ALLOCATION_MODES.USER_WHO_DID)}
        />
        <span>${translate("Allocate activity to user who did")}</span>
      </label>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${allocateToUserWhoDidActivity.value}
        disabled=${loading || !isUserWhoDidMode}
        onChange=${(event) => {
          allocationMode.persistValue(ALLOCATION_MODES.USER_WHO_DID);
          allocateToUserWhoDidActivity.persistValue(event.target.value);
        }}
      >
        ${renderSelectOptions(PRIOR_ACTIVITY_OPTIONS, translate)}
      </select>
      <label class="flowable-failover-panel__radio">
        <input
          type="radio"
          name=${radioName}
          checked=${isSearchByRoleMode}
          disabled=${loading}
          onChange=${() => allocationMode.persistValue(ALLOCATION_MODES.SEARCH_BY_ROLE)}
        />
        <span>${translate("Search and allocate the activity to user having role")}</span>
      </label>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${searchAllocateRole.value}
        disabled=${loading || !isSearchByRoleMode}
        onChange=${(event) => {
          allocationMode.persistValue(ALLOCATION_MODES.SEARCH_BY_ROLE);
          searchAllocateRole.persistValue(event.target.value);
        }}
      >
        ${renderSelectOptions(ROLE_OPTIONS, translate)}
      </select>
      <span class="flowable-failover-panel__text">${translate("and level is")}</span>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${searchAllocateLevel.value}
        disabled=${loading || !isSearchByRoleMode}
        onChange=${(event) => {
          allocationMode.persistValue(ALLOCATION_MODES.SEARCH_BY_ROLE);
          searchAllocateLevel.persistValue(event.target.value);
        }}
      >
        ${renderSelectOptions(LEVEL_OPTIONS, translate)}
      </select>
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      ${renderRadio(ALLOCATION_MODES.PD_USER, "Allocate to PD user")}
      ${renderRadio(ALLOCATION_MODES.FCU_ALLOCATION, "FCU Allocation")}
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--inline">
      <span class="flowable-inline-field__label">${translate("please do not allocate activity to the user who did")}</span>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${doNotAllocateToUserWhoDid.value}
        disabled=${loading}
        onChange=${(event) => doNotAllocateToUserWhoDid.persistValue(event.target.value)}
      >
        ${renderSelectOptions(PRIOR_ACTIVITY_OPTIONS, translate)}
      </select>
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--wrap">
      <label class="flowable-inline-checkbox">
        <input
          type="checkbox"
          checked=${allocateAsPerProcessingBuHierarchy.value}
          disabled=${loading}
          onChange=${(event) => allocateAsPerProcessingBuHierarchy.persistValue(event.target.checked)}
        />
        <span>${translate("Allocate as per processing BU hierarchy")}</span>
      </label>
      <label class="flowable-inline-checkbox">
        <input
          type="checkbox"
          checked=${allocateToSameUserOnReperform.value}
          disabled=${loading}
          onChange=${(event) => allocateToSameUserOnReperform.persistValue(event.target.checked)}
        />
        <span>${translate("Allocate to same user in case of reperform")}</span>
      </label>
    </div>
  </div>`;
}

function SequenceFlowConditionExpression(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const moddle = useService("moddle");
  const eventBus = useService("eventBus");
  const translate = useService("translate");
  const [value, setValue] = useState(() => getSequenceFlowConditionExpression(element));

  useEffect(() => {
    const refresh = () => {
      setValue(getSequenceFlowConditionExpression(element));
    };

    eventBus.on("commandStack.changed", refresh);
    return () => {
      eventBus.off("commandStack.changed", refresh);
    };
  }, [element, eventBus]);

  const onInput = (event) => {
    const nextValue = event.target.value;
    setValue(nextValue);

    const body = nextValue.trim();
    const conditionExpression = body
      ? moddle.create("bpmn:FormalExpression", { body })
      : undefined;

    modeling.updateProperties(element, { conditionExpression });

    if (body && isSequenceFlowDefault(element) && element.source) {
      modeling.updateProperties(element.source, { default: undefined });
    }
  };

  return html`<div class="bio-properties-panel-entry flowable-sequence-flow-field" data-entry-id=${id}>
    <label class="flowable-inline-field__label" for=${`${id}-condition`}>
      ${translate("Condition expression")}
    </label>
    <textarea
      id=${`${id}-condition`}
      class="bio-properties-panel-input flowable-sequence-flow-field__textarea"
      rows="3"
      value=${value}
      onInput=${onInput}
    />
  </div>`;
}

function SequenceFlowDefaultFlowCheckbox(props) {
  const { element, id } = props;
  const modeling = useService("modeling");
  const eventBus = useService("eventBus");
  const translate = useService("translate");
  const canSetDefault = supportsSequenceFlowDefault(element);
  const [checked, setChecked] = useState(() => isSequenceFlowDefault(element));

  useEffect(() => {
    const refresh = () => {
      setChecked(isSequenceFlowDefault(element));
    };

    eventBus.on("commandStack.changed", refresh);
    return () => {
      eventBus.off("commandStack.changed", refresh);
    };
  }, [element, eventBus]);

  const onChange = (event) => {
    const nextChecked = event.target.checked;
    setChecked(nextChecked);

    const sourceElement = element.source;
    if (!sourceElement) {
      return;
    }

    if (nextChecked) {
      modeling.updateProperties(element, { conditionExpression: undefined });
      modeling.updateProperties(sourceElement, { default: element });
    } else {
      modeling.updateProperties(sourceElement, { default: undefined });
    }
  };

  return html`<div class="bio-properties-panel-entry flowable-sequence-flow-field" data-entry-id=${id}>
    <label class="flowable-inline-checkbox">
      <input
        type="checkbox"
        checked=${checked}
        disabled=${!canSetDefault}
        onChange=${onChange}
      />
      <span>${translate("Default flow")}</span>
    </label>
  </div>`;
}

function CustomCallActivitySystemReflowRow(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const systemReflowOnly = useCustomMetadataBooleanField(
    element,
    activityId,
    "systemReflowOnlyForChangedEntity"
  );

  return html`<div class="bio-properties-panel-entry flowable-panel-row" data-entry-id=${id}>
    <label class="flowable-inline-checkbox">
      <input
        type="checkbox"
        checked=${systemReflowOnly.value}
        disabled=${systemReflowOnly.loading}
        onChange=${(event) => systemReflowOnly.persistValue(event.target.checked)}
      />
      <span>${translate("In case of System Reflow, perform only for changed entity")}</span>
    </label>
  </div>`;
}

function CustomGatewayFailoverActionPanel(props) {
  const { element, id } = props;
  const translate = useService("translate");
  const activityId = element.businessObject?.id || element.id;
  const everyErrorNotifyUser = useCustomMetadataField(element, activityId, "everyErrorNotifyUser");

  const renderNotifyUserOptions = () =>
    NOTIFY_USER_OPTIONS.map((option) =>
      html`<option key=${option.value} value=${option.value}>${translate(option.label)}</option>`
    );

  return html`<div class="bio-properties-panel-entry flowable-failover-panel" data-entry-id=${id}>
    <div class="flowable-failover-panel__label-row">
      <span class="flowable-inline-field__label">${translate("Failover Action")}</span>
    </div>

    <div class="flowable-failover-panel__option-row flowable-failover-panel__option-row--inline">
      <span class="flowable-inline-field__label">${translate("On Every Error, notify to user")}</span>
      <select
        class="bio-properties-panel-input flowable-failover-panel__select"
        value=${everyErrorNotifyUser.value}
        disabled=${everyErrorNotifyUser.loading}
        onChange=${(event) => everyErrorNotifyUser.persistValue(event.target.value)}
      >
        ${renderNotifyUserOptions()}
      </select>
    </div>

    <p class="flowable-failover-panel__note">
      ${translate("Note: Failed system activities which cannot be skipped will be available for troubleshooting in Error Log.")}
    </p>
  </div>`;
}

const FlowablePropertiesProviderModule = {
  __init__: ["flowablePropertiesProvider"],
  flowablePropertiesProvider: ["type", FlowablePropertiesProvider]
};

export default FlowablePropertiesProviderModule;
