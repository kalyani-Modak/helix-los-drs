/**
 * Flowable 8.0 async attributes are only valid on these executable BPMN elements.
 * They must NOT be applied to process, sequenceFlow, start/end events, etc.
 */
export const ASYNC_SUPPORTED_ELEMENT_TYPES = [
  "bpmn:UserTask",
  "bpmn:ServiceTask",
  "bpmn:ScriptTask",
  "bpmn:BusinessRuleTask",
  "bpmn:SendTask",
  "bpmn:ReceiveTask",
  "bpmn:ManualTask",
  "bpmn:CallActivity",
  "bpmn:SubProcess",
  "bpmn:ExclusiveGateway",
  "bpmn:ParallelGateway",
  "bpmn:InclusiveGateway",
  "bpmn:IntermediateCatchEvent"
];

const ASYNC_SUPPORTED_ELEMENT_TYPE_SET = new Set(ASYNC_SUPPORTED_ELEMENT_TYPES);

function bpmnTypeToLocalName(bpmnType) {
  const localName = bpmnType.replace(/^bpmn:/, "");
  return localName.charAt(0).toLowerCase() + localName.slice(1);
}

const ASYNC_SUPPORTED_BPMN_LOCAL_NAMES = new Set(
  ASYNC_SUPPORTED_ELEMENT_TYPES.map(bpmnTypeToLocalName)
);

export function supportsAsyncProperties(element) {
  return ASYNC_SUPPORTED_ELEMENT_TYPE_SET.has(element?.type);
}

export function listSupportedElements(modeler) {
  if (!modeler) {
    return [];
  }

  const elementRegistry = modeler.get("elementRegistry");
  return elementRegistry.filter((element) => supportsAsyncProperties(element));
}

export function readAsyncProperties(element) {
  const businessObject = element?.businessObject;
  if (!businessObject) {
    return { asyncBefore: false, asyncAfter: false };
  }

  return {
    asyncBefore: businessObject.get?.("flowable:asyncBefore") === true,
    asyncAfter: businessObject.get?.("flowable:asyncAfter") === true
  };
}

export function readWorkflowAsyncFlags(modeler) {
  const elements = listSupportedElements(modeler);
  if (elements.length === 0) {
    return { asyncBefore: false, asyncAfter: false };
  }

  return {
    asyncBefore: elements.some((element) => readAsyncProperties(element).asyncBefore),
    asyncAfter: elements.some((element) => readAsyncProperties(element).asyncAfter)
  };
}

export function applyAsyncProperties(modeler, element, asyncBefore, asyncAfter) {
  if (!modeler || !element || !supportsAsyncProperties(element)) {
    return;
  }

  const modeling = modeler.get("modeling");
  modeling.updateProperties(element, {
    "flowable:asyncBefore": asyncBefore ? true : undefined,
    "flowable:asyncAfter": asyncAfter ? true : undefined
  });
}

export function applyAsyncFlagsToWorkflow(modeler, asyncBefore, asyncAfter) {
  listSupportedElements(modeler).forEach((element) => {
    applyAsyncProperties(modeler, element, asyncBefore, asyncAfter);
  });
}

const FLOWABLE_NS = "http://flowable.org/bpmn";
const BPMN_NS = "http://www.omg.org/spec/BPMN/20100524/MODEL";

function setFlowableBooleanAttribute(element, name, enabled) {
  const attributeName = `flowable:${name}`;

  if (enabled) {
    element.setAttribute(attributeName, "true");
    return;
  }

  element.removeAttribute(attributeName);
  element.removeAttributeNS(FLOWABLE_NS, name);
}

function ensureFlowableNamespace(doc) {
  const definitions = doc.documentElement;
  if (!definitions || definitions.localName !== "definitions") {
    return;
  }

  if (!definitions.getAttribute("xmlns:flowable")) {
    definitions.setAttribute("xmlns:flowable", FLOWABLE_NS);
  }
}

function listAsyncCapableElements(doc) {
  const processes = Array.from(doc.getElementsByTagNameNS(BPMN_NS, "process"));
  const elements = [];

  processes.forEach((process) => {
    const descendants = process.getElementsByTagName("*");
    for (let index = 0; index < descendants.length; index += 1) {
      const element = descendants[index];
      if (ASYNC_SUPPORTED_BPMN_LOCAL_NAMES.has(element.localName)) {
        elements.push(element);
      }
    }
  });

  return elements;
}

export function applyAsyncFlagsToBpmnXml(xml, asyncBefore, asyncAfter) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("Invalid BPMN XML");
  }

  ensureFlowableNamespace(doc);

  listAsyncCapableElements(doc).forEach((element) => {
    setFlowableBooleanAttribute(element, "asyncBefore", asyncBefore);
    setFlowableBooleanAttribute(element, "asyncAfter", asyncAfter);
  });

  return new XMLSerializer().serializeToString(doc);
}

export function extractCalledWorkflowNamesFromBpmnXml(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return [];
  }

  const names = new Set();
  const elements = doc.getElementsByTagName("*");

  for (let index = 0; index < elements.length; index += 1) {
    const element = elements[index];
    if (element.localName !== "callActivity") {
      continue;
    }

    const calledElement = element.getAttribute("calledElement")?.trim();
    if (calledElement) {
      names.add(calledElement);
    }
  }

  return Array.from(names);
}

export async function applyAsyncFlagsToChildWorkflowsRecursively(
  rootWorkflowName,
  rootXml,
  asyncBefore,
  asyncAfter,
  loadWorkflow,
  saveWorkflowFn
) {
  const visited = new Set([rootWorkflowName.trim()]);

  async function processChildren(xml) {
    const childWorkflowNames = extractCalledWorkflowNamesFromBpmnXml(xml);

    for (const childWorkflowName of childWorkflowNames) {
      if (!childWorkflowName || visited.has(childWorkflowName)) {
        continue;
      }

      visited.add(childWorkflowName);

      try {
        const childWorkflow = await loadWorkflow(childWorkflowName);
        const updatedXml = applyAsyncFlagsToBpmnXml(
          childWorkflow.bpmnXml,
          asyncBefore,
          asyncAfter
        );
        await saveWorkflowFn(childWorkflowName, updatedXml);
        await processChildren(updatedXml);
      } catch (error) {
        console.warn(
          `Could not update async flags for child workflow "${childWorkflowName}"`,
          error
        );
      }
    }
  }

  await processChildren(rootXml);
}
