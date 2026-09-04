import { useCallback, useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BpmnCanvas } from "../components/BpmnCanvas";
import * as masterApi from "../api/masterApi";
import "../styles/drsTheme.css";
import "../styles/workflowListPages.css";

export function WorkflowDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const wfId = id ? Number.parseInt(id, 10) : NaN;
  const [wf, setWf] = useState(null);
  const [activateAfterDeploy, setActivateAfterDeploy] = useState(true);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (Number.isNaN(wfId)) return;
    setErr(null);
    try {
      setWf(await masterApi.getWorkflowDefinition(wfId));
    } catch (e) {
      setErr(String(e));
    }
  }, [wfId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDeploy(activate = activateAfterDeploy) {
    if (Number.isNaN(wfId)) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await masterApi.deployWorkflow(wfId, activate);
      setMsg(
        isDraft
          ? "Deployed. Only one workflow can be ACTIVE for new loan applications."
          : "Redeployed to Flowable (Call Activity keys normalized). Submit a new application to use this definition.",
      );
      await load();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onMakeActive() {
    if (Number.isNaN(wfId)) return;
    setBusy(true);
    setErr(null);
    try {
      await masterApi.activateWorkflow(wfId);
      setMsg("This version is now ACTIVE for new applications.");
      await load();
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  if (Number.isNaN(wfId)) {
    return (
      <Typography className="los-page muted" color="text.secondary">
        Invalid workflow id.
      </Typography>
    );
  }

  const isDraft = wf?.status === "DRAFT";
  const isActive = wf?.status === "ACTIVE";
  const isInactive = wf?.status === "INACTIVE";
  const canRedeploy = isActive || isInactive;

  return (
    <Box className="los-page">
      <Button component={RouterLink} to="/homelayout/workflow-registry/list" startIcon={<ArrowBackIcon />} variant="outlined" className="drs-themed-button" sx={{ mb: 2 }}>
        Workflow list
      </Button>
      <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>
        Workflow detail
      </Typography>
      {err && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {err}
        </Alert>
      )}
      {msg && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {msg}
        </Alert>
      )}
      {!wf && !err && (
        <Typography color="text.secondary">
          Loading…
        </Typography>
      )}
      {wf && (
        <>
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Name
              </Typography>
              <Typography variant="body1">{wf.workflowName}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Code
              </Typography>
              <Typography variant="body1">{wf.workflowCode}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Status
              </Typography>
              <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                <Chip size="small" label={wf.status} variant="outlined" />
                {isActive && <Chip size="small" label="CURRENT ACTIVE" color="success" />}
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {wf.description || "—"}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="h6" fontWeight={700} gutterBottom>
            Workflow design
          </Typography>
          {wf.bpmnXml ? (
            <BpmnCanvas xml={wf.bpmnXml} toolbarTitle="Workflow design" showExecutionLegend={false} />
          ) : (
            <Typography color="text.secondary">No diagram content.</Typography>
          )}

          {isDraft && (
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox checked={activateAfterDeploy} onChange={(e) => setActivateAfterDeploy(e.target.checked)} />
                }
                label="After deploy, set as ACTIVE (only one ACTIVE at a time; others become INACTIVE)"
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button variant="contained" className="drs-themed-button" disabled={busy} onClick={() => void onDeploy()}>
                  {busy ? "Deploying…" : "Deploy to Flowable"}
                </Button>
              </Stack>
            </Box>
          )}

          {canRedeploy && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Already deployed. Use Redeploy to push the current BPMN again (fixes Call Activity keys, new process
                definition version). Existing applications keep the old definition — submit a new one after redeploy.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  className="drs-themed-button"
                  disabled={busy}
                  onClick={() => void onDeploy(isActive)}
                >
                  {busy ? "Redeploying…" : "Redeploy to Flowable"}
                </Button>
                {isInactive && (
                  <Button
                    variant="contained"
                    color="success"
                    className="drs-themed-button"
                    disabled={busy}
                    onClick={() => void onMakeActive()}
                  >
                    Set as ACTIVE
                  </Button>
                )}
              </Stack>
            </Box>
          )}

          {isActive && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This definition is what Transaction Service uses when stamping new applications.
            </Typography>
          )}

          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" className="drs-themed-button" onClick={() => nav("/homelayout/workflow-registry/list")}>
              Back to list
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

export default WorkflowDetailPage;
