import { useState } from "react";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";
import * as losApi from "../api/losApi";
import "../styles/drsTheme.css";
import "../styles/workflowListPages.css";

/** Flowable form-property style → flat process vars: { name, value, type } → { [name]: value } */
function normalizeExtraVariables(input) {
  if (input === null || typeof input !== "object") {
    return null;
  }
  if (Array.isArray(input)) {
    const out = {};
    for (const item of input) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        if (typeof item.name === "string" && item.name && "value" in item) {
          out[item.name] = item.value;
        }
      }
    }
    return out;
  }
  const obj = input;
  // Single form-property object: { "name": "apprej", "value": "APPROVE", "type": "string" }
  if (
    typeof obj.name === "string" &&
    obj.name &&
    "value" in obj &&
    Object.keys(obj).every((k) => k === "name" || k === "value" || k === "type")
  ) {
    return { [obj.name]: obj.value };
  }
  return obj;
}

function parseExtraVariables(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true };
  }
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, error: "Extra variables must be valid JSON." };
  }
  const normalized = normalizeExtraVariables(parsed);
  if (normalized === null) {
    return {
      ok: false,
      error: 'Extra variables must be a JSON object, e.g. { "apprej": "APPROVE" }.',
    };
  }
  return { ok: true, value: normalized };
}

export function ApplicationEntryFormPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [extraJson, setExtraJson] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onDraft() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const r = await losApi.saveDraft({ applicantName: name, mobileNumber: mobile });
      setMsg(`Draft saved (${r.applicationNumber})`);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onSubmit() {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const parsed = parseExtraVariables(extraJson);
      if (!parsed.ok) {
        setErr(parsed.error);
        return;
      }
      const body = { applicantName: name, mobileNumber: mobile };
      if (parsed.value && Object.keys(parsed.value).length > 0) {
        body.extraVariables = parsed.value;
      }
      const r = await losApi.submitApplication(body);
      setMsg(`Submitted ${r.applicationNumber} — workflow started`);
      setName("");
      setMobile("");
      setExtraJson("");
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Box className="los-page">
      <Typography variant="h5" component="h2" fontWeight={800} gutterBottom>
        Application entry form
      </Typography>
      <Typography variant="body2" color="text.secondary" className="los-lead" sx={{ mb: 2, maxWidth: 720 }}>
        Creates the application record, stamps the active BPMN snapshot, and starts the workflow process instance.
      </Typography>
      {msg && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
          {msg}
        </Alert>
      )}
      {err && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {err}
        </Alert>
      )}
      <Stack spacing={2} sx={{ maxWidth: 560, mb: 2 }}>
        <TextField
          label="Applicant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full legal name"
          fullWidth
          className="drs-themed-textfield"
        />
        <TextField
          label="Mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="+91…"
          fullWidth
          className="drs-themed-textfield"
        />
        <TextField
          label="Extra process variables (JSON, optional)"
          value={extraJson}
          onChange={(e) => setExtraJson(e.target.value)}
          placeholder={'e.g. { "apprej": "APPROVE" }'}
          fullWidth
          multiline
          minRows={4}
          maxRows={12}
          className="drs-themed-textfield"
          helperText='Use flat keys matching gateway conditions, e.g. { "apprej": "APPROVE" } or { "apprej": "REJ" }. Not { name, value, type }. Leave blank for default.'
        />
      </Stack>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button variant="outlined" className="drs-themed-button" disabled={busy} onClick={() => void onDraft()}>
          Save draft
        </Button>
        <Button
          variant="contained"
          className="drs-themed-button"
          disabled={busy || !name || !mobile}
          onClick={() => void onSubmit()}
        >
          Submit application
        </Button>
      </Stack>
    </Box>
  );
}

export default ApplicationEntryFormPage;
