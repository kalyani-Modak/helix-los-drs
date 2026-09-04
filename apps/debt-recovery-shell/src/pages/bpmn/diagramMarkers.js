/** CSS class names passed to Canvas.addMarker. */
export const EXECUTION_MARKERS = [
  "wf-execution-success",
  "wf-execution-error",
  "wf-execution-active",
  "wf-execution-pending",
  "wf-execution-skipped",
];

/** Operator selection outline on Graphical Log (independent of execution status colors). */
export const SELECTION_MARKER = "wf-selected";

/** Resolve Flowable activity id to a BPMN element id present in the diagram (exact, then case-insensitive). */
function resolveShapeId(registry, activityId) {
  if (!activityId) {
    return null;
  }
  if (registry.get(activityId)) {
    return activityId;
  }
  const want = activityId.toLowerCase();
  let found = null;
  registry.forEach((el) => {
    if (found || !el?.id || el.type === "label") {
      return;
    }
    if (el.id.toLowerCase() === want) {
      found = el.id;
    }
  });
  return found;
}

/** Maps API / Flowable status to a bpmn-js canvas marker class. */
export function statusToMarker(status) {
  const s = status.toUpperCase().trim();
  if (s === "SUCCESS" || s === "COMPLETED") {
    return "wf-execution-success";
  }
  if (s === "ERROR" || s === "FAILED" || s === "REJECTED") {
    return "wf-execution-error";
  }
  if (s === "ACTIVE" || s === "IN_PROGRESS" || s === "RUNNING") {
    return "wf-execution-active";
  }
  if (s === "PENDING" || s === "WAITING" || s === "SUSPENDED") {
    return "wf-execution-pending";
  }
  if (s === "SKIPPED") {
    return "wf-execution-skipped";
  }
  return null;
}

/** Clears workflow markers, then applies markers from the latest diagram-state API response. */
export function applyActivityMarkers(viewer, states) {
  const canvas = viewer.get("canvas");
  const elementRegistry = viewer.get("elementRegistry");

  elementRegistry.forEach((el) => {
    if (!el?.id || el.type === "label") {
      return;
    }
    for (const marker of EXECUTION_MARKERS) {
      try {
        canvas.removeMarker(el.id, marker);
      } catch {
        /* element may not support markers */
      }
    }
  });

  if (!states?.length) {
    return;
  }

  for (const row of states) {
    const marker = statusToMarker(row.status);
    const shapeId = resolveShapeId(elementRegistry, row.activityId);
    if (!marker || !shapeId) {
      continue;
    }
    canvas.addMarker(shapeId, marker);
  }
}

/** Highlights the activity the operator clicked; cleared when selectedActivityId is null. */
export function applySelectionMarker(viewer, selectedActivityId) {
  const canvas = viewer.get("canvas");
  const elementRegistry = viewer.get("elementRegistry");

  elementRegistry.forEach((el) => {
    if (!el?.id || el.type === "label") {
      return;
    }
    try {
      canvas.removeMarker(el.id, SELECTION_MARKER);
    } catch {
      /* ignore */
    }
  });

  if (!selectedActivityId) {
    return;
  }
  const shapeId = resolveShapeId(elementRegistry, selectedActivityId);
  if (!shapeId) {
    return;
  }
  try {
    canvas.addMarker(shapeId, SELECTION_MARKER);
  } catch {
    /* ignore */
  }
}
