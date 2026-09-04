import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BpmnJS from "bpmn-js/dist/bpmn-modeler.development.js";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from "bpmn-js-properties-panel";
import lintModule from "bpmn-js-bpmnlint";
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import flowableModdleDescriptor from "./bpmn/moddle/flowable.json";
import losModdleDescriptor from "./bpmn/moddle/los.json";
import FlowablePropertiesProviderModule from "./bpmn/provider/FlowablePropertiesProvider.js";
import CustomIconRendererModule from "./bpmn/provider/CustomIconRendererModule.js";
import CustomPaletteModule from "./bpmn/provider/CustomPaletteModule.js";
import CustomContextPadModule from "./bpmn/provider/CustomContextPadModule.js";
import {
  invalidateWorkflowCatalog,
  setCurrentWorkflowName
} from "./bpmn/provider/workflowCatalog.js";
import {
  ensureActivityMetadataLoaded,
  flushAllPendingActivityMetadataSaves,
  hydrateActivityMetadataFromBpmn,
  setActivityMetadataFallbackWorkflowName,
  setActivityMetadataModeler,
  setActivityMetadataWorkflowName
} from "./bpmn/provider/activityMetadataCatalog.js";

import {
  saveWorkflow,
  loadWorkflowByName,
  getAllWorkflows,
  validateWorkflowXSD,
  downloadWorkflow
} from "../services/workflowService";

import { bpmnlintOptions } from "../linting/bpmnlintConfig";
import { toValidBpmnProcessId } from "../utils/bpmnProcessId";
import LintIssueRow from "../components/LintIssueRow";
import {
  applyAsyncFlagsToBpmnXml,
  applyAsyncFlagsToChildWorkflowsRecursively,
  applyAsyncFlagsToWorkflow,
  readWorkflowAsyncFlags
} from "../utils/bpmnAsyncProperties";

import "../styles/workflowDesigner.css";

/** Remove empty multi-instance markers that Flowable rejects on deploy. */
function stripEmptyMultiInstanceLoopCharacteristics(bpmnXml) {
  if (!bpmnXml) return bpmnXml;
  return bpmnXml.replace(
    /<(?:([a-z0-9]+):)?multiInstanceLoopCharacteristics\b([^>]*)(?:\/>|>([\s\S]*?)<\/(?:\1:)?multiInstanceLoopCharacteristics>)/gi,
    (full, _prefix, attrs = "", body = "") => {
      const combined = `${attrs} ${body}`;
      if (/\b(?:flowable:)?collection\b|\bloopCardinality\b|\bloopDataInputRef\b/i.test(combined)) {
        return full;
      }
      return "";
    },
  );
}

const defaultDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
xmlns:flowable="http://flowable.org/bpmn"
xmlns:los="http://los.cursor.local/bpmn"
id="Definitions_1"
targetNamespace="http://bpmn.io/schema/bpmn">

<bpmn:process id="Process_1" isExecutable="true">
<bpmn:startEvent id="StartEvent_1"/>
</bpmn:process>

<bpmndi:BPMNDiagram id="BPMNDiagram_1">
<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">

<bpmndi:BPMNShape
id="StartEventShape"
bpmnElement="StartEvent_1">
<dc:Bounds x="100" y="100" width="36" height="36"/>
</bpmndi:BPMNShape>

</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>

