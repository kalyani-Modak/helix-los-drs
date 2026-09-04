export const ICON_BASE = `${import.meta.env.BASE_URL}images/designer/`;

export const THEME_COLOR = "#2c8afd";

export function designerIcon(fileName) {
  return ICON_BASE + fileName;
}

export const SHAPE_ICONS = {
  "bpmn:StartEvent": { image: designerIcon("start.default.png"), isEvent: true },
  "bpmn:EndEvent": { image: designerIcon("end.default.png"), isEvent: true },
  "bpmn:UserTask": { image: designerIcon("userwf.palette.png") },
  "bpmn:ServiceTask": { image: designerIcon("systemwf.palette.png") },
  "bpmn:BusinessRuleTask": { image: designerIcon("decisionwf.palette.png") },
  "bpmn:CallActivity": { image: designerIcon("childprocesswf.pallet.png") },
  "bpmn:ExclusiveGateway": { image: designerIcon("exclusive-gateway-svgrepo-com.png") },
  "bpmn:ParallelGateway": { image: designerIcon("parallel-gateway-svgrepo-com.png") },
  "bpmn:InclusiveGateway": { image: designerIcon("inclusive-gateway-svgrepo-com.png") },
  "bpmn:ComplexGateway": { image: designerIcon("complex-gateway-svgrepo-com.png") },
  "bpmn:EventBasedGateway": { image: designerIcon("event-based-gateway.png") },
  "bpmn:DataStoreReference": { image: designerIcon("database.storage.png") },
};

export const EVENT_DEFINITION_ICONS = {
  "bpmn:MessageEventDefinition": designerIcon("mail-svgrepo-com.png"),
  "bpmn:TimerEventDefinition": designerIcon("delay.default.png"),
  "bpmn:SignalEventDefinition": designerIcon("broadcast.default.png"),
  "bpmn:EscalationEventDefinition": designerIcon("alert.default.png"),
  "bpmn:ConditionalEventDefinition": designerIcon("wait.default.png"),
  "bpmn:LinkEventDefinition": designerIcon("wait.default.png"),
  "bpmn:CompensateEventDefinition": designerIcon("notify.default.png"),
};

export const PALETTE_ICONS = {
  start: designerIcon("start.default.png"),
  end: designerIcon("end.default.png"),
  user: designerIcon("userwf.palette.png"),
  system: designerIcon("systemwf.palette.png"),
  decision: designerIcon("decisionwf.palette.png"),
  child: designerIcon("childprocesswf.pallet.png"),
  dataStore: designerIcon("database.storage.png"),
  wait: designerIcon("wait.default.png"),
  notify: designerIcon("notify.default.png"),
  gateway: designerIcon("exclusive-gateway-svgrepo-com.png"),
  exclusiveGateway: designerIcon("exclusive-gateway-svgrepo-com.png"),
  parallelGateway: designerIcon("parallel-gateway-svgrepo-com.png"),
  inclusiveGateway: designerIcon("inclusive-gateway-svgrepo-com.png"),
  complexGateway: designerIcon("complex-gateway-svgrepo-com.png"),
  eventBasedGateway: designerIcon("event-based-gateway.png"),
  message: designerIcon("mail-svgrepo-com.png"),
  timer: designerIcon("delay.default.png"),
  signal: designerIcon("broadcast.default.png"),
  escalation: designerIcon("alert.default.png"),
  catchNone: designerIcon("wait.default.png"),
  throwNone: designerIcon("notify.default.png"),
  link: designerIcon("wait.default.png"),
  compensation: designerIcon("notify.default.png"),
  conditional: designerIcon("wait.default.png"),
};

export const CONTEXT_PAD_ICONS = {
  delete: designerIcon("delete.png"),
  replace: designerIcon("wrench.png"),
  "append.end-event": designerIcon("end.default.png"),
  "append.gateway": designerIcon("exclusive-gateway-svgrepo-com.png"),
  "append.append-task": designerIcon("user.default.png"),
  "append.intermediate-event": designerIcon("wait.default.png"),
  connect: designerIcon("connector.png"),
};