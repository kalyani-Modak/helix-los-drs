import { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import NavigatedViewer from "bpmn-js/lib/NavigatedViewer";
import { applyActivityMarkers, applySelectionMarker } from "../pages/bpmn/diagramMarkers.js";
import CustomIconRendererModule from "../pages/bpmn/provider/CustomIconRendererModule.js";
import flowableModdleDescriptor from "../pages/bpmn/moddle/flowable.json";
import losModdleDescriptor from "../pages/bpmn/moddle/los.json";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "./BpmnCanvas.css";

/** Session zoom levels keyed by diagram id (e.g. processInstanceId). */
const zoomCache = new Map();

function fitDiagramToViewport(viewer, host) {
  const canvas = viewer.get("canvas");
  const { width, height } = host.getBoundingClientRect();
  if (width < 10 || height < 10) {
    return;
  }
  canvas.resized();
  canvas.zoom("fit-viewport");
}

function applyZoomOrFit(viewer, host, cacheKey) {
  const canvas = viewer.get("canvas");
  const { width, height } = host.getBoundingClientRect();
  if (width < 10 || height < 10) {
    return;
  }
  canvas.resized();
  const saved = cacheKey ? zoomCache.get(cacheKey) : undefined;
  if (typeof saved === "number" && saved > 0) {
    canvas.zoom(saved);
  } else {
    canvas.zoom("fit-viewport");
  }
}

function scheduleApplyZoom(viewer, host, cacheKey) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      applyZoomOrFit(viewer, host, cacheKey);
    });
  });
}

function rememberZoom(viewer, cacheKey) {
  if (!cacheKey) return;
  try {
    const z = viewer.get("canvas").zoom();
    if (typeof z === "number" && z > 0) {
      zoomCache.set(cacheKey, z);
    }
  } catch {
    /* ignore */
  }
}

function isClickableWorkflowShape(element) {
  if (!element?.type || !element.businessObject?.id) {
    return false;
  }
  if (element.type === "label") {
    return false;
  }
  if (element.type.includes("SequenceFlow") || element.type.includes("Connection")) {
    return false;
  }
  if (element.type.includes("Process") || element.type.includes("Collaboration") || element.type.includes("Participant")) {
    return false;
  }
  return true;
}

/**
 * @param {Object} props
 * @param {string|null} props.xml
 * @param {Array|null} [props.activityStates]
 * @param {string} [props.toolbarTitle]
 * @param {boolean} [props.showExecutionLegend]
 * @param {(activityId: string, elementType: string) => void} [props.onElementClick]
 * @param {string|null} [props.selectedActivityId]
 * @param {boolean} [props.compact]
 * @param {string|null} [props.zoomCacheKey]
 */
