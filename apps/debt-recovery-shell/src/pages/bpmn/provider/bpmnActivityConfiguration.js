/** BPMN extension type for LOS custom activity properties. */
export const LOS_ACTIVITY_CONFIGURATION_TYPE = "los:ActivityConfiguration";

/**
 * Read custom activity configuration JSON from a bpmn-js element.
 * @returns {Record<string, unknown> | null}
 */
export function readActivityConfigurationFromElement(element) {
  const bo = element?.businessObject;
  if (!bo) return null;
  const extensionElements = bo.get?.("extensionElements") || bo.extensionElements;
  if (!extensionElements) return null;
  const values = extensionElements.get?.("values") || extensionElements.values || [];
  const configEl = values.find(
    (v) =>
      v?.$type === LOS_ACTIVITY_CONFIGURATION_TYPE ||
      v?.$type === "los:activityConfiguration"
  );
  if (!configEl) return null;
  const body = (configEl.get?.("body") ?? configEl.body ?? "").trim();
  if (!body) return null;
  try {
    const parsed = JSON.parse(body);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    console.warn("Invalid los:activityConfiguration JSON on", element?.id);
    return null;
  }
}

/**
 * Write custom activity configuration onto a bpmn-js diagram element
 * as {@code <los:activityConfiguration>} inside extensionElements.
 */
export function writeActivityConfigurationToElement(modeler, element, configuration) {
  if (!modeler || !element) return;
  const modeling = modeler.get("modeling");
  const moddle = modeler.get("moddle");
  const bo = element.businessObject;
  if (!bo || !modeling || !moddle) return;

  let extensionElements = bo.get("extensionElements");
  if (!extensionElements) {
    extensionElements = moddle.create("bpmn:ExtensionElements", { values: [] });
    modeling.updateProperties(element, { extensionElements });
  }

  const values = [...(extensionElements.get("values") || [])];
  const body = JSON.stringify(configuration ?? {});
  const existingIndex = values.findIndex(
    (v) =>
      v?.$type === LOS_ACTIVITY_CONFIGURATION_TYPE ||
      v?.$type === "los:activityConfiguration"
  );

  if (existingIndex >= 0) {
    const existing = values[existingIndex];
    modeling.updateModdleProperties(element, existing, { body });
    return;
  }

  const created = moddle.create(LOS_ACTIVITY_CONFIGURATION_TYPE, { body });
  modeling.updateModdleProperties(element, extensionElements, {
    values: [...values, created]
  });
}

/**
 * Hydrate a map of activityId → configuration from all shapes in the modeler.
 * @returns {Map<string, { elementType: string, configuration: Record<string, unknown> }>}
 */
export function collectActivityConfigurationsFromModeler(modeler) {
  /** @type {Map<string, { elementType: string, configuration: Record<string, unknown> }>} */
  const out = new Map();
  if (!modeler) return out;
  const elementRegistry = modeler.get("elementRegistry");
  elementRegistry.forEach((element) => {
    if (!element?.id || element.type === "label") return;
    if (!element.businessObject || element.businessObject.$type === "bpmn:Process") return;
    if (element.type === "bpmn:SequenceFlow" || element.type === "bpmn:MessageFlow") return;
    const configuration = readActivityConfigurationFromElement(element);
    if (!configuration) return;
    out.set(element.id, {
      elementType: element.type || element.businessObject?.$type || "",
      configuration
    });
  });
  return out;
}
