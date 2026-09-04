import { PALETTE_ICONS } from "./designerIcons";

const WAIT_ITEMS = [
  { label: "Intermediate catch event", image: PALETTE_ICONS.catchNone, type: "bpmn:IntermediateCatchEvent" },
  { label: "Message intermediate catch event", image: PALETTE_ICONS.message, type: "bpmn:IntermediateCatchEvent", def: "bpmn:MessageEventDefinition" },
  { label: "Timer intermediate catch event", image: PALETTE_ICONS.timer, type: "bpmn:IntermediateCatchEvent", def: "bpmn:TimerEventDefinition" },
  { label: "Conditional intermediate catch event", image: PALETTE_ICONS.conditional, type: "bpmn:IntermediateCatchEvent", def: "bpmn:ConditionalEventDefinition" },
  { label: "Link intermediate catch event", image: PALETTE_ICONS.link, type: "bpmn:IntermediateCatchEvent", def: "bpmn:LinkEventDefinition" },
  { label: "Signal intermediate catch event", image: PALETTE_ICONS.signal, type: "bpmn:IntermediateCatchEvent", def: "bpmn:SignalEventDefinition" },
];

const NOTIFY_ITEMS = [
  { label: "Intermediate throw event", image: PALETTE_ICONS.throwNone, type: "bpmn:IntermediateThrowEvent" },
  { label: "Message intermediate throw event", image: PALETTE_ICONS.message, type: "bpmn:IntermediateThrowEvent", def: "bpmn:MessageEventDefinition" },
  { label: "Escalation intermediate throw event", image: PALETTE_ICONS.escalation, type: "bpmn:IntermediateThrowEvent", def: "bpmn:EscalationEventDefinition" },
  { label: "Link intermediate throw event", image: PALETTE_ICONS.link, type: "bpmn:IntermediateThrowEvent", def: "bpmn:LinkEventDefinition" },
  { label: "Signal intermediate throw event", image: PALETTE_ICONS.signal, type: "bpmn:IntermediateThrowEvent", def: "bpmn:SignalEventDefinition" },
  { label: "Compensation intermediate throw event", image: PALETTE_ICONS.compensation, type: "bpmn:IntermediateThrowEvent", def: "bpmn:CompensateEventDefinition" },
];

const GATEWAY_ITEMS = [
  { label: "Exclusive gateway", image: PALETTE_ICONS.exclusiveGateway, type: "bpmn:ExclusiveGateway" },
  { label: "Parallel gateway", image: PALETTE_ICONS.parallelGateway, type: "bpmn:ParallelGateway" },
  { label: "Inclusive gateway", image: PALETTE_ICONS.inclusiveGateway, type: "bpmn:InclusiveGateway" },
  { label: "Complex gateway", image: PALETTE_ICONS.complexGateway, type: "bpmn:ComplexGateway" },
  { label: "Event-based gateway", image: PALETTE_ICONS.eventBasedGateway, type: "bpmn:EventBasedGateway" },
];

let activeFlyout = null;
let documentClickHandler = null;

function closeFlyout() {
  if (activeFlyout) {
    activeFlyout.remove();
    activeFlyout = null;
  }
  if (documentClickHandler) {
    document.removeEventListener("click", documentClickHandler, true);
    documentClickHandler = null;
  }
}

function openFlyout(originEvent, title, items, onSelect) {
  closeFlyout();

  const target = originEvent.target;
  const targetEl = (target && target.closest && target.closest(".entry")) || target;
  const rect = targetEl?.getBoundingClientRect ? targetEl.getBoundingClientRect() : { top: 0, right: 0 };

  const flyout = document.createElement("div");
  flyout.className = "custom-palette-flyout";
  Object.assign(flyout.style, {
    position: "fixed",
    top: `${rect.top}px`,
    left: `${rect.right + 8}px`,
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    padding: "4px 0",
    zIndex: "1000",
    minWidth: "260px",
    maxHeight: "320px",
    overflowY: "auto",
    fontSize: "13px",
    fontFamily: "inherit",
    visibility: "hidden",
  });

  const heading = document.createElement("div");
  heading.textContent = title;
  Object.assign(heading.style, {
    padding: "6px 12px",
    fontWeight: "600",
    borderBottom: "1px solid #eee",
    color: "#333",
  });
  flyout.appendChild(heading);

  items.forEach((item) => {
    const row = document.createElement("div");
    Object.assign(row.style, {
      padding: "6px 12px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    });

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = "";
    Object.assign(img.style, {
      width: "24px",
      height: "24px",
      objectFit: "contain",
      flexShrink: "0",
      pointerEvents: "none",
    });
    row.appendChild(img);

    const labelEl = document.createElement("span");
    labelEl.textContent = item.label;
    row.appendChild(labelEl);
    row.addEventListener("mouseenter", () => { row.style.background = "#f0f4ff"; });
    row.addEventListener("mouseleave", () => { row.style.background = "transparent"; });
    row.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      closeFlyout();
      onSelect(item);
    });
    flyout.appendChild(row);
  });

  document.body.appendChild(flyout);
  activeFlyout = flyout;

  const flyoutRect = flyout.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const margin = 8;

  let top = rect.top;
  if (top + flyoutRect.height > viewportHeight - margin) {
    top = Math.max(margin, viewportHeight - flyoutRect.height - margin);
  }
  flyout.style.top = `${top}px`;
  flyout.style.visibility = "visible";

  documentClickHandler = (domEvent) => {
    if (activeFlyout && !activeFlyout.contains(domEvent.target)) {
      closeFlyout();
    }
  };
  setTimeout(() => document.addEventListener("click", documentClickHandler, true), 0);
}