export function BpmnCanvas({
  xml,
  activityStates,
  toolbarTitle = "Workflow preview",
  showExecutionLegend = true,
  onElementClick,
  selectedActivityId = null,
  compact = false,
  zoomCacheKey = null,
}) {
  const rootRef = useRef(null);
  const hostRef = useRef(null);
  const viewerRef = useRef(null);
  const diagramReadyRef = useRef(false);
  const activityStatesRef = useRef(activityStates);
  activityStatesRef.current = activityStates;
  const selectedActivityIdRef = useRef(selectedActivityId);
  selectedActivityIdRef.current = selectedActivityId;
  const onElementClickRef = useRef(onElementClick);
  onElementClickRef.current = onElementClick;
  const zoomCacheKeyRef = useRef(zoomCacheKey);
  zoomCacheKeyRef.current = zoomCacheKey;
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !xml) {
      diagramReadyRef.current = false;
      if (viewerRef.current) {
        rememberZoom(viewerRef.current, zoomCacheKeyRef.current);
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      host?.replaceChildren();
      return;
    }

    let cancelled = false;
    diagramReadyRef.current = false;

    if (viewerRef.current) {
      rememberZoom(viewerRef.current, zoomCacheKeyRef.current);
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    const viewer = new NavigatedViewer({
      container: host,
      additionalModules: [CustomIconRendererModule],
      moddleExtensions: {
        flowable: flowableModdleDescriptor,
        los: losModdleDescriptor,
      },
    });
    viewerRef.current = viewer;

    const eventBus = viewer.get("eventBus");

    const handleClick = (e) => {
      const el = e.element;
      if (!isClickableWorkflowShape(el ?? null)) {
        return;
      }
      const activityId = el?.businessObject?.id || el?.id;
      if (!activityId || !onElementClickRef.current) {
        return;
      }
      const elementType = el?.businessObject?.$type?.replace("bpmn:", "") || el?.type || "";
      onElementClickRef.current(activityId, elementType);
    };
    eventBus.on("element.click", handleClick);

    const resizeObserver = new ResizeObserver(() => {
      if (!diagramReadyRef.current || cancelled) {
        return;
      }
      applyZoomOrFit(viewer, host, zoomCacheKeyRef.current);
    });
    resizeObserver.observe(host);

    viewer
      .importXML(xml)
      .then(() => {
        if (cancelled) return;
        diagramReadyRef.current = true;
        scheduleApplyZoom(viewer, host, zoomCacheKeyRef.current);
        applyActivityMarkers(viewer, activityStatesRef.current);
        applySelectionMarker(viewer, selectedActivityIdRef.current);
      })
      .catch((err) => {
        console.error("BPMN import failed", err);
      });

    return () => {
      cancelled = true;
      diagramReadyRef.current = false;
      rememberZoom(viewer, zoomCacheKeyRef.current);
      eventBus.off("element.click", handleClick);
      resizeObserver.disconnect();
      viewer.destroy();
      if (viewerRef.current === viewer) {
        viewerRef.current = null;
      }
      host.replaceChildren();
    };
  }, [xml, zoomCacheKey]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !diagramReadyRef.current) {
      return;
    }
    applyActivityMarkers(viewer, activityStates);
    applySelectionMarker(viewer, selectedActivityIdRef.current);
  }, [activityStates]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !diagramReadyRef.current) {
      return;
    }
    applySelectionMarker(viewer, selectedActivityId);
  }, [selectedActivityId]);

  const withCanvas = (fn) => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    fn(viewer.get("canvas"));
    rememberZoom(viewer, zoomCacheKeyRef.current);
  };

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      void el.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  };

  const zoomControls = (
    <div className="bpmn-toolbar__actions">
      <Button
        size="small"
        variant="outlined"
        className="drs-themed-button"
        disabled={!xml}
        onClick={() =>
          withCanvas((c) => {
            const z = c.zoom();
            if (typeof z === "number") {
              c.zoom(z * 1.2);
            }
          })
        }
      >
        Zoom in
      </Button>
      <Button
        size="small"
        variant="outlined"
        className="drs-themed-button"
        disabled={!xml}
        onClick={() =>
          withCanvas((c) => {
            const z = c.zoom();
            if (typeof z === "number") {
              c.zoom(z / 1.2);
            }
          })
        }
      >
        Zoom out
      </Button>
      <Button
        size="small"
        variant="outlined"
        className="drs-themed-button"
        disabled={!xml}
        onClick={() => {
          const viewer = viewerRef.current;
          const host = hostRef.current;
          if (viewer && host) {
            fitDiagramToViewport(viewer, host);
            if (zoomCacheKeyRef.current) {
              zoomCache.delete(zoomCacheKeyRef.current);
            }
          }
        }}
      >
        Fit
      </Button>
      <Button
        size="small"
        variant="outlined"
        className="drs-themed-button"
        disabled={!xml}
        onClick={toggleFullscreen}
        title="Fullscreen"
      >
        {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      </Button>
    </div>
  );

  const legend = showExecutionLegend ? (
    <ul className="bpmn-mini-legend" aria-label="Activity status colors">
      <li>
        <span className="bpmn-mini-legend__dot bpmn-mini-legend__dot--success" /> Completed
      </li>
      <li>
        <span className="bpmn-mini-legend__dot bpmn-mini-legend__dot--active" /> Running
      </li>
      <li>
        <span className="bpmn-mini-legend__dot bpmn-mini-legend__dot--error" /> Failed
      </li>
      <li>
        <span className="bpmn-mini-legend__dot bpmn-mini-legend__dot--pending" /> Pending
      </li>
      <li>
        <span className="bpmn-mini-legend__dot bpmn-mini-legend__dot--skipped" /> Skipped
      </li>
    </ul>
  ) : null;

  if (compact) {
    return (
      <div
        className={`bpmn-root bpmn-root--compact ${isFullscreen ? "bpmn-root--fullscreen" : ""} ${!showExecutionLegend ? "bpmn-root--no-legend" : ""}`}
        ref={rootRef}
      >
        <div className="bpmn-host bpmn-host--compact" ref={hostRef} />
        <div className="bpmn-footer-bar">
          <div className="bpmn-footer-bar__legend">{legend}</div>
          {zoomControls}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bpmn-root ${isFullscreen ? "bpmn-root--fullscreen" : ""} ${!showExecutionLegend ? "bpmn-root--no-legend" : ""}`}
      ref={rootRef}
    >
      <div className="bpmn-toolbar">
        <div className="bpmn-toolbar__left">
          <span className="bpmn-toolbar__title">{toolbarTitle}</span>
        </div>
        {zoomControls}
      </div>
      <div className="bpmn-host" ref={hostRef} />
      {showExecutionLegend && (
        <footer className="bpmn-legend-footer" aria-label="Activity status colors">
          {legend}
        </footer>
      )}
    </div>
  );
}

export default BpmnCanvas;
