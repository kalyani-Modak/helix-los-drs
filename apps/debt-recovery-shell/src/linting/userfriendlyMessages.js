// src/linting/userfriendlyMessages.js
const friendlyMessages = {
  'start-event-required': () => "This process needs a Start Event.",
  'end-event-required': () => "This process needs an End Event.",
  'no-disconnected': (i) => `"${i.elementName || i.elementId}" isn't connected to the rest of the flow.`,
  'no-implicit-split': (i) => `"${i.elementName || i.elementId}" has multiple outgoing paths — use a gateway to split the flow instead.`,
  'fake-join': (i) => `Multiple paths merge into "${i.elementName || i.elementId}" without a gateway — add a gateway to join them properly.`,
  'no-duplicate-sequence-flows': () => "There are two identical connections between the same steps — remove the duplicate.",
  'label-required': (i) => `This ${i.elementType || "element"} needs a name.`,
  'no-inclusive-gateway': () => "Inclusive gateways aren't allowed — use an exclusive or parallel gateway instead.",
  'no-complex-gateway': () => "Complex gateways aren't allowed — simplify this into exclusive/parallel gateways.",
  'superfluous-gateway': (i) => `"${i.elementName || i.elementId}" is a gateway with only one path in and one out — it can be removed.`,
  'no-overlapping-elements': () => "Some shapes are overlapping on the canvas — move them apart for clarity.",
  'single-blank-start-event': () => "Only one unnamed Start Event is allowed — name the extra ones or remove them.",
  'no-implicit-start': (i) => `"${i.elementName || i.elementId}" starts a flow without a proper Start Event.`,
  'no-implicit-end': (i) => `"${i.elementName || i.elementId}" ends a flow without a proper End Event.`,
  'conditional-flows': (i) => `"${i.elementName || i.elementId}" has a conditional flow that isn't coming from a gateway.`,
  'no-bpmndi': () => "This diagram is missing visual layout information.",
  'sub-process-blank-start-event': () => "Sub-process start event should not be blank.",
  'no-gateway-join-fork': (i) => `"${i.elementName || i.elementId}" both joins and forks flow — split this into two gateways.`,
  'ad-hoc-sub-process': () => "Check the ad-hoc sub-process configuration.",
  'conditional-event': () => "Check the conditional event configuration.",
  'event-based-gateway': () => "Check the event-based gateway configuration.",
  'event-sub-process-typed-start-event': () => "Event sub-process start event should have a specific type.",
  'link-event': () => "Check the link event configuration — throw/catch pairs should match.",
  'single-event-definition': () => "This event should only have one event definition.",
  'superfluous-termination': (i) => `"${i.elementName || i.elementId}" has an unnecessary end event — flow already terminates naturally.`
};
export function getFriendlyMessage(issue) {
  if (!issue || !issue.rule) return issue?.message || "Unknown validation issue.";
  const mapper = friendlyMessages[issue.rule];
  return mapper ? mapper(issue) : issue.message;
}
export function formatRuleName(rule) {
  if (!rule || typeof rule !== "string") return "Validation Issue";
  return rule
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
