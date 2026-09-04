import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import { BpmnCanvas } from "../components/BpmnCanvas";
import { WorkflowActionToolbar } from "../components/WorkflowActionToolbar";
import * as losApi from "../api/losApi";
import { formatErrorDetailsColumn } from "../utils/friendlyWorkflowError";
import { DrsPageTitleBar } from "../components/DrsPageTitleBar";
import "../styles/drsTheme.css";
import "../styles/workflowListPages.css";
import "../styles/workflowGraphicalLog.css";

/**
 * @typedef {Object} ViewFrame
 * @property {string} processInstanceId
 * @property {string} workflowName
 * @property {string} [status]
 */

/**
 * @typedef {Object} NavNode
 * @property {string} processInstanceId
 * @property {string} workflowName
 * @property {string} status
 * @property {number} depth
 * @property {string|null} parentId
 */

/** Table timestamps: DD/MM/YYYY HH.mm.ss */
function formatChildTableTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}.${mi}.${ss}`;
  } catch {
    return iso;
  }
}

function childStatusLetter(status) {
  const s = (status || "").toUpperCase();
  if (s.includes("COMPLETE")) return "C";
  if (s.includes("ERROR") || s.includes("FAIL")) return "E";
  if (s.includes("PROGRESS") || s.includes("RUN") || s.includes("ACTIVE")) return "R";
  return s ? s.charAt(0) : "—";
}

function extractApiError(e) {
  if (e && typeof e === "object" && "response" in e) {
    const resp = e.response;
    if (resp?.data?.detail) return resp.data.detail;
    if (resp?.data?.message) return resp.data.message;
  }
  return e instanceof Error ? e.message : String(e);
}

function isCallActivityType(type) {
  if (!type) return false;
  const t = type.toLowerCase();
  return t.includes("callactivity") || t === "callactivity";
}

function statusTone(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("skip")) return "skipped";
  if (s.includes("fail") || s.includes("error")) return "failed";
  if (s.includes("complet")) return "completed";
  if (s.includes("run") || s.includes("active") || s.includes("progress")) return "running";
  return "pending";
}

function StatusGlyph({ status }) {
  const tone = statusTone(status);
  if (tone === "skipped") {
    return <SkipNextOutlinedIcon sx={{ fontSize: 15 }} className="los-wf-status-icon los-wf-status-icon--skipped" />;
  }
  if (tone === "failed") {
    return <ErrorOutlineIcon sx={{ fontSize: 15 }} className="los-wf-status-icon los-wf-status-icon--failed" />;
  }
  if (tone === "completed") {
    return <CheckCircleIcon sx={{ fontSize: 15 }} className="los-wf-status-icon los-wf-status-icon--completed" />;
  }
  if (tone === "running") {
    return <HourglassEmptyIcon sx={{ fontSize: 15 }} className="los-wf-status-icon los-wf-status-icon--running" />;
  }
  return <RadioButtonUncheckedIcon sx={{ fontSize: 15 }} className="los-wf-status-icon los-wf-status-icon--pending" />;
}

export function WorkflowGraphicalLogPage() {
  const { appNo: routeAppNo } = useParams();
  const [searchParams] = useSearchParams();
  const queryAppNo = (searchParams.get("no") ?? searchParams.get("appNo") ?? "").trim();
  const initialAppNo = (routeAppNo || queryAppNo || "").trim();

  const [appNoInput, setAppNoInput] = useState(initialAppNo);
  const [appNo, setAppNo] = useState(initialAppNo || undefined);
  const [loadErr, setLoadErr] = useState(null);

  const [app, setApp] = useState(null);
  const [viewStack, setViewStack] = useState([]);
  const viewStackRef = useRef(viewStack);
  viewStackRef.current = viewStack;
  const [xml, setXml] = useState(null);
  const [states, setStates] = useState(null);
  const [activities, setActivities] = useState([]);
  const [viewStatus, setViewStatus] = useState("IN_PROGRESS");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedElementType, setSelectedElementType] = useState(null);
  const [childLinks, setChildLinks] = useState([]);
  const [navTree, setNavTree] = useState([]);
  const [wfMenuOpen, setWfMenuOpen] = useState(false);
  const diagramCacheRef = useRef(new Map());
  const wfMenuRef = useRef(null);

  const workflowStatus = (app?.workflowStatus ?? "IN_PROGRESS").toUpperCase();
  const isError = workflowStatus === "ERROR";
  const isRootView = viewStack.length <= 1;
  const currentFrame = viewStack.length > 0 ? viewStack[viewStack.length - 1] : null;

  const applyDiagram = useCallback((diagram, frame, stack) => {
    setXml(diagram.bpmnXml && diagram.bpmnXml.length > 10 ? diagram.bpmnXml : null);
    setStates(diagram.activityStates);
    setActivities(diagram.activities);
    setViewStatus((diagram.status || "IN_PROGRESS").toUpperCase());
    setViewStack(
      stack.map((f) =>
        f.processInstanceId === frame.processInstanceId
          ? {
              ...f,
              workflowName: diagram.workflowName || f.workflowName,
              status: diagram.status || f.status,
            }
          : f,
      ),
    );
  }, []);

  const loadDiagramFor = useCallback(
    async (applicationNumber, frame, stack, force = false) => {
      const cached = diagramCacheRef.current.get(frame.processInstanceId);
      if (cached && !force) {
        applyDiagram(cached, frame, stack);
        return;
      }
      const diagram = await losApi.getWorkflowDiagram(applicationNumber, frame.processInstanceId);
      const entry = {
        bpmnXml: diagram.bpmnXml || "",
        activityStates: (diagram.activityStates || []).map((s) => ({
          activityId: s.activityId,
          activityType: s.activityType,
          status: s.status,
          detail: s.detail,
        })),
        activities: diagram.activities || [],
        status: diagram.status || "IN_PROGRESS",
        workflowName: diagram.workflowName || frame.workflowName,
      };
      diagramCacheRef.current.set(frame.processInstanceId, entry);
      applyDiagram(entry, frame, stack);
    },
    [applyDiagram],
  );

  const refreshNavTree = useCallback(async (applicationNumber, rootPi, rootName, rootStatus) => {
    const flat = [];
    const walk = async (pi, name, status, depth, parentId) => {
      flat.push({ processInstanceId: pi, workflowName: name, status, depth, parentId });
      try {
        const children = await losApi.listChildWorkflows(applicationNumber, pi);
        for (const c of children) {
          await walk(
            c.workflowId,
            c.workflowName || c.calledElement || "Child Workflow",
            c.status || "IN_PROGRESS",
            depth + 1,
            pi,
          );
        }
      } catch {
        /* ignore tree branch errors */
      }
    };
    await walk(rootPi, rootName, rootStatus, 0, null);
    setNavTree(flat);
  }, []);

  const reload = useCallback(async () => {
    if (!appNo) return;
    setLoadErr(null);
    try {
      const a = await losApi.getApplication(appNo);
      setApp(a);
      if (!a?.processInstanceId) {
        setViewStack([]);
        setXml(null);
        setStates(null);
        setActivities([]);
        setNavTree([]);
        return;
      }

      const rootName = a.workflowName || a.processDefinitionKey || "Main Workflow";
      const rootStatus = a.workflowStatus || "IN_PROGRESS";
      const rootFrame = { processInstanceId: a.processInstanceId, workflowName: rootName, status: rootStatus };
      const prev = viewStackRef.current;
      const stack =
        prev.length === 0
          ? [rootFrame]
          : [
              { ...prev[0], processInstanceId: a.processInstanceId, workflowName: rootName, status: rootStatus },
              ...prev.slice(1),
            ];
      setViewStack(stack);

      // Invalidate cache on full refresh so status stays current
      diagramCacheRef.current.clear();

      await loadDiagramFor(appNo, stack[stack.length - 1], stack, true);
      await refreshNavTree(appNo, a.processInstanceId, rootName, rootStatus);
    } catch (e) {
      console.warn("[DRS] Failed to load workflow graphical log", e);
      setApp(null);
      setLoadErr(extractApiError(e));
    }
  }, [appNo, loadDiagramFor, refreshNavTree]);

  useEffect(() => {
    if (!appNo) return;
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appNo]);

  useEffect(() => {
    setSelectedActivityId(null);
    setSelectedElementType(null);
    setChildLinks([]);
  }, [currentFrame?.processInstanceId]);

  useEffect(() => {
    function onDocClick(e) {
      if (!wfMenuRef.current?.contains(e.target)) {
        setWfMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const diagramStates = useMemo(() => {
    if (!states?.length || !isError || !app?.failedActivityId) {
      return states;
    }
    const failedId = app.failedActivityId;
    const existing = states.find((s) => s.activityId === failedId);
    const onThisDiagram = !!existing || activities.some((a) => a.activityId === failedId);
    if (!onThisDiagram) {
      return states;
    }
    const failedType = String(
      existing?.activityType || activities.find((a) => a.activityId === failedId)?.activityType || "",
    ).toLowerCase();
    const isSystemOrServiceFailure =
      failedType.includes("service") || failedType.includes("external") || failedType.includes("system");
    const isGatewayFailure = failedType.includes("gateway");
    const alreadyCompleted =
      !!existing &&
      (String(existing.status).toUpperCase() === "SUCCESS" || String(existing.status).toUpperCase() === "COMPLETED");

    if (alreadyCompleted && !isSystemOrServiceFailure && !isGatewayFailure) {
      const nextId =
        activities.find(
          (a) =>
            a.activityId !== failedId &&
            String(a.activityType || "").toLowerCase().includes("callactivity") &&
            !states.some(
              (s) =>
                s.activityId === a.activityId &&
                (String(s.status).toUpperCase() === "SUCCESS" || String(s.status).toUpperCase() === "COMPLETED"),
            ),
        )?.activityId ||
        activities.find((a) => {
          if (a.activityId === failedId) return false;
          const st = states.find((s) => s.activityId === a.activityId)?.status;
          const u = String(st || "").toUpperCase();
          return u !== "SUCCESS" && u !== "COMPLETED" && u !== "SKIPPED";
        })?.activityId;

      if (!nextId) {
        return states;
      }
      const hasNext = states.some((s) => s.activityId === nextId);
      const merged = states.map((s) =>
        s.activityId === nextId ? { ...s, status: "ERROR", detail: app.errorMessage ?? s.detail } : s,
      );
      if (!hasNext) {
        merged.push({
          activityId: nextId,
          activityType: activities.find((a) => a.activityId === nextId)?.activityType ?? "callActivity",
          status: "ERROR",
          detail: app.errorMessage ?? null,
        });
      }
      return merged;
    }

    const hasFailed = states.some((s) => s.activityId === failedId);
    const merged = states.map((s) =>
      s.activityId === failedId ? { ...s, status: "ERROR", detail: app.errorMessage ?? s.detail } : s,
    );
    if (!hasFailed) {
      const activityType = activities.find((a) => a.activityId === failedId)?.activityType ?? "userTask";
      merged.push({
        activityId: failedId,
        activityType,
        status: "ERROR",
        detail: app.errorMessage ?? null,
      });
    }
    return merged;
  }, [states, isError, isRootView, app?.failedActivityId, app?.errorMessage, activities]);

  const selectedActivity = useMemo(() => {
    if (!selectedActivityId) return null;
    const matches = activities.filter((a) => a.activityId === selectedActivityId);
    const diagramRow = diagramStates?.find((s) => s.activityId === selectedActivityId);
    const diagramStatus = diagramRow?.status || states?.find((s) => s.activityId === selectedActivityId)?.status;
    if (!matches.length) {
      return {
        activityId: selectedActivityId,
        activityName: selectedActivityId,
        activityType: selectedElementType || diagramRow?.activityType || "—",
        status: diagramStatus || "Pending",
        startTime: "",
        endTime: "",
        assignee: "—",
        duration: "—",
        remarks: diagramRow?.detail || "—",
      };
    }
    const row = matches[matches.length - 1];
    const typeFromClick = selectedElementType || undefined;
    const withType =
      typeFromClick && (!row.activityType || row.activityType === "—")
        ? { ...row, activityType: typeFromClick }
        : typeFromClick
          ? { ...row, activityType: row.activityType || typeFromClick }
          : row;
    const withStatus = diagramStatus ? { ...withType, status: diagramStatus } : withType;
    if (diagramRow?.detail && (!withStatus.remarks || withStatus.remarks === "—")) {
      return { ...withStatus, remarks: diagramRow.detail };
    }
    return withStatus;
  }, [selectedActivityId, selectedElementType, activities, diagramStates, states]);

  const selectedActivityErrorDetails = useMemo(() => {
    if (!selectedActivity) return "—";
    const status = (selectedActivity.status || "").toUpperCase();
    const isDiagramError =
      status === "ERROR" || status === "FAILED" || (status.includes("FAIL") && !status.includes("ACTIVE"));
    const isAppFailed =
      (app?.workflowStatus ?? "").toUpperCase() === "ERROR" && selectedActivity.activityId === app?.failedActivityId;
    if (!isDiagramError && !isAppFailed) return "—";

    const diagramDetail = diagramStates?.find((s) => s.activityId === selectedActivity.activityId)?.detail || "";
    const raw =
      (selectedActivity.remarks && selectedActivity.remarks !== "—" ? selectedActivity.remarks : "") ||
      (isAppFailed ? app?.errorMessage || "" : "") ||
      diagramDetail ||
      "";
    return formatErrorDetailsColumn(raw);
  }, [selectedActivity, diagramStates, app?.failedActivityId, app?.errorMessage, app?.workflowStatus]);

  async function onElementClick(activityId, elementType) {
    setSelectedActivityId(activityId);
    setSelectedElementType(elementType);
    setChildLinks([]);
    if (!appNo || !currentFrame) return;

    const row = activities.find((a) => a.activityId === activityId);
    const looksLikeCall = isCallActivityType(elementType) || isCallActivityType(row?.activityType);
    if (!looksLikeCall) {
      return;
    }
    try {
      const children = await losApi.listChildWorkflows(appNo, currentFrame.processInstanceId);
      const forActivity = children.filter((c) => !c.callActivityId || c.callActivityId === activityId);
      const links = forActivity.length ? forActivity : children;
      setChildLinks(links);
    } catch (e) {
      console.warn("[DRS] Failed to load child workflows", e);
      setChildLinks([]);
    }
  }

  async function openChildWorkflow(child) {
    if (!appNo) return;
    const frame = {
      processInstanceId: child.workflowId,
      workflowName: child.workflowName || child.calledElement || "Child Workflow",
      status: child.status,
    };
    const previous = viewStackRef.current;
    const nextStack = [...previous, frame];
    setViewStack(nextStack);
    setBusy(true);
    setWfMenuOpen(false);
    try {
      await loadDiagramFor(appNo, frame, nextStack);
      if (previous[0]) {
        await refreshNavTree(appNo, previous[0].processInstanceId, previous[0].workflowName, previous[0].status || "IN_PROGRESS");
      }
    } catch (e) {
      setToast({ severity: "error", text: extractApiError(e) });
      setViewStack(previous);
    } finally {
      setBusy(false);
    }
  }

  async function navigateToStackIndex(index) {
    if (!appNo || index < 0 || index >= viewStack.length) return;
    const nextStack = viewStack.slice(0, index + 1);
    const frame = nextStack[nextStack.length - 1];
    setViewStack(nextStack);
    setBusy(true);
    setWfMenuOpen(false);
    try {
      await loadDiagramFor(appNo, frame, nextStack);
    } catch (e) {
      setToast({ severity: "error", text: extractApiError(e) });
    } finally {
      setBusy(false);
    }
  }

  async function selectNavNode(node) {
    if (!appNo || !viewStack[0]) return;
    const byId = new Map(navTree.map((n) => [n.processInstanceId, n]));
    const pathIds = [];
    let cur = node;
    while (cur) {
      pathIds.unshift(cur.processInstanceId);
      cur = cur.parentId ? byId.get(cur.parentId) : undefined;
    }
    const stack = pathIds.map((id) => {
      const n = byId.get(id);
      return { processInstanceId: n.processInstanceId, workflowName: n.workflowName, status: n.status };
    });
    if (!stack.length) return;
    setViewStack(stack);
    setBusy(true);
    setWfMenuOpen(false);
    try {
      await loadDiagramFor(appNo, stack[stack.length - 1], stack);
    } catch (e) {
      setToast({ severity: "error", text: extractApiError(e) });
    } finally {
      setBusy(false);
    }
  }

  async function onCompleteTask() {
    if (!appNo) {
      setToast({ severity: "info", text: "No application loaded." });
      return;
    }
    if (!selectedActivityId) {
      setToast({ severity: "info", text: "Select a running user task or system activity on the diagram first." });
      return;
    }
    setBusy(true);
    setToast(null);
    try {
      await losApi.completeLosTask(appNo, null, {}, {
        activityId: selectedActivityId,
        processInstanceId: currentFrame?.processInstanceId,
      });
      setToast({ severity: "success", text: "Task completed." });
      setSelectedActivityId(null);
      setSelectedElementType(null);
      await reload();
    } catch (e) {
      setToast({ severity: "error", text: extractApiError(e) });
    } finally {
      setBusy(false);
    }
  }

  function onLoadApplication() {
    const trimmed = appNoInput.trim();
    if (!trimmed) return;
    setViewStack([]);
    setXml(null);
    setStates(null);
    setActivities([]);
    setNavTree([]);
    diagramCacheRef.current.clear();
    setAppNo(trimmed);
  }

  const currentNavStatus =
    navTree.find((n) => n.processInstanceId === currentFrame?.processInstanceId)?.status ||
    currentFrame?.status ||
    viewStatus;

  return (
    <Box className="los-page">
      <DrsPageTitleBar>WF Graphical Log</DrsPageTitleBar>
      <Typography variant="body2" color="text.secondary" className="los-lead" sx={{ mb: 2, maxWidth: 720 }}>
        Live BPMN diagram for one application — drill into Call Activity children, complete tasks, retry or skip a
        stuck activity.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Application no"
          value={appNoInput}
          onChange={(e) => setAppNoInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onLoadApplication();
          }}
          className="drs-themed-textfield"
          placeholder="e.g. PL000123"
        />
        <Button variant="contained" className="drs-themed-button" onClick={onLoadApplication}>
          Load
        </Button>
      </Stack>

      {loadErr && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setLoadErr(null)}>
          {loadErr}
        </Alert>
      )}

      {!appNo && !loadErr && (
        <Typography variant="body2" color="text.secondary">
          Enter an application number above (from the Application List or Entry Form) and click Load to view its
          graphical log.
        </Typography>
      )}

      {appNo && app && (
        <div className="los-workflow-page los-workflow-page--compact">
          {toast && (
            <Alert severity={toast.severity} sx={{ mb: 0.75, borderRadius: 1.5, py: 0 }} onClose={() => setToast(null)}>
              {toast.text}
            </Alert>
          )}

          <section className="los-glog-card">
            <div className="los-glog-card__header">
              <div className="los-glog-card__nav" ref={wfMenuRef}>
                <span className="los-glog-card__nav-label">Workflow</span>
                <button
                  type="button"
                  className="los-glog-select"
                  aria-expanded={wfMenuOpen}
                  onClick={() => setWfMenuOpen((o) => !o)}
                  disabled={!currentFrame}
                >
                  <StatusGlyph status={currentNavStatus} />
                  <span className="los-glog-select__name">{currentFrame?.workflowName ?? "—"}</span>
                  <span className="los-glog-select__chevron" aria-hidden>
                    ▾
                  </span>
                </button>
                {wfMenuOpen && (
                  <div className="los-glog-menu" role="listbox">
                    {navTree.map((node) => {
                      const selected = node.processInstanceId === currentFrame?.processInstanceId;
                      return (
                        <button
                          key={node.processInstanceId}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={`los-glog-menu__item ${selected ? "is-selected" : ""}`}
                          style={{ paddingLeft: `${0.65 + node.depth * 0.9}rem` }}
                          onClick={() => void selectNavNode(node)}
                        >
                          <StatusGlyph status={node.status} />
                          <span className="los-glog-menu__name">{node.workflowName}</span>
                          <span className={`los-glog-menu__status los-glog-menu__status--${statusTone(node.status)}`}>
                            {node.status.replace(/_/g, " ")}
                          </span>
                        </button>
                      );
                    })}
                    {navTree.length === 0 && <div className="los-glog-menu__empty">No workflows loaded</div>}
                  </div>
                )}
              </div>
              {!isRootView && (
                <Button
                  size="small"
                  variant="outlined"
                  className="drs-themed-button"
                  startIcon={<ArrowBackIcon />}
                  disabled={busy}
                  onClick={() => void navigateToStackIndex(viewStack.length - 2)}
                >
                  Back
                </Button>
              )}
            </div>

            {!xml && (
              <p className="muted" style={{ margin: "0.35rem 0.65rem", fontSize: "0.75rem" }}>
                No diagram available — deploy and submit a new application, or open a child after Call Activity
                starts.
              </p>
            )}

            <div className="diagram-card diagram-card--enterprise diagram-card--compact">
              <BpmnCanvas
                xml={xml}
                activityStates={diagramStates}
                compact
                zoomCacheKey={currentFrame?.processInstanceId}
                selectedActivityId={selectedActivityId}
                onElementClick={(id, type) => void onElementClick(id, type)}
              />
            </div>
          </section>

          <div className="los-workflow-page__sticky-actions los-workflow-page__sticky-actions--below-diagram">
            <WorkflowActionToolbar
              app={app}
              appNo={appNo}
              onReload={reload}
              showCompleteTask
              onCompleteTask={onCompleteTask}
              busy={busy}
              processInstanceId={currentFrame?.processInstanceId}
              requireActivitySelection
              selectedActivity={
                selectedActivity
                  ? {
                      activityId: selectedActivity.activityId,
                      activityName: selectedActivity.activityName,
                      activityType: selectedActivity.activityType,
                      status: selectedActivity.status,
                    }
                  : null
              }
              onClearSelection={() => {
                setSelectedActivityId(null);
                setSelectedElementType(null);
              }}
              trailingActions={
                <Button size="small" variant="outlined" className="drs-themed-button" disabled={busy} onClick={() => void reload()}>
                  Refresh
                </Button>
              }
            />
          </div>

          {selectedActivity && (
            <aside className="los-workflow-panel los-workflow-panel--details los-workflow-panel--compact" aria-label="Activity details">
              <h3 className="los-workflow-panel__title">Detailed history of {selectedActivity.activityName} activity:</h3>
              <div className="los-child-history-wrap">
                <table className="los-table los-child-history-table">
                  <thead>
                    <tr>
                      <th>Activity Name</th>
                      <th>Child WF Name</th>
                      <th>Process Name</th>
                      <th>Activity Type</th>
                      <th>Status</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Error Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {childLinks.length > 0
                      ? childLinks.map((c) => (
                          <tr key={c.workflowId}>
                            <td>{selectedActivity.activityName}</td>
                            <td>
                              <button type="button" className="los-child-history-link" onClick={() => void openChildWorkflow(c)}>
                                {c.workflowName || c.calledElement || c.childActivityName || "Child WF"}
                              </button>
                            </td>
                            <td>{c.processName || c.workflowName || c.calledElement || "—"}</td>
                            <td>callActivity</td>
                            <td title={c.status}>
                              <span className="los-child-history-status">{childStatusLetter(c.status)}</span>
                            </td>
                            <td>{formatChildTableTime(c.startTime)}</td>
                            <td>{formatChildTableTime(c.endTime)}</td>
                            <td
                              className={`los-child-history-error${formatErrorDetailsColumn(c.errorDetails) !== "—" ? " has-error" : ""}`}
                              title={c.errorDetails || undefined}
                            >
                              {formatErrorDetailsColumn(c.errorDetails)}
                            </td>
                          </tr>
                        ))
                      : (
                          <tr>
                            <td>{selectedActivity.activityName}</td>
                            <td>—</td>
                            <td>{currentFrame?.workflowName || "—"}</td>
                            <td>{selectedActivity.activityType || "—"}</td>
                            <td title={selectedActivity.status}>
                              <span className="los-child-history-status">{childStatusLetter(selectedActivity.status)}</span>
                            </td>
                            <td>{formatChildTableTime(selectedActivity.startTime)}</td>
                            <td>{formatChildTableTime(selectedActivity.endTime)}</td>
                            <td
                              className={`los-child-history-error${selectedActivityErrorDetails !== "—" ? " has-error" : ""}`}
                              title={selectedActivity.remarks !== "—" ? selectedActivity.remarks : app?.errorMessage || undefined}
                            >
                              {selectedActivityErrorDetails}
                            </td>
                          </tr>
                        )}
                  </tbody>
                </table>
              </div>
              {isCallActivityType(selectedActivity.activityType) && childLinks.length === 0 && (
                <p className="muted" style={{ margin: "0.45rem 0 0", fontSize: "0.75rem" }}>
                  No child process started yet for this Call Activity.
                </p>
              )}
            </aside>
          )}
        </div>
      )}
    </Box>
  );
}

export default WorkflowGraphicalLogPage;
