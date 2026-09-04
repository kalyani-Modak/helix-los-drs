import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Chip, Grid, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HButtonBar, HDropdown, HFileUpload, HLabel, HPaper, HTextarea, HTextField, HAgGrid, useToast } from "@helix/component-library";

import { UploadDocumentAPI } from "./apiEndpoints";
import FunctionLayout from "./FunctionLayout";


import { createUploadDocumentColumnDefs } from "./upload-document/uploadDocumentColumnDefs.jsx";
import { buildDefaultDocumentTypeOptions,UPLOAD_ACCEPT, UPLOAD_MAX_BYTES,} from "./upload-document/uploadDocumentConstants.js";
import { useLocation } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// Response normaliser
// ─────────────────────────────────────────────────────────────────────────────
function mapRowsFromResponse(payload) {
  const raw = Array.isArray(payload)
    ? payload
    : (payload?.responseJson ??
       payload?.documents     ??
       payload?.lstDocuments  ??
       payload?.uploadHistory ??
       payload?.data          ??
       []);

  if (!Array.isArray(raw)) return [];

  return raw.map((row, idx) => ({
    id:           row.szDocId        ?? row.documentId ?? row.id ?? idx + 1,
    documentId:   row.szDocId        ?? row.documentId ?? null,
    versionId:    row.szVersionId    ?? row.versionId  ?? null,
    documentType: row.szDocumentType ?? row.documentType ?? "",
    referenceNo:  row.szReferenceNo  ?? row.referenceNo  ?? "",
    remarks:      row.szRemarks      ?? row.remarks       ?? "",
    fileName:     row.szFileName     ?? row.fileName      ?? "",
    fileSize:     row.szFileSize     ?? row.fileSize      ?? "",
    date:         row.dtCreatedOn    ?? row.createdAt     ?? row.date ?? "",
    user:         row.szOwner        ?? row.szCreatedBy   ?? row.user ?? "",
  }));
}

const IDEMPOTENCY_STORAGE_KEY = "UPLOAD_DOCUMENT_IDEMPOTENCY_KEY";

