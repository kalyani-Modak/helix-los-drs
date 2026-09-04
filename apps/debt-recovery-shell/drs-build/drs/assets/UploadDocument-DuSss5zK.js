import { dD as lE, dB as jsxRuntimeExports, ab as Download, ed as useIntl, ct as ar, eh as useNavigate, el as useSelector, ef as useLocation, dN as reactExports, aX as Kr, ci as UploadDocumentAPI, ac as Dt, aW as Kg, Q as CloudUploadIcon, cf as Typography, aM as Grid, dK as ps, bH as SE, cs as ap, dI as pp, cL as dp, a2 as DescriptionIcon, M as Chip, cy as bu, cj as Vg } from "./index-BhdgJqva.js";
import { F as FunctionLayout } from "./FunctionLayout-CgZVqqDl.js";
import { c as compactHeaderStyle, t as textCellStyle, d as descCell, m as mutedTextCellStyle } from "./returnMailTrackingGridDef-BfDKTaS6.js";
function wrap(col) {
  return {
    ...col,
    filter: false,
    headerStyle: compactHeaderStyle
  };
}
function createUploadDocumentColumnDefs(intl, ctx) {
  const { onDownload, downloading = false } = ctx;
  return [
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.documentType" }),
      field: "documentType",
      minWidth: 120,
      flex: 1,
      cellStyle: textCellStyle(lE.TEXT)
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.file" }),
      field: "fileName",
      minWidth: 180,
      flex: 1.25,
      cellStyle: { ...descCell, textAlign: lE.TEXT },
      cellRenderer: (params) => {
        var _a, _b;
        const name = ((_a = params.data) == null ? void 0 : _a.fileName) ?? "";
        const size = ((_b = params.data) == null ? void 0 : _b.fileSize) ?? "";
        const rowData = params.data;
        if (!name) return "";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "#",
              onClick: (e) => {
                e.preventDefault();
                if (onDownload && !downloading) {
                  onDownload(rowData);
                }
              },
              style: {
                color: downloading ? "#ccc" : "var(--drs-primary)",
                cursor: downloading ? "not-allowed" : "pointer",
                textDecoration: "underline",
                fontSize: "11px",
                fontWeight: 600
              },
              title: intl.formatMessage({ id: "label.uploadDocument.downloadFile" }),
              children: name
            }
          ),
          !downloading && onDownload && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Download,
            {
              sx: {
                fontSize: 14,
                color: "var(--drs-primary)",
                cursor: "pointer",
                "&:hover": { opacity: 0.7 }
              },
              onClick: (e) => {
                e.stopPropagation();
                onDownload(rowData);
              }
            }
          ),
          size && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 400, color: "var(--drs-text-muted)", fontSize: "10px" }, children: [
            "(",
            size,
            ")"
          ] })
        ] });
      }
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.referenceNo" }),
      field: "referenceNo",
      minWidth: 110,
      flex: 0.85,
      cellStyle: textCellStyle(lE.TEXT)
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.remarks" }),
      field: "remarks",
      minWidth: 140,
      flex: 1,
      cellStyle: mutedTextCellStyle(lE.TEXT)
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.date" }),
      field: "date",
      minWidth: 96,
      flex: 0.65,
      cellStyle: textCellStyle(lE.DATE),
      valueFormatter: (params) => {
        if (!params.value) return "";
        try {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        } catch (e) {
          return params.value;
        }
      }
    }),
    wrap({
      headerName: intl.formatMessage({ id: "label.uploadDocument.grid.user" }),
      field: "user",
      minWidth: 100,
      flex: 0.85,
      cellStyle: textCellStyle(lE.TEXT)
    })
  ];
}
const UPLOAD_ACCEPT = ".csv,.doc,.docx,.jpg,.jpeg,.pdf,.xls,.xlsx";
const UPLOAD_MAX_BYTES = 20 * 1024 * 1024;
const DOCUMENT_TYPE_I18N_KEYS = [
  "identityProof",
  "addressProof",
  "incomeProof",
  "bankStatement",
  "paymentReceipt",
  "legalNotice",
  "settlementLetter",
  "authorizationLetter",
  "insuranceDocument",
  "vehicleDocument",
  "other"
];
const DOCUMENT_TYPE_DEFAULT_LABELS = {
  identityProof: "Identity Proof",
  addressProof: "Address Proof",
  incomeProof: "Income Proof",
  bankStatement: "Bank Statement",
  paymentReceipt: "Payment Receipt",
  legalNotice: "Legal Notice",
  settlementLetter: "Settlement Letter",
  authorizationLetter: "Authorization Letter",
  insuranceDocument: "Insurance Document",
  vehicleDocument: "Vehicle Document",
  other: "Other"
};
function buildDefaultDocumentTypeOptions(intl) {
  return DOCUMENT_TYPE_I18N_KEYS.map((key) => {
    const id = `label.uploadDocument.type.${key}`;
    const label = intl.formatMessage({
      id,
      defaultMessage: DOCUMENT_TYPE_DEFAULT_LABELS[key] || key
    });
    return { value: label, label };
  });
}
function mapRowsFromResponse(payload) {
  const raw = Array.isArray(payload) ? payload : (payload == null ? void 0 : payload.responseJson) ?? (payload == null ? void 0 : payload.documents) ?? (payload == null ? void 0 : payload.lstDocuments) ?? (payload == null ? void 0 : payload.uploadHistory) ?? (payload == null ? void 0 : payload.data) ?? [];
  if (!Array.isArray(raw)) return [];
  return raw.map((row, idx) => ({
    id: row.szDocId ?? row.documentId ?? row.id ?? idx + 1,
    documentId: row.szDocId ?? row.documentId ?? null,
    versionId: row.szVersionId ?? row.versionId ?? null,
    documentType: row.szDocumentType ?? row.documentType ?? "",
    referenceNo: row.szReferenceNo ?? row.referenceNo ?? "",
    remarks: row.szRemarks ?? row.remarks ?? "",
    fileName: row.szFileName ?? row.fileName ?? "",
    fileSize: row.szFileSize ?? row.fileSize ?? "",
    date: row.dtCreatedOn ?? row.createdAt ?? row.date ?? "",
    user: row.szOwner ?? row.szCreatedBy ?? row.user ?? ""
  }));
}
const IDEMPOTENCY_STORAGE_KEY = "UPLOAD_DOCUMENT_IDEMPOTENCY_KEY";
function randomIdempotencyKey() {
  return `drs-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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
const UploadDocument = () => {
  const intl = useIntl();
  const toast = ar();
  const navigate = useNavigate();
  const { selectedRow } = useSelector((s) => s.account);
  const location = useLocation();
  const screenMenuId = location.state.menuId;
  const [documentType, setDocumentType] = reactExports.useState("");
  const [referenceNo, setReferenceNo] = reactExports.useState("");
  const [remarks, setRemarks] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [rows, setRows] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [loadError, setLoadError] = reactExports.useState("");
  const [downloading, setDownloading] = reactExports.useState(false);
  const [typeErr, setTypeErr] = reactExports.useState(false);
  const [refErr, setRefErr] = reactExports.useState(false);
  const [fileErr, setFileErr] = reactExports.useState(false);
  const realm = sessionStorage.getItem("SEC_REALM") || "DEFAULT";
  const documentTypeOptions = reactExports.useMemo(
    () => buildDefaultDocumentTypeOptions(intl),
    [intl]
  );
  const hasAccount = Boolean(selectedRow == null ? void 0 : selectedRow.ACNT_SEQNO);
  const loadHistory = reactExports.useCallback(async () => {
    var _a, _b;
    if (!hasAccount) {
      setRows([]);
      setLoadError(intl.formatMessage({ id: "error.uploadDocument.noAccount" }));
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const res = await Kr.GET(
        UploadDocumentAPI.UploadDocApi(screenMenuId)
      );
      const payload = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson) ?? ((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.data) ?? (res == null ? void 0 : res.data) ?? {};
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
  reactExports.useEffect(() => {
    loadHistory();
  }, [loadHistory]);
  const resetForm = reactExports.useCallback(() => {
    setDocumentType("");
    setReferenceNo("");
    setRemarks("");
    setFile(null);
    setTypeErr(false);
    setRefErr(false);
    setFileErr(false);
  }, []);
  const validate = reactExports.useCallback(() => {
    let ok = true;
    if (!documentType) {
      setTypeErr(true);
      ok = false;
    } else setTypeErr(false);
    if (!String(referenceNo).trim()) {
      setRefErr(true);
      ok = false;
    } else setRefErr(false);
    if (!file) {
      setFileErr(true);
      ok = false;
    } else setFileErr(false);
    return ok;
  }, [documentType, referenceNo, file]);
  const submitUpload = reactExports.useCallback(async () => {
    var _a, _b, _c, _d, _e, _f;
    if (!hasAccount) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.noAccount" }));
      return;
    }
    if (!validate()) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.missingFields" }));
      return;
    }
    const idempotencyKey = getOrCreateIdempotencyKey();
    const requestDto = {
      documentUploadFormRequestDto: {
        documentType,
        referenceNo: referenceNo.trim(),
        remarks: remarks ?? ""
      }
    };
    const fd = new FormData();
    fd.append(
      "request",
      new Blob([JSON.stringify(requestDto)], { type: "application/json" })
    );
    fd.append("file", file);
    try {
      const res = await Kr.POST(
        `${UploadDocumentAPI.UploadDocApi(screenMenuId)}/uploadDocument`,
        fd,
        {},
        false,
        {
          "Content-Type": "multipart/form-data",
          "Idempotency-Key": idempotencyKey
        }
      );
      const statusOk = (res == null ? void 0 : res.status) === 200 && ((res == null ? void 0 : res.data) == null || ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.success) === true || String(((_b = res == null ? void 0 : res.data) == null ? void 0 : _b.status) ?? "").toLowerCase() === "success");
      if (statusOk) {
        clearIdempotencyKey();
        toast.success(
          ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.message) ?? intl.formatMessage(
            { id: "message.uploadDocument.uploadSuccess" },
            { name: file.name }
          )
        );
        resetForm();
        await loadHistory();
      } else {
        toast.error(
          ((_d = res == null ? void 0 : res.data) == null ? void 0 : _d.message) ?? intl.formatMessage({ id: "error.uploadDocument.upload" })
        );
      }
    } catch (e) {
      console.error("uploadDocument", e);
      clearIdempotencyKey();
      toast.error(
        ((_f = (_e = e == null ? void 0 : e.response) == null ? void 0 : _e.data) == null ? void 0 : _f.message) ?? intl.formatMessage({ id: "error.uploadDocument.upload" })
      );
    }
  }, [
    hasAccount,
    documentType,
    file,
    intl,
    loadHistory,
    referenceNo,
    remarks,
    resetForm,
    toast,
    validate
  ]);
  const handleDownload = reactExports.useCallback(async (row) => {
    var _a, _b, _c;
    if (!(row == null ? void 0 : row.documentId)) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.noDocumentId" }));
      return;
    }
    if (!hasAccount) {
      toast.error(intl.formatMessage({ id: "error.uploadDocument.noAccount" }));
      return;
    }
    setDownloading(true);
    try {
      const res = await Kr.GET(
        UploadDocumentAPI.downloadDocument(
          screenMenuId,
          row.documentId,
          row.versionId ?? ""
        ),
        {},
        false,
        { "Content-Type": "application/json" }
      );
      const downloadUrl = ((_b = (_a = res == null ? void 0 : res.data) == null ? void 0 : _a.responseJson) == null ? void 0 : _b.downloadUrl) ?? ((_c = res == null ? void 0 : res.data) == null ? void 0 : _c.downloadUrl) ?? null;
      if (!downloadUrl) {
        toast.error(intl.formatMessage({ id: "error.uploadDocument.noDownloadUrl" }));
        return;
      }
      const dmsBase = (void 0).replace(/\/$/, "");
      const fullUrl = downloadUrl.startsWith("http") ? downloadUrl : `${dmsBase}${downloadUrl}`;
      const token = sessionStorage.getItem("SEC_TOKEN");
      const fileResp = await fetch(fullUrl, {
        method: "GET",
        headers: { "X-Tenant-Id": realm, "Authorization": `Bearer ${token}` }
      });
      if (!fileResp.ok) {
        throw new Error(`DMS stream failed: ${fileResp.status}`);
      }
      const blob = await fileResp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = row.fileName || "document";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);
      toast.success(
        intl.formatMessage(
          { id: "message.uploadDocument.downloadSuccess" },
          { name: row.fileName || "document" }
        )
      );
    } catch (error) {
      console.error("handleDownload", error);
      toast.error(intl.formatMessage({ id: "error.uploadDocument.downloadFailed" }));
    } finally {
      setDownloading(false);
    }
  }, [hasAccount, realm, intl, toast]);
  const columnDefs = reactExports.useMemo(
    () => createUploadDocumentColumnDefs(intl, { onDownload: handleDownload, downloading }),
    [intl, handleDownload, downloading]
  );
  const gridStyle = { width: "100%", height: "200px" };
  const fileSizeHint = file != null ? intl.formatMessage(
    { id: "label.uploadDocument.fileSizeKb" },
    { kb: Math.max(1, Math.round(file.size / 1024)) }
  ) : null;
  const handleFileChange = (next, errInfo) => {
    if (errInfo == null ? void 0 : errInfo.message) toast.error(errInfo.message);
    setFile(next ?? null);
    setFileErr(false);
  };
  const sectionHeaderSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 2,
    py: 1,
    borderBottom: 1,
    borderColor: "divider"
  };
  const fieldCellSx = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
    gap: 0.5
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FunctionLayout,
    {
      title: intl.formatMessage({ id: "label.uploadDocument.title" }),
      breadcrumbMid: intl.formatMessage({
        id: "label.functionLayout.breadcrumb.collection",
        defaultMessage: "Collection"
      }),
      contentPaddingTop: 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Dt,
        {
          sx: {
            px: { xs: 2, sm: 3, md: 4 },
            pb: { xs: 2, sm: 3 },
            pt: 1,
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 2
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Kg,
              {
                variant: "outlined",
                elevation: 0,
                sx: { borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: sectionHeaderSx, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUploadIcon, { color: "primary", sx: { fontSize: 18 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", color: "text.primary", children: intl.formatMessage({ id: "label.uploadDocument.section.upload" }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { p: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { container: true, spacing: 2, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Grid, { size: { xs: 12, md: 4 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { display: "flex", flexDirection: "column", gap: 1.5 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.uploadDocument.documentType", required: true, align: "left", colon: false }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          SE,
                          {
                            id: "uploadDocumentType",
                            name: "documentType",
                            options: documentTypeOptions,
                            value: documentType,
                            onChange: (e) => {
                              setDocumentType(e.target.value);
                              setTypeErr(false);
                            },
                            placeholder: intl.formatMessage({ id: "label.uploadDocument.documentType.placeholder" }),
                            width: "100%",
                            error: typeErr
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.uploadDocument.referenceNo", required: true, align: "left", colon: false }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ap,
                          {
                            id: "uploadDocumentReference",
                            name: "referenceNo",
                            value: referenceNo,
                            onChange: (e) => {
                              setReferenceNo(e.target.value);
                              setRefErr(false);
                            },
                            placeholder: intl.formatMessage({ id: "label.uploadDocument.referenceNo.placeholder" }),
                            width: "100%",
                            error: refErr,
                            editable: true,
                            autoComplete: "off"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: fieldCellSx, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ps, { value: "label.uploadDocument.remarks", align: "left", colon: false }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          pp,
                          {
                            id: "uploadDocumentRemarks",
                            value: remarks,
                            onChange: (e) => setRemarks(e.target.value),
                            placeholder: intl.formatMessage({ id: "label.uploadDocument.remarks.placeholder" }),
                            width: "100%",
                            multiline: true,
                            rows: 2
                          }
                        )
                      ] })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Grid, { size: { xs: 12, md: 8 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        dp,
                        {
                          inputId: "upload-document-file-input",
                          accept: UPLOAD_ACCEPT,
                          file,
                          onFileChange: handleFileChange,
                          onClear: () => setFile(null),
                          disabled: !hasAccount,
                          maxSizeBytes: UPLOAD_MAX_BYTES,
                          dropHint: intl.formatMessage({ id: "label.uploadDocument.dropHint" }),
                          supportedHint: intl.formatMessage({ id: "label.uploadDocument.supportedHint" }),
                          fileSizeHint,
                          removeLabel: "label.uploadDocument.remove",
                          invalidTypeMessage: intl.formatMessage({ id: "error.uploadDocument.invalidType" }),
                          maxSizeMessage: intl.formatMessage({ id: "error.uploadDocument.maxSize" })
                        }
                      ),
                      fileErr && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", sx: { mt: 0.5, display: "block" }, children: intl.formatMessage({ id: "error.uploadDocument.fileRequired" }) })
                    ] })
                  ] }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Kg,
              {
                variant: "outlined",
                elevation: 0,
                sx: { borderRadius: 2, overflow: "hidden", bgcolor: "background.paper", display: "flex", flexDirection: "column" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { ...sectionHeaderSx, flexWrap: "wrap" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionIcon, { color: "primary", sx: { fontSize: 18 } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "subtitle2", color: "text.primary", children: intl.formatMessage({ id: "label.uploadDocument.section.history" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Chip,
                      {
                        size: "small",
                        variant: "outlined",
                        label: intl.formatMessage(
                          { id: "label.uploadDocument.historyCount" },
                          { count: rows.length }
                        ),
                        sx: { ml: "auto" }
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Dt, { sx: { p: 2, pt: 1 }, children: [
                    loadError && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx(Typography, { variant: "caption", color: "error", sx: { display: "block", mb: 2 }, children: loadError }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      bu,
                      {
                        rowData: rows,
                        columnDefs,
                        gridStyle,
                        embeddedInSection: false,
                        pagination: true,
                        paginationPageSize: 4,
                        sort: true,
                        showTitle: false,
                        hideInternalSaveButton: true,
                        allowAdd: false,
                        allowDelete: false,
                        allowUpdate: false,
                        isLoading: loading
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Dt, { sx: { position: "relative", zIndex: 2e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Vg,
              {
                onSave: () => void submitUpload(),
                onReset: () => {
                  resetForm();
                  void loadHistory();
                },
                onClose: () => navigate("/homelayout/welcomepage")
              }
            ) })
          ]
        }
      )
    }
  );
};
export {
  UploadDocument as default
};