</bpmn:definitions>`;

const DEFAULT_DELEGATE_EXPRESSION = "refreshParamsDelegate";

export default function WorkflowDesignerPage() {
  const navigate = useNavigate();
  const isExistingWorkflow = useRef(false);
  const containerRef = useRef(null);
  const designerWrapperRef = useRef(null);
  const propertiesPanelRef = useRef(null);
  const modelerRef = useRef(null);
  const highlightedIdRef = useRef(null);
  const asyncBeforeRef = useRef(false);
  const asyncAfterRef = useRef(false);

  const [workflowName, setWorkflowName] = useState("");
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [lintIssues, setLintIssues] = useState([]);
  const [showLintPanel, setShowLintPanel] = useState(false);
  const [asyncBefore, setAsyncBefore] = useState(false);
  const [asyncAfter, setAsyncAfter] = useState(false);
  const [globalExecutionListener, setGlobalExecutionListener] = useState(false);
  const [delegateExpression, setDelegateExpression] = useState(DEFAULT_DELEGATE_EXPRESSION);
  const [workflowDiagramReady, setWorkflowDiagramReady] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const syncAsyncToolbarFromWorkflow = (modeler = modelerRef.current) => {
    if (!modeler) {
      return;
    }

    const flags = readWorkflowAsyncFlags(modeler);
    asyncBeforeRef.current = flags.asyncBefore;
    asyncAfterRef.current = flags.asyncAfter;
    setAsyncBefore(flags.asyncBefore);
    setAsyncAfter(flags.asyncAfter);
    setWorkflowDiagramReady(true);
  };

  const handleAsyncBeforeChange = (checked) => {
    asyncBeforeRef.current = checked;
    setAsyncBefore(checked);
  };

  const handleAsyncAfterChange = (checked) => {
    asyncAfterRef.current = checked;
    setAsyncAfter(checked);
  };

  const closePropertiesPanel = () => {
    const modeler = modelerRef.current;
    if (modeler) {
      modeler.get("selection").select([]);
    }
    setShowPropertiesPanel(false);
  };

  const applyToolbarAsyncFlagsBeforeExport = async () => {
    if (!modelerRef.current || !workflowName.trim()) {
      return null;
    }

    applyAsyncFlagsToWorkflow(
      modelerRef.current,
      asyncBeforeRef.current,
      asyncAfterRef.current
    );

    let rootXml = await getXml();
    rootXml = stripEmptyMultiInstanceLoopCharacteristics(rootXml);
    rootXml = applyAsyncFlagsToBpmnXml(
      rootXml,
      asyncBeforeRef.current,
      asyncAfterRef.current
    );

    await applyAsyncFlagsToChildWorkflowsRecursively(
      workflowName.trim(),
      rootXml,
      asyncBeforeRef.current,
      asyncAfterRef.current,
      loadWorkflowByName,
      saveWorkflow
    );

    return rootXml;
  };

  const fitCanvas = () => {
    const modeler = modelerRef.current;
    if (!modeler) return;
    try {
      const canvas = modeler.get("canvas");
      canvas.zoom("fit-viewport", "auto");
    } catch (e) {
      console.error("Fit viewport failed", e);
    }
  };

  const zoomBy = (delta) => {
    const modeler = modelerRef.current;
    if (!modeler) return;
    try {
      const canvas = modeler.get("canvas");
      const current = canvas.zoom();
      const next = Math.min(3, Math.max(0.2, current + delta));
      canvas.zoom(next);
    } catch (e) {
      console.error("Zoom failed", e);
    }
  };

  const toggleFullscreen = async () => {
    const el = designerWrapperRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen failed", e);
    }
  };

  // Initialize BPMN Modeler
  useEffect(() => {
    const container = containerRef.current;
    const propertiesParent = propertiesPanelRef.current;
    if (!container || !propertiesParent) return;

    let cancelled = false;
    let modeler = null;

    const startModeler = () => {
      if (cancelled || !containerRef.current || !propertiesPanelRef.current) {
        return;
      }

      modeler = new BpmnJS({
        container: containerRef.current,
        propertiesPanel: {
          parent: propertiesPanelRef.current
        },
        additionalModules: [
          lintModule,
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          FlowablePropertiesProviderModule,
          CustomIconRendererModule,
          CustomPaletteModule,
          CustomContextPadModule
        ],
        moddleExtensions: {
          flowable: flowableModdleDescriptor,
          los: losModdleDescriptor
        },
        linting: {
          bpmnlint: bpmnlintOptions
        }
      });

      modelerRef.current = modeler;
      setActivityMetadataModeler(modeler);

      modeler
        .importXML(defaultDiagram)
        .then(() => {
          if (cancelled || modelerRef.current !== modeler) {
            return;
          }
          const canvas = modeler.get("canvas");
          canvas.resized();
          canvas.zoom("fit-viewport", "auto");
          syncAsyncToolbarFromWorkflow(modeler);
          hydrateActivityMetadataFromBpmn(modeler);
        })
        .catch((error) => {
          // StrictMode remount destroys the first modeler mid-import — ignore that race
          if (cancelled || modelerRef.current !== modeler) {
            return;
          }
          console.error("Failed to import default BPMN diagram", error);
        });

      const eventBus = modeler.get("eventBus");
      eventBus.on("linting.completed", (event) => {
        if (cancelled || modelerRef.current !== modeler) {
          return;
        }
        console.log("[bpmnlint] raw issues:", event.issues);
        setLintIssues(flattenLintIssues(event.issues));
      });

      eventBus.on("selection.changed", (event) => {
        if (cancelled || modelerRef.current !== modeler) {
          return;
        }
        const selection = event.newSelection || [];
        // Open properties only for concrete flow nodes (not Process / empty canvas)
        const hasActivity = selection.some((el) => {
          if (!el || el.labelTarget) return false;
          const type = el.type || "";
          if (
            type === "bpmn:Process" ||
            type === "bpmn:Collaboration" ||
            type === "bpmn:Participant" ||
            type === "label"
          ) {
            return false;
          }
          return (
            type.includes("Task") ||
            type === "bpmn:CallActivity" ||
            type === "bpmn:SubProcess" ||
            type.includes("Event") ||
            type.includes("Gateway") ||
            type === "bpmn:DataStoreReference" ||
            type === "bpmn:DataObjectReference" ||
            type === "bpmn:SequenceFlow"
          );
        });
        setShowPropertiesPanel(hasActivity);
      });
    };

    // Wait a frame so the canvas container has layout size (avoids root-0 on zero-size host)
    const raf = window.requestAnimationFrame(() => {
      startModeler();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      setActivityMetadataModeler(null);
      const active = modelerRef.current;
      modelerRef.current = null;
      if (active) {
        try {
          active.destroy();
        } catch {
          /* ignore destroy races */
        }
      } else if (modeler) {
        try {
          modeler.destroy();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      const active = document.fullscreenElement === designerWrapperRef.current;
      setIsFullscreen(active);
      window.setTimeout(() => fitCanvas(), 80);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // When properties opens/closes, shrink/expand canvas so it does not sit under the panel
  useEffect(() => {
    const modeler = modelerRef.current;
    if (!modeler) return;
    const timer = window.setTimeout(() => {
      try {
        const canvas = modeler.get("canvas");
        canvas.resized();
        if (showPropertiesPanel) {
          canvas.zoom("fit-viewport", "auto");
        }
      } catch {
        /* ignore */
      }
    }, 60);
    return () => window.clearTimeout(timer);
  }, [showPropertiesPanel]);

  // Load workflow names
  useEffect(() => {
    fetchWorkflows();
  }, []);

  useEffect(() => {
    setCurrentWorkflowName(workflowName);
    setActivityMetadataWorkflowName(workflowName);
    setActivityMetadataFallbackWorkflowName(selectedWorkflow);
    invalidateWorkflowCatalog();
    const effectiveName = workflowName.trim() || selectedWorkflow.trim();
    if (effectiveName) {
      ensureActivityMetadataLoaded(effectiveName, { force: true }).catch((error) => {
        console.error("Failed to preload activity metadata", error);
      });
    }
  }, [workflowName, selectedWorkflow]);

  const fetchWorkflows = async () => {
    try {
      const data = await getAllWorkflows();
      setWorkflows(data);
      invalidateWorkflowCatalog();
    } catch (error) {
      console.error(error);
    }
  };

  const getXml = async () => {
    const { xml } = await modelerRef.current.saveXML({
      format: true
    });
    const escapedDelegateExpression = delegateExpression
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&apos;");

    return xml.replace(
      /(<bpmn:process\b[^>]*>)([\s\S]*?)(<\/bpmn:process>)/i,
      (_full, openingTag, processBody, closingTag) => {
        const cleanedBody = processBody.replace(
          /\s*<bpmn:extensionElements\b[^>]*>([\s\S]*?)<\/bpmn:extensionElements>/i,
          (extensionElements, extensionBody) => {
            const remainingBody = extensionBody.replace(
              /\s*<flowable:executionListener\b(?=[^>]*\bevent=["']start["'])(?=[^>]*\bdelegateExpression=)[^>]*(?:\/>|>[\s\S]*?<\/flowable:executionListener>)/gi,
              ""
            );
            return remainingBody.trim() ? extensionElements.replace(extensionBody, remainingBody) : "";
          }
        );

        if (!globalExecutionListener) {
          return `${openingTag}${cleanedBody}${closingTag}`;
        }

        return `${openingTag}\n<bpmn:extensionElements>\n    <flowable:executionListener\n        event="start"\n        delegateExpression="\${${escapedDelegateExpression}}"/>\n</bpmn:extensionElements>${cleanedBody}${closingTag}`;
      }
    );
  };

  const syncGlobalExecutionListenerFromXml = (xml) => {
    const document = new DOMParser().parseFromString(xml, "application/xml");
    const process = document.getElementsByTagNameNS(
      "http://www.omg.org/spec/BPMN/20100524/MODEL",
      "process"
    )[0];
    const extensionElements = Array.from(process?.childNodes || []).find(
      (child) =>
        child.nodeType === Node.ELEMENT_NODE &&
        child.localName === "extensionElements"
    );
    const listener = Array.from(extensionElements?.childNodes || []).find(
      (child) =>
        child.nodeType === Node.ELEMENT_NODE &&
        child.localName === "executionListener" &&
        child.namespaceURI === "http://flowable.org/bpmn"
    );
    const existingDelegateExpression = listener?.getAttribute("delegateExpression");
    setGlobalExecutionListener(Boolean(existingDelegateExpression));
    setDelegateExpression(
      existingDelegateExpression
        ? existingDelegateExpression.replace(/^\$\{(.*)\}$/, "$1")
        : DEFAULT_DELEGATE_EXPRESSION
    );
  };

  // Converts a workflow name into a valid BPMN/XML NCName id:
  // strips invalid characters, collapses repeats, and guarantees the
  // result doesn't start with a digit (BPMN ids can't be numeric-led).
  const toValidBpmnId = (name) => toValidBpmnProcessId(name);

  // Flowable uses the root <bpmn:process id="..."> as the process definition
  // key. Every brand-new diagram (including child workflows) starts from the
  // same "Process_1" template, so unless a user manually renames it, deploying
  // more than one un-renamed workflow collides on that key. To prevent that,
  // we sync the process id to the (already-unique) workflow name right before
  // save/deploy, using bpmn-js's modeling service so all internal references
  // (e.g. the BPMNPlane's bpmnElement) get updated consistently.
  const syncProcessIdToWorkflowName = (name) => {
    const modeler = modelerRef.current;
    if (!modeler || !name.trim()) return;

    const definitions = modeler.getDefinitions?.();
    const processEl = definitions?.rootElements?.find(
      (el) => el.$type === "bpmn:Process"
    );
    if (!processEl) return;

    const desiredId = toValidBpmnId(name);
    const displayName = name.trim();
    const elementRegistry = modeler.get("elementRegistry");
    const modeling = modeler.get("modeling");
    const rootElement = elementRegistry.get(processEl.id);

    // Keep process name in sync with workflow name (avoids stale name="END" from End Event).
    if (rootElement) {
      const updates = { name: displayName };
      if (processEl.id !== desiredId) {
        updates.id = desiredId;
      }
      modeling.updateProperties(rootElement, updates);
    } else {
      processEl.name = displayName;
      if (processEl.id !== desiredId) {
        processEl.id = desiredId;
      }
    }
  };

  /**
   * Call Activity calledElement must match the child process key.
   * Older diagrams stored the display name (e.g. Child-WF-TEST); normalize to
   * the same id syncProcessIdToWorkflowName would produce (Child_WF_TEST).
   */
  const syncCallActivityCalledElements = () => {
    const modeler = modelerRef.current;
    if (!modeler) return;
    const elementRegistry = modeler.get("elementRegistry");
    const modeling = modeler.get("modeling");
    for (const el of elementRegistry.getAll()) {
      if (el.type !== "bpmn:CallActivity") continue;
      const called = el.businessObject?.calledElement;
      if (!called || typeof called !== "string") continue;
      const normalized = toValidBpmnId(called);
      if (normalized && normalized !== called) {
        modeling.updateProperties(el, { calledElement: normalized });
      }
    }
  };

  // Captures element name/type alongside the raw bpmnlint issue,
  // used both for friendly messages and for the panel's "on <element>" line.
  const flattenLintIssues = (issuesByElement) => {
    const elementRegistry = modelerRef.current?.get("elementRegistry");

    return Object.entries(issuesByElement || {}).flatMap(([elementId, issues]) => {
      const element = elementRegistry?.get(elementId);
      const elementName = element?.businessObject?.name;
      const elementType = element?.businessObject?.$type?.replace("bpmn:", "");

      return issues.map((issue) => ({
        elementId,
        elementName,
        elementType,
        message: issue.message,
        category: issue.category,
        rule: issue.rule
      }));
    });
  };

  const runBpmnLint = async () => {
    const linting = modelerRef.current.get("linting");
    const issuesByElement = await linting.lint();
    console.log("[bpmnlint] on-demand lint result:", issuesByElement);
    const flat = flattenLintIssues(issuesByElement);
    setLintIssues(flat);
    return flat;
  };

  // Selects the element on canvas, scrolls to it, and draws a temporary
  // colored outline so the user can immediately see which shape is at fault.
  const focusElement = (elementId, category) => {
    try {
      const elementRegistry = modelerRef.current.get("elementRegistry");
      const canvas = modelerRef.current.get("canvas");
      const selection = modelerRef.current.get("selection");

      if (highlightedIdRef.current) {
        canvas.removeMarker(highlightedIdRef.current, "lint-highlight-error");
        canvas.removeMarker(highlightedIdRef.current, "lint-highlight-warn");
      }

      const element = elementRegistry.get(elementId);
      if (!element) return;

      selection.select(element);
      canvas.scrollToElement(element);

      const markerClass = category === "error" ? "lint-highlight-error" : "lint-highlight-warn";
      canvas.addMarker(elementId, markerClass);
      highlightedIdRef.current = elementId;

      setTimeout(() => {
        canvas.removeMarker(elementId, markerClass);
        if (highlightedIdRef.current === elementId) highlightedIdRef.current = null;
      }, 3000);
    } catch (e) {
      console.error("Failed to focus element:", e);
    }
  };

  //start validation for workflow
  const hasPathToEnd = (start) => {
    const visited = new Set();
    const dfs = (node) => {
      if (!node || visited.has(node.id)) return false;
      visited.add(node.id);
      if (node.type === "bpmn:EndEvent") return true;
      const outgoing = node.outgoing || [];
      for (const flow of outgoing) {
        if (dfs(flow.target)) return true;
      }
      return false;
    };
    return dfs(start);
  };

  const validateWorkflow = () => {
    const elementRegistry = modelerRef.current.get("elementRegistry");
    const errors = [];
    let startEvent = null;
    let endCount = 0;

    elementRegistry.forEach((element) => {
      if (!element.businessObject) return;
      const type = element.type;

      if (type === "label" || type === "bpmn:SequenceFlow") return;

      if (type === "bpmn:StartEvent") {
        startEvent = element;
        if (!element.outgoing || element.outgoing.length === 0) {
          errors.push("Start Event has no outgoing connection.");
        }
      }

      if (type === "bpmn:EndEvent") {
        endCount++;
        if (!element.incoming || element.incoming.length === 0) {
          errors.push("End Event has no incoming connection.");
        }
      }

      if (type.endsWith("Task")) {
        const name = element.businessObject.name || "Unnamed Task";
        if (!element.incoming || element.incoming.length === 0) {
          errors.push(`${name} has no incoming connection.`);
        }
        if (!element.outgoing || element.outgoing.length === 0) {
          errors.push(`${name} has no outgoing connection.`);
        }
      }

      if (type.includes("Gateway")) {
        const decisionname = element.businessObject.name || "Unnamed Gateway Task";
        if (!element.incoming || element.incoming.length === 0) {
          errors.push(`${decisionname} Gateway has no incoming connection.`);
        }
        if (!element.outgoing || element.outgoing.length === 0) {
          errors.push(`${decisionname} Gateway has no outgoing connection.`);
        }
      }
    });

    if (!startEvent) {
      errors.push("Workflow must contain a Start Event.");
    }

    if (endCount === 0) {
      errors.push("Workflow must contain an End Event.");
    }

    if (startEvent && !hasPathToEnd(startEvent)) {
      errors.push("Workflow has no valid path from Start Event to End Event.");
    }

    return errors;
  };

  const validateReachability = () => {
    const elementRegistry = modelerRef.current.get("elementRegistry");
    const errors = [];
    const start = elementRegistry.find((e) => e.type === "bpmn:StartEvent");

    if (!start) {
      return ["Workflow must contain a Start Event."];
    }

    const visited = new Set();

    const dfs = (element) => {
      if (!element || visited.has(element.id)) return;
      visited.add(element.id);
      (element.outgoing || []).forEach((flow) => {
        dfs(flow);
        dfs(flow.target);
      });
    };

    dfs(start);

    elementRegistry.forEach((element) => {
      if (!element.businessObject) return;
      if (element.type === "label" || element.type === "bpmn:SequenceFlow") return;

      if (!visited.has(element.id)) {
        const name = element.businessObject.name || element.id;
        errors.push(`${name} is disconnected from the workflow.`);
      }
    });

    return errors;
  };
  //end validation for workflow

  const handleSave = async () => {
    try {
      if (!workflowName.trim()) {
        alert("Please Enter Workflow Name");
        return;
      }

      // Block only if a deployed (ACTIVE/INACTIVE) workflow already uses this name.
      // DRAFT with same name is upserted by master-service.
      const deployedWithSameName = workflows.find(
        (workflow) =>
          workflow.workflowName === workflowName.trim() &&
          workflow.status &&
          workflow.status !== "DRAFT"
      );
      if (deployedWithSameName && !isExistingWorkflow.current) {
        alert("A deployed workflow with this name already exists. Revision support will be added later.");
        return;
      }

      // 1. Custom structural checks
      const customErrors = validateWorkflow();
      if (customErrors.length > 0) {
        alert(customErrors.join("\n"));
        return;
      }

      // 2. bpmnlint checks — only "error" severity blocks save
      const lintResults = await runBpmnLint();
      const hasLintErrors = lintResults.some((i) => i.category === "error");

      if (hasLintErrors) {
        setShowLintPanel(true);
        alert("Please resolve the highlighted lint errors before saving.");
        return;
      }

      // 3. XSD / schema validation — only reached if steps 1 & 2 passed
      const isValid = await handleValidate();
      if (!isValid) {
        return;
      }

      // 4. All checks passed — sync the process id to this workflow's name so
      // it doesn't collide with other workflows still on the default "Process_1",
      // then save to master-service (workflow_definition DRAFT).
      syncProcessIdToWorkflowName(workflowName);
      syncCallActivityCalledElements();
      try {
        await flushAllPendingActivityMetadataSaves();
      } catch (metaError) {
        console.error(metaError);
        alert(
          `Activity properties could not be written into the diagram: ${
            metaError?.message || metaError
          }`
        );
        return;
      }
      const xml = await applyToolbarAsyncFlagsBeforeExport();
      if (!xml) {
        return;
      }
      await saveWorkflow(workflowName, xml);
      isExistingWorkflow.current = true;
      alert("Workflow Saved Successfully — it will appear in Workflow List.");
      fetchWorkflows();

    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message ||
        "Failed To Save Workflow";
      alert(msg);
    }
  };

  const handleDeploy = async () => {
    // Shortcut: save DRAFT then open Workflow List for Deploy / Active / Inactive.
    try {
      if (!workflowName.trim()) {
        alert("Please Enter Workflow Name");
        return;
      }

      const customErrors = validateWorkflow();
      if (customErrors.length > 0) {
        alert(customErrors.join("\n"));
        return;
      }

      const lintResults = await runBpmnLint();
      const hasLintErrors = lintResults.some((i) => i.category === "error");

      if (hasLintErrors) {
        setShowLintPanel(true);
        alert("Please resolve the highlighted lint errors before deploying.");
        return;
      }

      const isValid = await handleValidate();
      if (!isValid) {
        return;
      }

      syncProcessIdToWorkflowName(workflowName);
      syncCallActivityCalledElements();
      try {
        await flushAllPendingActivityMetadataSaves();
      } catch (metaError) {
        console.error(metaError);
        alert(
          `Activity properties could not be written into the diagram: ${
            metaError?.message || metaError
          }`
        );
        return;
      }
      const xml = await applyToolbarAsyncFlagsBeforeExport();
      if (!xml) {
        return;
      }
      await saveWorkflow(workflowName, xml);
      isExistingWorkflow.current = true;
      alert("Saved. Opening Workflow List to Deploy / Activate.");
      navigate("/homelayout/workflow-registry/list");

    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message ||
        "Deployment Failed";
      alert(msg);
    }
  };

  const handleOpen = async () => {
    try {
      if (!selectedWorkflow) {
        alert("Please select a workflow");
        return;
      }

      const workflow = await loadWorkflowByName(selectedWorkflow);
      if (!modelerRef.current) {
        alert("Designer is not ready yet. Please try again.");
        return;
      }
      await modelerRef.current.importXML(workflow.bpmnXml);
      syncGlobalExecutionListenerFromXml(workflow.bpmnXml);
      fitCanvas();
      setWorkflowName(workflow.workflowName);
      setSelectedWorkflow(workflow.workflowName);
      isExistingWorkflow.current = true;
      setActivityMetadataWorkflowName(workflow.workflowName);
      setActivityMetadataFallbackWorkflowName(workflow.workflowName);
      hydrateActivityMetadataFromBpmn(modelerRef.current);
      await ensureActivityMetadataLoaded(workflow.workflowName, { force: true });
      syncAsyncToolbarFromWorkflow(modelerRef.current);
      alert("Workflow Loaded Successfully");
    } catch (e) {
      console.error(e);
      alert("Workflow not found");
    }
  };

  const handleDownload = async () => {
    try {
      if (!selectedWorkflow) {
        alert("Please select a workflow");
        return;
      }
      await downloadWorkflow(selectedWorkflow);
    } catch (e) {
      console.error(e);
      alert("Download Failed");
    }
  };

  const checkSelectedWorkflow = (workflowName) => {
    isExistingWorkflow.current = workflowName !== "";
  };

  const handleValidate = async () => {
    try {
      const xml = await getXml();
      const result = await validateWorkflowXSD(xml);

      if (result.valid) {
        alert("BPMN is valid");
        return true;
      } else {
        let errors = "";
        result.errors.forEach((e) => {
          errors += `${e.activityId}\n${e.message}\n\n`;
        });
        alert(errors);
        // return false;
        return true;
      }
    } catch (e) {
      console.error(e);
      alert("Validation failed");
      return false;
    }
  };

  const errorCount = lintIssues.filter((i) => i.category === "error").length;
  const warnCount = lintIssues.filter((i) => i.category === "warn").length;

  return (
    <div className="designer-page">
      <div className="toolbar">
        <div className="toolbar-row">
          <div className="toolbar-group toolbar-group--grow">
            <input
              className="toolbar-field toolbar-field--name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="Workflow Name"
              aria-label="Workflow name"
            />
            <select
              className="toolbar-field toolbar-field--select"
              value={selectedWorkflow}
              onChange={(e) => {
                const name = e.target.value;
                setSelectedWorkflow(name);
                if (name) {
                  setWorkflowName(name);
                }
                checkSelectedWorkflow(name);
              }}
              aria-label="Select workflow"
            >
              <option value="">Select Workflow</option>
              {workflows.map((wf) => (
                <option key={wf.id} value={wf.workflowName}>
                  {wf.workflowName}
                  {wf.status ? ` (${wf.status})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="toolbar-divider" aria-hidden />

          <div className="toolbar-group">
            <button type="button" className="toolbar-btn" onClick={handleOpen}>
              Load
            </button>
            <button type="button" className="toolbar-btn toolbar-btn--primary" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="toolbar-btn toolbar-btn--primary" onClick={handleDeploy}>
              Deploy
            </button>
            <button type="button" className="toolbar-btn" onClick={handleDownload}>
              Download
            </button>
          </div>

          <div className="toolbar-group toolbar-group--end">
            <button
              type="button"
              className="toolbar-btn"
              onClick={() => setShowLintPanel((v) => !v)}
            >
              Lint Issues
              {lintIssues.length > 0 && (
                <span
                  className={`toolbar-btn__badge${errorCount > 0 ? " toolbar-btn__badge--error" : ""}`}
                >
                  {lintIssues.length}
                </span>
              )}
            </button>
            <button type="button" className="toolbar-btn" onClick={fitCanvas} title="Fit to viewport">
              Fit
            </button>
            <button
              type="button"
              className="toolbar-btn toolbar-btn--icon"
              onClick={() => zoomBy(-0.1)}
              title="Zoom out"
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              type="button"
              className="toolbar-btn toolbar-btn--icon"
              onClick={() => zoomBy(0.1)}
              title="Zoom in"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              className="toolbar-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit full screen" : "Full screen"}
            >
              {isFullscreen ? "Exit Full" : "Full Screen"}
            </button>
          </div>
        </div>

        <div className="toolbar-async">
          <label className={workflowDiagramReady ? "" : "disabled"}>
            <input
              type="checkbox"
              checked={asyncBefore}
              disabled={!workflowDiagramReady}
              onChange={(event) => handleAsyncBeforeChange(event.target.checked)}
            />
            Async Before
          </label>
          <label className={workflowDiagramReady ? "" : "disabled"}>
            <input
              type="checkbox"
              checked={asyncAfter}
              disabled={!workflowDiagramReady}
              onChange={(event) => handleAsyncAfterChange(event.target.checked)}
            />
            Async After
          </label>
          <label className={workflowDiagramReady ? "" : "disabled"}>
            <input
              type="checkbox"
              checked={globalExecutionListener}
              disabled={!workflowDiagramReady}
              onChange={(event) => setGlobalExecutionListener(event.target.checked)}
            />
            Global Execution Listener
          </label>
          {globalExecutionListener && (
            <label>
              Delegate Expression
              <input
                type="text"
                value={delegateExpression}
                onChange={(event) => setDelegateExpression(event.target.value)}
                aria-label="Delegate Expression"
              />
            </label>
          )}
          {!workflowDiagramReady && (
            <span className="toolbar-async-hint">Load a workflow to configure async flags</span>
          )}
        </div>
      </div>

      <div className="designer-wrapper" ref={designerWrapperRef}>
        <div className="designer-body">
          <div className="bpmn-stage">
            <div ref={containerRef} className="bpmn-container" />
          </div>

          <div
            className={`designer-properties-section${showPropertiesPanel ? "" : " designer-properties-section--collapsed"}`}
          >
            <div className="designer-properties-toolbar">
              <span className="designer-properties-toolbar__title">Properties</span>
              <button
                type="button"
                className="designer-properties-close"
                onClick={closePropertiesPanel}
                aria-label="Close properties panel"
                title="Close properties panel"
              >
                ×
              </button>
            </div>
            <div
              ref={propertiesPanelRef}
              className="bpmn-properties-panel"
              id="js-properties-panel"
            />
          </div>
        </div>

        {showLintPanel && (
          <div className="designer-lint-panel">
            <div className="designer-lint-panel__header">
              <div className="designer-lint-panel__title">
                Validation Issues
                {lintIssues.length > 0 && (
                  <span className="designer-lint-panel__count">{lintIssues.length}</span>
                )}
              </div>
              <button
                type="button"
                className="toolbar-btn toolbar-btn--icon toolbar-btn--ghost"
                onClick={() => setShowLintPanel(false)}
                aria-label="Close lint panel"
              >
                ×
              </button>
            </div>

            <div className="designer-lint-panel__body">
              {lintIssues.length === 0 ? (
                <div className="designer-lint-panel__empty">No validation issues found</div>
              ) : (
                <>
                  {errorCount > 0 && (
                    <div className="designer-lint-panel__section">
                      <div className="designer-lint-panel__section-title designer-lint-panel__section-title--error">
                        Errors ({errorCount})
                      </div>
                      {lintIssues
                        .filter((i) => i.category === "error")
                        .map((issue, i) => (
                          <LintIssueRow key={`err-${i}`} issue={issue} onClick={focusElement} />
                        ))}
                    </div>
                  )}

                  {warnCount > 0 && (
                    <div className="designer-lint-panel__section">
                      <div className="designer-lint-panel__section-title designer-lint-panel__section-title--warn">
                        Warnings ({warnCount})
                      </div>
                      {lintIssues
                        .filter((i) => i.category === "warn")
                        .map((issue, i) => (
                          <LintIssueRow key={`warn-${i}`} issue={issue} onClick={focusElement} />
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