export default class CustomPaletteProvider {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(500, this);
  }

  getPaletteEntries() {
    const { bpmnFactory, create, elementFactory, translate } = this;

    const createNode = (type, properties = {}) => (event) => {
      const businessObject = bpmnFactory.create(type, properties);
      const sizeHints = {
        "bpmn:UserTask": { width: 88, height: 100 },
        "bpmn:ServiceTask": { width: 88, height: 100 },
        "bpmn:BusinessRuleTask": { width: 88, height: 100 },
        "bpmn:CallActivity": { width: 88, height: 100 },
        "bpmn:DataStoreReference": { width: 72, height: 90 },
        "bpmn:StartEvent": { width: 48, height: 48 },
        "bpmn:EndEvent": { width: 48, height: 48 },
        "bpmn:ExclusiveGateway": { width: 50, height: 50 },
        "bpmn:ParallelGateway": { width: 50, height: 50 },
        "bpmn:InclusiveGateway": { width: 50, height: 50 },
        "bpmn:ComplexGateway": { width: 50, height: 50 },
        "bpmn:EventBasedGateway": { width: 50, height: 50 },
      };
      const size = sizeHints[type] || {};
      const shape = elementFactory.createShape({ type, businessObject, ...size });
      create.start(event, shape);
    };

    const createEventNode = (type, eventDefinitionType) => (event) => {
      const eventDefinition = eventDefinitionType ? bpmnFactory.create(eventDefinitionType) : undefined;
      const businessObject = bpmnFactory.create(type, {
        eventDefinitions: eventDefinition ? [eventDefinition] : [],
      });
      const shape = elementFactory.createShape({ type, businessObject, width: 48, height: 48 });
      create.start(event, shape);
    };

    return (entries) => {
      [
        "create.task",
        "create.intermediate-event",
        "create.exclusive-gateway",
        "create.subprocess-expanded",
        "create.participant-expanded",
        "create.data-object",
        "create.data-store",
        "create.start-event",
        "create.end-event",
      ].forEach((key) => { delete entries[key]; });

      entries["create.start-event"] = {
        group: "event",
        imageUrl: PALETTE_ICONS.start,
        title: translate("Create Start"),
        action: { dragstart: createNode("bpmn:StartEvent"), click: createNode("bpmn:StartEvent") },
      };

      entries["create.user-activity"] = {
        group: "activity",
        imageUrl: PALETTE_ICONS.user,
        title: translate("Create User"),
        action: { dragstart: createNode("bpmn:UserTask"), click: createNode("bpmn:UserTask") },
      };

      entries["create.data-store"] = {
        group: "activity",
        imageUrl: PALETTE_ICONS.dataStore,
        title: translate("Create Data Store Reference"),
        action: { dragstart: createNode("bpmn:DataStoreReference"), click: createNode("bpmn:DataStoreReference") },
      };

      entries["create.system-activity"] = {
        group: "activity",
        imageUrl: PALETTE_ICONS.system,
        title: translate("Create System"),
        action: { dragstart: createNode("bpmn:ServiceTask"), click: createNode("bpmn:ServiceTask") },
      };

      entries["create.service-task"] = {
        group: "activity",
        className: "bpmn-icon-service-task",
        title: translate("Service Task"),
        action: {
          dragstart: createNode("bpmn:ServiceTask", { name: "Send Email", "flowable:delegateExpression": "${emailDelegate}" }),
          click: createNode("bpmn:ServiceTask", { name: "Send Email", "flowable:delegateExpression": "${emailDelegate}" }),
        },
      };

      entries["create.decision-activity"] = {
        group: "activity",
        imageUrl: PALETTE_ICONS.decision,
        title: translate("Create Decision"),
        action: { dragstart: createNode("bpmn:BusinessRuleTask"), click: createNode("bpmn:BusinessRuleTask") },
      };

      entries["create.wait-activity"] = {
        group: "event",
        imageUrl: PALETTE_ICONS.wait,
        title: translate("Create Wait"),
        action: {
          dragstart: createEventNode("bpmn:IntermediateCatchEvent"),
          click: (event) => {
            openFlyout(event, "Wait Events", WAIT_ITEMS, (item) => { createEventNode(item.type, item.def)(event); });
          },
        },
      };

      entries["create.notify-activity"] = {
        group: "event",
        imageUrl: PALETTE_ICONS.notify,
        title: translate("Create Notify"),
        action: {
          dragstart: createEventNode("bpmn:IntermediateThrowEvent"),
          click: (event) => {
            openFlyout(event, "Notify Events", NOTIFY_ITEMS, (item) => { createEventNode(item.type, item.def)(event); });
          },
        },
      };

      entries["create.child-activity"] = {
        group: "activity",
        imageUrl: PALETTE_ICONS.child,
        title: translate("Create Child"),
        action: { dragstart: createNode("bpmn:CallActivity"), click: createNode("bpmn:CallActivity") },
      };

      entries["create.xorconnector"] = {
        group: "gateway",
        imageUrl: PALETTE_ICONS.gateway,
        title: translate("Create Gateway"),
        action: {
          dragstart: createNode("bpmn:ExclusiveGateway"),
          click: (event) => {
            openFlyout(event, "Gateways", GATEWAY_ITEMS, (item) => { createNode(item.type)(event); });
          },
        },
      };

      entries["create.end-event"] = {
        group: "event",
        imageUrl: PALETTE_ICONS.end,
        title: translate("Create End"),
        action: { dragstart: createNode("bpmn:EndEvent"), click: createNode("bpmn:EndEvent") },
      };

      return entries;
    };
  }
}

CustomPaletteProvider.$inject = ["bpmnFactory", "create", "elementFactory", "palette", "translate"];