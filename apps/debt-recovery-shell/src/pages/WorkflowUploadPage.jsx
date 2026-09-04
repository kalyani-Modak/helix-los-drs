import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import * as masterApi from "../api/masterApi";
import "../styles/drsTheme.css";
import "../styles/workflowListPages.css";

export function WorkflowUploadPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSave() {
    if (!file || !name.trim()) {
      setErr("Workflow name and BPMN file are required.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await masterApi.saveWorkflowDraft({ file, workflowName: name.trim(), description });
      nav("/homelayout/workflow-registry/list");
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box className="los-page">
      <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>
        Upload workflow
      </Typography>
      <Typography variant="body2" color="text.secondary" className="los-lead" sx={{ mb: 2 }}>
        Save the BPMN here. Deployment happens from the workflow list when you open a row.
      </Typography>
      {err && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {err}
        </Alert>
      )}
      <Stack spacing={2} sx={{ maxWidth: 560, mb: 2 }}>
        <TextField
          label="Workflow name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          className="drs-themed-textfield"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          className="drs-themed-textfield"
        />
        <Button variant="outlined" component="label" className="drs-themed-button" sx={{ alignSelf: "flex-start" }}>
          BPMN file
          <input type="file" accept=".bpmn,.xml" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </Button>
        {file && (
          <Typography variant="caption" color="text.secondary">
            Selected: {file.name}
          </Typography>
        )}
      </Stack>
      <Button variant="contained" className="drs-themed-button" disabled={busy} onClick={() => void onSave()}>
        {busy ? "Saving…" : "Save"}
      </Button>
    </Box>
  );
}

export default WorkflowUploadPage;
