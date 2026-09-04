import { useCallback, useEffect, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DrsPageTitleBar } from "../components/DrsPageTitleBar";
import { useClientPagination } from "../hooks/useClientPagination";
import * as masterApi from "../api/masterApi";
import "../styles/drsTheme.css";
import "../styles/workflowListPages.css";

function truncate(s, max) {
  if (!s) return "—";
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

export function WorkflowListPage() {
  const nav = useNavigate();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);
  const { paged, count, page, rowsPerPage, onPageChange, onRowsPerPageChange, rowsPerPageOptions } =
    useClientPagination(rows, 10);

  const reload = useCallback(async () => {
    setErr(null);
    try {
      setRows(await masterApi.listWorkflowDefinitions());
    } catch (e) {
      setErr(String(e));
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function onMoveToDraft(e, row) {
    e.stopPropagation();
    e.preventDefault();
    if (row.status !== "INACTIVE") return;
    const ok = window.confirm(
      `Move "${row.workflowName}" to DRAFT?\n\nYou can then open it in Workflow Designer and Save. Redeploy/Activate later from the workflow detail page.`,
    );
    if (!ok) return;
    setBusyId(row.id);
    setToast(null);
    setErr(null);
    try {
      const res = await masterApi.moveWorkflowToDraft(row.id);
      setToast(res.message || "Moved to DRAFT.");
      await reload();
    } catch (ex) {
      const msg =
        ex && typeof ex === "object" && "response" in ex
          ? String(ex.response?.data?.error || ex)
          : String(ex);
      setErr(msg);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Box className="los-page">
      <DrsPageTitleBar>Workflow list</DrsPageTitleBar>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
        <Button
          component={RouterLink}
          to="/homelayout/workflow-registry/upload"
          variant="contained"
          className="drs-themed-button"
          startIcon={<AddIcon />}
        >
          Upload new
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" className="los-lead" sx={{ mb: 2 }}>
        Click a row to open the BPMN and deploy. Only one ACTIVE workflow is used when new applications are
        submitted. Use <strong>Move to Draft</strong> on an Inactive workflow before editing it in Workflow
        Designer.
      </Typography>
      {err && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setErr(null)}>
          {err}
        </Alert>
      )}
      {toast && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setToast(null)}>
          {toast}
        </Alert>
      )}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small" className="los-table drs-mui-table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((r) => (
              <TableRow
                key={r.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => nav(`/homelayout/workflow-registry/workflow/${r.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    nav(`/homelayout/workflow-registry/workflow/${r.id}`);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`Open workflow ${r.workflowName}`}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>
                    {r.workflowName}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center", mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {r.workflowCode}
                    </Typography>
                    {r.currentActive && <Chip size="small" label="ACTIVE" color="success" />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {truncate(r.description, 140)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={r.status} variant="outlined" />
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  {r.status === "INACTIVE" ? (
                    <Button
                      size="small"
                      variant="outlined"
                      className="drs-themed-button"
                      disabled={busyId === r.id}
                      onClick={(e) => void onMoveToDraft(e, r)}
                    >
                      {busyId === r.id ? "Moving…" : "Move to Draft"}
                    </Button>
                  ) : (
                    <Typography variant="caption" color="text.disabled">
                      —
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No workflows found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </TableContainer>
    </Box>
  );
}

export default WorkflowListPage;
