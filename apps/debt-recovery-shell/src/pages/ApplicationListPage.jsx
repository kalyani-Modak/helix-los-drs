import { useEffect, useState } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DrsPageTitleBar } from "../components/DrsPageTitleBar";
import { useClientPagination } from "../hooks/useClientPagination";
import * as losApi from "../api/losApi";
import { workflowStatusColor, workflowStatusLabel } from "../utils/losStatus";
import "../styles/drsTheme.css";
import "../styles/workflowListPages.css";
import "../styles/workflowGraphicalLog.css";

export function ApplicationListPage() {
  const [searchParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [applicationNo, setApplicationNo] = useState("");
  const [status, setStatus] = useState("");
  const [stage, setStage] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [err, setErr] = useState(null);
  const { paged, count, page, rowsPerPage, onPageChange, onRowsPerPageChange, rowsPerPageOptions } =
    useClientPagination(rows, 10);

  async function runSearch() {
    setErr(null);
    try {
      const query = {
        applicationNo: applicationNo.trim() || undefined,
        status: status.trim() || undefined,
        stage: stage.trim() || undefined,
      };
      const list = await losApi.listApplications(query);
      if (!dateFrom.trim()) {
        setRows(list);
        return;
      }
      const from = new Date(dateFrom);
      setRows(list.filter((r) => !Number.isNaN(from.getTime()) && new Date(r.createdAt) >= from));
    } catch (e) {
      setErr(String(e));
    }
  }

  function clearFilters() {
    setApplicationNo("");
    setStatus("");
    setStage("");
    setDateFrom("");
    setErr(null);
    losApi
      .listApplications()
      .then(setRows)
      .catch((e) => setErr(String(e)));
  }

  useEffect(() => {
    const q = (searchParams.get("no") ?? searchParams.get("applicationNo") ?? "").trim();
    setErr(null);
    if (q) {
      setApplicationNo(q);
      losApi
        .listApplications({ applicationNo: q })
        .then(setRows)
        .catch((e) => setErr(String(e)));
      return;
    }
    losApi
      .listApplications()
      .then(setRows)
      .catch((e) => setErr(String(e)));
  }, [searchParams]);

  return (
    <Box className="los-page">
      <DrsPageTitleBar>Application list</DrsPageTitleBar>
      <Typography variant="body2" color="text.secondary" className="los-lead" sx={{ mb: 2, maxWidth: 720 }}>
        Search applications created from the Application Entry Form and see where each one stands in the workflow.
      </Typography>
      {err && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setErr(null)}>
          {err}
        </Alert>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
        <TextField
          size="small"
          label="Application no"
          value={applicationNo}
          onChange={(e) => setApplicationNo(e.target.value)}
          className="drs-themed-textfield"
        />
        <TextField
          size="small"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="drs-themed-textfield"
        />
        <TextField
          size="small"
          label="Workflow stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="drs-themed-textfield"
        />
        <TextField
          size="small"
          label="Created on or after"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          InputLabelProps={{ shrink: true }}
          className="drs-themed-textfield"
        />
        <Button variant="contained" className="drs-themed-button" onClick={() => void runSearch()}>
          Search
        </Button>
        <Button variant="outlined" className="drs-themed-button" onClick={clearFilters}>
          Clear
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid", borderColor: "var(--drs-border-divider)" }}
      >
        <Table size="small" stickyHeader className="los-table drs-mui-table">
          <TableHead>
            <TableRow>
              <TableCell>Application no</TableCell>
              <TableCell>Applicant</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Workflow</TableCell>
              <TableCell>Current task</TableCell>
              <TableCell>Workflow status</TableCell>
              <TableCell>Application status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Graphical log</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((r) => {
              const wfLabel =
                (r.workflowName && r.workflowName.trim()) ||
                (r.workflowCode && r.workflowCode.trim()) ||
                (r.processDefinitionKey && r.processDefinitionKey.trim()) ||
                "—";
              const ws = r.workflowStatus ?? "IN_PROGRESS";
              const statusColor = workflowStatusColor(ws);
              const canOpenWf = Boolean(r.processInstanceId || r.processDefinitionId);
              const wfHref = `/homelayout/workflow-registry/graphical-log/${encodeURIComponent(r.applicationNumber)}`;
              return (
                <TableRow key={r.applicationNumber ?? r.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {r.applicationNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{r.applicantName}</TableCell>
                  <TableCell>{r.mobileNumber}</TableCell>
                  <TableCell>
                    {canOpenWf ? (
                      <RouterLink to={wfHref} className="los-child-history-link">
                        {wfLabel}
                      </RouterLink>
                    ) : (
                      wfLabel
                    )}
                  </TableCell>
                  <TableCell>{r.currentActivity ?? "—"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={workflowStatusLabel(ws)}
                      title={String(ws).toUpperCase() === "ERROR" ? (r.errorMessage ?? undefined) : undefined}
                      sx={{
                        fontWeight: 700,
                        bgcolor: `${statusColor}22`,
                        color: statusColor,
                        border: `1px solid ${statusColor}55`,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={r.status} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</TableCell>
                  <TableCell>{r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "—"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="text"
                      component={RouterLink}
                      to={`/homelayout/workflow-registry/graphical-log/${encodeURIComponent(r.applicationNumber)}`}
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No applications found.
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

export default ApplicationListPage;