function randomIdempotencyKey() {
  return `drs-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function getOrCreateIdempotencyKey() {
  let key = localStorage.getItem(IDEMPOTENCY_STORAGE_KEY);

  if (!key) {
    key = randomIdempotencyKey();
    localStorage.setItem(IDEMPOTENCY_STORAGE_KEY, key);
  }

  return key;
}

function clearIdempotencyKey() {
  localStorage.removeItem(IDEMPOTENCY_STORAGE_KEY);
}


// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const UploadDocument = () => {
  const intl     = useIntl();
  const toast    = useToast();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((s) => s.account);
  const location = useLocation();
  const screenMenuId =  location.state.menuId;

  // ── Form state ─────────────────────────────────────────────────────────────
  const [documentType, setDocumentType] = useState("");
  const [referenceNo,  setReferenceNo]  = useState("");
  const [remarks,      setRemarks]      = useState("");
  const [file,         setFile]         = useState(null);

  // ── Grid + loading state ───────────────────────────────────────────────────
  const [rows,        setRows]        = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [loadError,   setLoadError]   = useState("");
  const [downloading, setDownloading] = useState(false);

  // ── Validation state ───────────────────────────────────────────────────────
  const [typeErr, setTypeErr] = useState(false);
  const [refErr,  setRefErr]  = useState(false);
  const [fileErr, setFileErr] = useState(false);

  // ── Tenant realm for DMS file-stream header ────────────────────────────────
  const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";

  // ── Document type options ──────────────────────────────────────────────────
  const documentTypeOptions = useMemo(
    () => buildDefaultDocumentTypeOptions(intl),
    [intl],
  );

  // ── Account context guard ──────────────────────────────────────────────────
  const hasAccount = Boolean(selectedRow?.ACNT_SEQNO);

  // ─────────────────────────────────────────────────────────────────────────
  // Fetch document upload history
  // Backend: POST  customer-management/getDocumentHistory
  // ─────────────────────────────────────────────────────────────────────────
  const loadHistory = useCallback(async () => {
    if (!hasAccount) {
      setRows([]);
      setLoadError(intl.formatMessage({ id: "error.uploadDocument.noAccount" }));
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const res     = await HAxiosService.GET(
        UploadDocumentAPI.UploadDocApi(screenMenuId),
      );
      const payload = res?.data?.responseJson ?? res?.data?.data ?? res?.data ?? {};
      setRows(mapRowsFromResponse(payload));
    } catch (e) {
      console.error("fetchDocumentHistory", e);
      setRows([]);
      setLoadError(intl.formatMessage({ id: "error.uploadDocument.fetch" }));
      toast.error(intl.formatMessage({ id: "error.uploadDocument.fetch" }));
    } finally {
      setLoading(false);
    }
  }, [hasAccount, intl, toast]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ─────────────────────────────────────────────────────────────────────────
  // Form helpers
  // ─────────────────────────────────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setDocumentType("");
    setReferenceNo("");
    setRemarks("");
    setFile(null);
    setTypeErr(false);
    setRefErr(false);
    setFileErr(false);
  }, []);

  const validate = useCallback(() => {
    let ok = true;
    if (!documentType)               { setTypeErr(true); ok = false; } else setTypeErr(false);
    if (!String(referenceNo).trim()) { setRefErr(true);  ok = false; } else setRefErr(false);
    if (!file)                       { setFileErr(true); ok = false; } else setFileErr(false);
    return ok;
  }, [documentType, referenceNo, file]);

  // ─────────────────────────────────────────────────────────────────────────
  // Upload
  // Backend : POST  customer-management/uploadDocument
  // Part "request" : { documentUploadFormRequestDto }
  // Part "file"    : binary
  // ─────────────────────────────────────────────────────────────────────────
  const submitUpload = useCallback(async () => {
    if (!hasAccount) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.noAccount" }));
      return;
    }
    if (!validate()) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.missingFields" }));
      return;
    }
    const idempotencyKey = getOrCreateIdempotencyKey(
      
     );

    const requestDto = {
      documentUploadFormRequestDto: {
        documentType,
        referenceNo: referenceNo.trim(),
        remarks:     remarks ?? "",
      },
    };

    const fd = new FormData();
    fd.append(
      "request",
      new Blob([JSON.stringify(requestDto)], { type: "application/json" }),
    );
    fd.append("file", file);

    try {
     const res = await HAxiosService.POST(
      `${UploadDocumentAPI.UploadDocApi(screenMenuId)}/uploadDocument`,
      fd,
      {},
       false,
  {
    "Content-Type": "multipart/form-data",
    "Idempotency-Key": idempotencyKey,
  },
);
      const statusOk =
        res?.status === 200 &&
        (res?.data == null ||
          res?.data?.success === true ||
          String(res?.data?.status ?? "").toLowerCase() === "success");

      if (statusOk) {
            clearIdempotencyKey();   // <-- add this first

        toast.success(
          res?.data?.message ??
            intl.formatMessage(
              { id: "message.uploadDocument.uploadSuccess" },
              { name: file.name },
            ),
            
        );
        resetForm();
        await loadHistory();
      } else {
        toast.error(
          res?.data?.message ?? intl.formatMessage({ id: "error.uploadDocument.upload" }),
        );
      }
    } catch (e) {
      console.error("uploadDocument", e);   
        clearIdempotencyKey();

      toast.error(
        e?.response?.data?.message ?? intl.formatMessage({ id: "error.uploadDocument.upload" }),
      );
    }
  }, [
    hasAccount, documentType, file, intl,
    loadHistory, referenceNo, remarks, resetForm, toast, validate,
  ]);

  // ─────────────────────────────────────────────────────────────────────────
  // Download
  //
  // Backend service signature:
  //   getDocument(Jwt jwt, CommonRequestDto commonRequestDto,
  //               String documentId, String versionId)
  //
  // Controller (POST):
  //   POST  customer-management/retrieveDocument/{documentId}?versionId={versionId}
  //   Body : CommonRequestDto  (flat — NOT wrapped in any outer object)
  //
  // Backend uses commonRequestDto.acctSeqNo + partitionCode to verify
  // document ownership via:
  //   findBySzDocIdAndLnAccountSeqNoAndSzPartitionCode(documentId, acctSeqNo, partitionCode)
  // then delegates to dmsIngestionClient.getDocument() → RetrievalResponse
  // ─────────────────────────────────────────────────────────────────────────
  const handleDownload = useCallback(async (row) => {
    if (!row?.documentId) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.noDocumentId" }));
      return;
    }
    if (!hasAccount) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.noAccount" }));
      return;
    }

    setDownloading(true);
    try {
      const res = await HAxiosService.GET(
        UploadDocumentAPI.downloadDocument(
          screenMenuId,
          row.documentId,
          row.versionId ?? ""
        ),
        {},
        false,
        { "Content-Type": "application/json" },
      );

      // ── Step 2: extract downloadUrl from RetrievalResponse
      const downloadUrl =
        res?.data?.responseJson?.downloadUrl ??
        res?.data?.downloadUrl               ??
        null;

      if (!downloadUrl) {
        toast.error(intl.formatMessage({ id: "error.uploadDocument.noDownloadUrl" }));
        return;
      }

      // ── Step 3: fetch file stream from DMS (port 4080) with X-Tenant-Id
 const dmsBase = import.meta.env.VITE_BASE_DMS_API_PATH.replace(/\/$/, "");

  const fullUrl = downloadUrl.startsWith("http") ? downloadUrl : `${dmsBase}${downloadUrl}`;
const token = sessionStorage.getItem("SEC_TOKEN");

      const fileResp = await fetch(fullUrl, {
        method:  "GET",
        headers: { "X-Tenant-Id": realm, "Authorization": `Bearer ${token}` },
      });

      if (!fileResp.ok) {
        throw new Error(`DMS stream failed: ${fileResp.status}`);
      }

      // ── Step 4: trigger browser file download
      const blob    = await fileResp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor  = document.createElement("a");
      anchor.href     = blobUrl;
      anchor.download = row.fileName || "document";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);

      toast.success(
        intl.formatMessage(
          { id: "message.uploadDocument.downloadSuccess" },
          { name: row.fileName || "document" },
        ),
      );
    } catch (error) {
      console.error("handleDownload", error);
      toast.error(intl.formatMessage({ id: "error.uploadDocument.downloadFailed" }));
    } finally {
      setDownloading(false);
    }
  }, [hasAccount, realm, intl, toast]);

  // ─────────────────────────────────────────────────────────────────────────
  // Grid config
  // ─────────────────────────────────────────────────────────────────────────
  const columnDefs = useMemo(
    () => createUploadDocumentColumnDefs(intl, { onDownload: handleDownload, downloading }),
    [intl, handleDownload, downloading],
  );

  const gridStyle = { width: "100%", height: "200px" };

  // ─────────────────────────────────────────────────────────────────────────
  // Misc derived values
  // ─────────────────────────────────────────────────────────────────────────
  const fileSizeHint = file != null
    ? intl.formatMessage(
        { id: "label.uploadDocument.fileSizeKb" },
        { kb: Math.max(1, Math.round(file.size / 1024)) },
      )
    : null;

  const handleFileChange = (next, errInfo) => {
    if (errInfo?.message) toast.error(errInfo.message);
    setFile(next ?? null);
    setFileErr(false);
  };

  const sectionHeaderSx = {
    display:      "flex",
    alignItems:   "center",
    gap:          1,
    px:           2,
    py:           1,
    borderBottom: 1,
    borderColor:  "divider",
  };

  const fieldCellSx = {
    display:       "flex",
    flexDirection: "column",
    minWidth:      0,
    width:         "100%",
    gap:           0.5,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <FunctionLayout
      title={intl.formatMessage({ id: "label.uploadDocument.title" })}
      breadcrumbMid={intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection",
      })}
      contentPaddingTop={0}
    >
      <HBox
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          pb: { xs: 2, sm: 3 },
          pt: 1,
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* ── Upload form section ──────────────────────────────────────────── */}
        <HPaper variant="outlined" elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" }}>

          <HBox sx={sectionHeaderSx}>
            <CloudUploadIcon color="primary" sx={{ fontSize: 18 }} />
            <Typography variant="subtitle2" color="text.primary">
              {intl.formatMessage({ id: "label.uploadDocument.section.upload" })}
            </Typography>
          </HBox>

          <HBox sx={{ p: 2 }}>
            <Grid container spacing={2}>

              {/* Left col — Document Type, Reference No, Remarks */}
              <Grid size={{ xs: 12, md: 4 }}>
                <HBox sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>

                  <HBox sx={fieldCellSx}>
                    <HLabel value="label.uploadDocument.documentType" required align="left" colon={false} />
                    <HDropdown
                      id="uploadDocumentType"
                      name="documentType"
                      options={documentTypeOptions}
                      value={documentType}
                      onChange={(e) => { setDocumentType(e.target.value); setTypeErr(false); }}
                      placeholder={intl.formatMessage({ id: "label.uploadDocument.documentType.placeholder" })}
                      width="100%"
                      error={typeErr}
                    />
                  </HBox>

                  <HBox sx={fieldCellSx}>
                    <HLabel value="label.uploadDocument.referenceNo" required align="left" colon={false} />
                    <HTextField
                      id="uploadDocumentReference"
                      name="referenceNo"
                      value={referenceNo}
                      onChange={(e) => { setReferenceNo(e.target.value); setRefErr(false); }}
                      placeholder={intl.formatMessage({ id: "label.uploadDocument.referenceNo.placeholder" })}
                      width="100%"
                      error={refErr}
                      editable={true}
                      autoComplete="off"
                    />
                  </HBox>

                  <HBox sx={fieldCellSx}>
                    <HLabel value="label.uploadDocument.remarks" align="left" colon={false} />
                    <HTextarea
                      id="uploadDocumentRemarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder={intl.formatMessage({ id: "label.uploadDocument.remarks.placeholder" })}
                      width="100%"
                      multiline
                      rows={2}
                    />
                  </HBox>

                </HBox>
              </Grid>

              {/* Right col — File drop zone */}
              <Grid size={{ xs: 12, md: 8 }}>
                <HFileUpload
                  inputId="upload-document-file-input"
                  accept={UPLOAD_ACCEPT}
                  file={file}
                  onFileChange={handleFileChange}
                  onClear={() => setFile(null)}
                  disabled={!hasAccount}
                  maxSizeBytes={UPLOAD_MAX_BYTES}
                  dropHint={intl.formatMessage({ id: "label.uploadDocument.dropHint" })}
                  supportedHint={intl.formatMessage({ id: "label.uploadDocument.supportedHint" })}
                  fileSizeHint={fileSizeHint}
                  removeLabel="label.uploadDocument.remove"
                  invalidTypeMessage={intl.formatMessage({ id: "error.uploadDocument.invalidType" })}
                  maxSizeMessage={intl.formatMessage({ id: "error.uploadDocument.maxSize" })}
                />
                {fileErr && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {intl.formatMessage({ id: "error.uploadDocument.fileRequired" })}
                  </Typography>
                )}
              </Grid>

            </Grid>
          </HBox>
        </HPaper>

        {/* ── Document Upload History section ──────────────────────────────── */}
        <HPaper variant="outlined" elevation={0}
          sx={{ borderRadius: 2, overflow: "hidden", bgcolor: "background.paper", display: "flex", flexDirection: "column" }}>

          <HBox sx={{ ...sectionHeaderSx, flexWrap: "wrap" }}>
            <DescriptionIcon color="primary" sx={{ fontSize: 18 }} />
            <Typography variant="subtitle2" color="text.primary">
              {intl.formatMessage({ id: "label.uploadDocument.section.history" })}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              label={intl.formatMessage(
                { id: "label.uploadDocument.historyCount" },
                { count: rows.length },
              )}
              sx={{ ml: "auto" }}
            />
          </HBox>

          <HBox sx={{ p: 2, pt: 1 }}>
            {loadError && !loading && (
              <Typography variant="caption" color="error" sx={{ display: "block", mb: 2 }}>
                {loadError}
              </Typography>
            )}
            <HAgGrid
              rowData={rows}
              columnDefs={columnDefs}
              gridStyle={gridStyle}
              embeddedInSection={false}
              pagination={true}
              paginationPageSize={4}
               sort={true}
              showTitle={false}
              hideInternalSaveButton={true}
              allowAdd={false}
              allowDelete={false}
              allowUpdate={false}
              isLoading={loading}
            />
          </HBox>
        </HPaper>

        {/* ── Button bar ───────────────────────────────────────────────────── */}
        <HBox sx={{ position: "relative", zIndex: 2000 }}>
          <HButtonBar
            onSave={() => void submitUpload()}
            onReset={() => { resetForm(); void loadHistory(); }}
            onClose={() => navigate("/homelayout/welcomepage")}
          />
        </HBox>

      </HBox>
    </FunctionLayout>
  );
};

export default UploadDocument;
