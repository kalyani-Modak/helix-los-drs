import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PostAddIcon from "@mui/icons-material/PostAdd";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GetAppIcon from "@mui/icons-material/GetApp";
import HistoryIcon from "@mui/icons-material/History";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useIntl } from "react-intl";
import { HBox, HButton, HLabel, HPaper, HTextField, HTextarea, HTabs, HTab, HDropdown, HToggle, HAgGrid, HAxiosService, useToast, HBreadCrumb, TitleBar } from "@helix/component-library";
import { dmsAPI } from "./apiEndpoints";
import { getDmsApiPath } from "@shared/config/apiConstants";
import {
  DmsCollapsibleSection,
  DmsEmptyState,
  DmsFileDropZone,
  DmsFormSection,
  DmsJsonBody,
  DmsNotice,
  DmsPanel,
  DmsProcessingStatusChip,
  DmsSubSectionHeading,
  DmsTabColumn,
  DmsTabPanel,
  DmsViewerFrame,
  DmsGridFrame,
} from "./dmsDocumentsManagerUi";

const COPY_FLASH_MS = 1000;
const COPY_FLASH_UPLOAD_LAST = "upload-last-doc";
const COPY_FLASH_NEW_VERSION = "new-version-doc";
const COPY_FLASH_SEARCH_LAST_RESPONSE = "search-last-response";
const COPY_FLASH_VERSIONS_JSON = "versions-json";

function formatBytes(n) {
  if (n == null || Number.isNaN(n)) return "—";
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)} MB`;
  return `${(mb / 1024).toFixed(1)} GB`;
}

function searchableHaystackForSearchItem(item) {
  const blobs = [
    item.fileName,
    item.documentId,
    item.versionId,
    item.contentType,
    item.providerId,
    item.processingStatus,
    item.uploadedAt,
    item.product,
    item.primaryEntity,
    item.entityId,
    item.sizeBytes != null ? String(item.sizeBytes) : "",
    formatBytes(item.sizeBytes),
  ];
  return blobs
    .map((v) => (v ?? "").toString().toLowerCase())
    .join(" ");
}

function displayOrDash(v) {
  const s = (v ?? "").trim();
  return s || "—";
}

function parseFilenameFromContentDisposition(header, fallback) {
  if (!header) return fallback;
  const utf8 = /filename\*=(?:UTF-8''|utf-8'')([^;\n]+)/i.exec(header);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      /* fall through */
    }
  }
  const ascii = /filename\s*=\s*("?)([^";\n]+)\1/i.exec(header);
  if (ascii?.[2]) return ascii[2].trim();
  return fallback;
}

/** Align with dms-app: helix-dms often serves viewer artifacts as `application/octet-stream`. */
function isImageFileName(name) {
  const n = (name || "").toLowerCase();
  return (
    n.endsWith(".png") ||
    n.endsWith(".jpg") ||
    n.endsWith(".jpeg") ||
    n.endsWith(".gif") ||
    n.endsWith(".webp") ||
    n.endsWith(".bmp") ||
    n.endsWith(".svg")
  );
}

function inferMimeType(contentType, fileName) {
  const ct = (contentType || "").toLowerCase();
  if (ct && ct !== "application/octet-stream") {
    return ct;
  }
  const lowerName = (fileName || "").toLowerCase();
  if (lowerName.endsWith(".pdf")) return "application/pdf";
  if (lowerName.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lowerName.endsWith(".doc")) return "application/msword";
  if (lowerName.endsWith(".png")) return "image/png";
  if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) return "image/jpeg";
  if (lowerName.endsWith(".gif")) return "image/gif";
  if (lowerName.endsWith(".webp")) return "image/webp";
  if (lowerName.endsWith(".bmp")) return "image/bmp";
  if (lowerName.endsWith(".svg")) return "image/svg+xml";
  return ct || "application/octet-stream";
}

async function detectMimeFromBytes(blob) {
  const bytes = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
  if (bytes.length >= 5) {
    const pdfSig = [0x25, 0x50, 0x44, 0x46, 0x2d];
    if (pdfSig.every((v, i) => bytes[i] === v)) return "application/pdf";
  }
  if (bytes.length >= 8) {
    const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    if (pngSig.every((v, i) => bytes[i] === v)) return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return "image/gif";
  }
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    // RIFF....WEBP
    if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
      return "image/webp";
    }
  }
  return "";
}

/** When Content-Disposition is missing or ends with `.bin`, infer extension from MIME (retrieve + viewer artifact names). */
function mimeToDownloadExtension(mime) {
  const m = (mime || "").toLowerCase();
  if (m.includes("pdf")) return ".pdf";
  if (m === "image/png") return ".png";
  if (m === "image/jpeg" || m === "image/jpg") return ".jpg";
  if (m === "image/gif") return ".gif";
  if (m === "image/webp") return ".webp";
  if (m === "image/bmp") return ".bmp";
  if (m === "image/svg+xml") return ".svg";
  if (m.includes("wordprocessingml.document")) return ".docx";
  if (m === "application/msword") return ".doc";
  return "";
}

function resolveDownloadFileNameWithMime(
  dispositionName,
  idForFallbackBase,
  hintFileName,
  effectiveMime
) {
  const hint = (hintFileName || "").trim();
  const disp = (dispositionName || "").trim();
  if (hint && !hint.toLowerCase().endsWith(".bin")) {
    return hint;
  }
  if (disp && !disp.toLowerCase().endsWith(".bin")) {
    return disp;
  }
  const ext = mimeToDownloadExtension(effectiveMime);
  if (ext) {
    const base = (disp || hint).replace(/\.[^/.]+$/, "") || idForFallbackBase;
    return `${base}${ext}`;
  }
  return disp || hint || `${idForFallbackBase}.bin`;
}

function sha256Pure(buffer) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  let h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const bytes = new Uint8Array(buffer);
  const bitLen = bytes.length * 8;
  const padded = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(padded.length - 8, Math.floor(bitLen / 2 ** 32), false);
  dv.setUint32(padded.length - 4, bitLen >>> 0, false);
  const rotr = (n, x) => (x >>> n) | (x << (32 - n));
  for (let i = 0; i < padded.length; i += 64) {
    const w = new Array(64);
    for (let j = 0; j < 16; j++) w[j] = dv.getUint32(i + j * 4, false);
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(7, w[j - 15]) ^ rotr(18, w[j - 15]) ^ (w[j - 15] >>> 3);
      const s1 = rotr(17, w[j - 2]) ^ rotr(19, w[j - 2]) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let j = 0; j < 64; j++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (hh + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  return h.map((v) => v.toString(16).padStart(8, "0")).join("");
}

async function sha256Hex(file) {
  const buf = await file.arrayBuffer();
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return sha256Pure(buf);
}

function randomIdempotencyKey() {
  return `drs-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toAbsoluteDmsUrl(path) {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = getDmsApiPath().replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function extractDmsApiErrorParts(data) {
  if (!data || typeof data !== "object" || data instanceof Blob) {
    return {};
  }
  const o = data;
  const errorCode =
    typeof o.errorCode === "string" && o.errorCode.trim() ? o.errorCode.trim() : undefined;
  const rawMsg = o.message ?? o.detail ?? o.title ?? o.error ?? o.msg;
  const message = typeof rawMsg === "string" && rawMsg.trim() ? rawMsg.trim() : undefined;
  return { errorCode, message };
}

function formatDmsErrorToast(data, status) {
  const { errorCode, message } = extractDmsApiErrorParts(data);
  if (errorCode && message) return `${errorCode} — ${message}`;
  if (errorCode) return errorCode;
  if (message) return message;
  if (typeof data === "string" && data.trim()) return data.trim();
  return `Request failed (${status})`;
}

function buildDetailText(details) {
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return null;
  }
  const detailText = Object.entries(details)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([k, v]) => `${k}=${String(v)}`)
    .join(", ");
  return detailText || null;
}

function buildErrorParts(data) {
    const parts = [];
    const { errorCode, message } = extractDmsApiErrorParts(data);
    if (errorCode) parts.push(errorCode);
    if (message) parts.push(message);

  const correlationId = data.correlationId;
    if (typeof correlationId === "string" && correlationId.trim()) {
      parts.push(`correlationId=${correlationId.trim()}`);
    }

  const detailText = buildDetailText(data.details);
      if (detailText) parts.push(detailText);

  return parts;
    }

function formatDmsErrorMessage(data, status) {
  if (data && typeof data === "object" && data instanceof Blob) {
    return `Request failed (${status})`;
  }
  if (data && typeof data === "object") {
    const parts = buildErrorParts(data);
    if (parts.length > 0) return parts.join(" — ");
    try {
      return JSON.stringify(data);
    } catch {
      return `Request failed (${status})`;
    }
  }
  if (typeof data === "string" && data.trim()) return data.trim();
  return `Request failed (${status})`;
}

class DmsRequestError extends Error {
  constructor(panelMessage, toastMessage) {
    super(panelMessage);
    this.name = "DmsRequestError";
    this.toastMessage = toastMessage;
  }
}

function raiseDmsApiError(data, status, fallback) {
  throw new DmsRequestError(formatDmsErrorMessage(data, status), formatDmsErrorToast(data, status));
}

function raiseDmsPlainError(panelMessage, toastMessage) {
  throw new DmsRequestError(panelMessage, toastMessage ?? panelMessage);
}

function toDmsSearchQuery(criteria = {}) {
  const p = new URLSearchParams();
  const appendList = (key, value) => {
    if (value == null) return;
    const items = Array.isArray(value) ? value : [value];
    items.forEach((item) => {
      if (item != null && String(item).trim() !== "") p.append(key, String(item));
    });
  };
  const q = criteria.query ?? criteria.q;
  if (q != null && String(q).trim() !== "") p.set("q", String(q));
  appendList("contentTypes", criteria.contentTypes);
  appendList("providerIds", criteria.providerIds);
  appendList("processingStatuses", criteria.processingStatuses);
  appendList("products", criteria.products);
  appendList("primaryEntities", criteria.primaryEntities);
  appendList("entityIds", criteria.entityIds);
  if (criteria.sizeMinBytes != null && criteria.sizeMinBytes !== "") p.set("sizeMinBytes", String(criteria.sizeMinBytes));
  if (criteria.sizeMaxBytes != null && criteria.sizeMaxBytes !== "") p.set("sizeMaxBytes", String(criteria.sizeMaxBytes));
  if (criteria.uploadedFrom) p.set("uploadedFrom", String(criteria.uploadedFrom));
  if (criteria.uploadedTo) p.set("uploadedTo", String(criteria.uploadedTo));
  if (criteria.metadata && typeof criteria.metadata === "object" && !Array.isArray(criteria.metadata)) {
    Object.entries(criteria.metadata).forEach(([key, value]) => {
      if (value != null && String(value) !== "") p.append(`metadata[${key}]`, String(value));
  });
}
  if (criteria.page != null && criteria.page !== "") p.set("page", String(criteria.page));
  if (criteria.size != null && criteria.size !== "") p.set("size", String(criteria.size));
  if (criteria.sortBy) p.set("sortBy", String(criteria.sortBy));
  if (criteria.sortDirection) p.set("sortDirection", String(criteria.sortDirection));
  if (criteria.includeFacets != null && criteria.includeFacets !== "") {
    p.set("includeFacets", String(Boolean(criteria.includeFacets)));
  }
  return p;
}

function resolveDmsRequestUrl(url) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return toAbsoluteDmsUrl(url);
}

async function dmsFetchJson(url, init) {
  const abs = resolveDmsRequestUrl(url);
  const method = (init?.method || "GET").toUpperCase();
  let res;
  if (method === "POST") {
    let body = init?.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        /* keep original body */
      }
    }
    res = await HAxiosService.POST(abs, body);
  } else {
    res = await HAxiosService.GET(abs, { responseType: "json" });
  }
  return normalizeDmsHttpResult(res);
}

async function dmsFetchBlob(url) {
  const res = await HAxiosService.GET(resolveDmsRequestUrl(url), { responseType: "blob" });
  return normalizeDmsHttpResult(res);
}

function normalizeDmsHttpResult(res) {
  if (res == null) return res;
  if ("config" in res) {
    const axiosRes = res;
    const headers = {};
    if (axiosRes.headers) {
      Object.entries(axiosRes.headers).forEach(([key, value]) => {
        if (value != null) headers[key.toLowerCase()] = String(value);
      });
    }
    return {
      status: axiosRes.status,
      data: axiosRes.data,
      headers,
    };
  }
  return res;
}

function getDmsCallErrorMessage(error, fallback) {
  if (error instanceof DmsRequestError) return error.message;
  if (error instanceof TypeError) return `Network error: ${error.message || fallback}`;
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    if (error.response?.data !== undefined && error.response?.data !== null) {
      return formatDmsErrorMessage(error.response.data, status);
    }
    if (error.message?.trim()) return error.message;
  }
  if (error instanceof Error && error.message?.trim()) return error.message;
  return fallback;
}

function getDmsCallErrorToastMessage(error, fallback) {
  if (error instanceof DmsRequestError) return error.toastMessage;
  if (error instanceof TypeError) return `Network error: ${error.message || fallback}`;
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    if (error.response?.data !== undefined && error.response?.data !== null) {
      return formatDmsErrorToast(error.response.data, status);
    }
    if (error.message?.trim()) return error.message;
  }
  if (error instanceof Error && error.message?.trim()) return error.message;
  return fallback;
}

function assertDmsJsonResponse(res, fallback, options) {
  const normalized = normalizeDmsHttpResult(res);
  if (normalized == null) raiseDmsPlainError(`${fallback}: no response from server`);
  const requireData = options?.requireData !== false;
  if (normalized.status < 200 || normalized.status >= 300) {
    raiseDmsApiError(normalized.data, normalized.status, fallback);
  }
  if (requireData && (normalized.data === null || normalized.data === undefined)) {
    raiseDmsPlainError(`${fallback}: empty response body`);
  }
  return normalized.data;
}

async function assertDmsBlobResponse(res, fallback) {
  const normalized = normalizeDmsHttpResult(res);
  if (normalized == null) raiseDmsPlainError(`${fallback}: no response from server`);
  if (normalized.status < 200 || normalized.status >= 300) {
    let parsed = normalized.data;
    if (normalized.data instanceof Blob) {
      try {
        const text = (await normalized.data.text()).trim();
        parsed = text ? JSON.parse(text) : normalized.data;
      } catch {
        parsed = normalized.data;
      }
    }
    raiseDmsApiError(parsed, normalized.status, fallback);
  }
  if (!(normalized.data instanceof Blob)) raiseDmsPlainError(`${fallback}: invalid artifact body`);
  if (normalized.data.size === 0) raiseDmsPlainError(`${fallback}: empty artifact body`);
  return normalized.data;
}

function validateRetrievalResponse(data) {
  if (!data.documentId?.trim()) return "missing documentId";
  if (!data.versionId?.trim()) return "missing versionId";
  if (!data.downloadUrl?.trim()) return "missing downloadUrl";
  if (!data.status?.trim()) return "missing status";
  return null;
}

function validateViewerSessionResponse(data) {
  if (!data.viewerSessionId?.trim()) return "missing viewerSessionId";
  if (!data.sessionToken?.trim()) return "missing sessionToken";
  if (!data.manifestUrl?.trim()) return "missing manifestUrl";
  return null;
}

function parseDmsJsonResponse(res, fallback, validate) {
  const data = assertDmsJsonResponse(res, fallback);
  if (validate) {
    const validationError = validate(data);
    if (validationError) {
      raiseDmsPlainError(`${fallback}: ${validationError}`);
    }
  }
  return data;
}

const STORAGE_PROFILE_OPTIONS = [
  { value: "S3_PRIMARY", label: "S3" },
  { value: "LOCAL_FS_PRIMARY", label: "Local filesystem" },
];

const SENSITIVITY_OPTIONS = ["GENERAL", "SENSITIVE", "CRITICAL", "CONFIDENTIAL"];

export default function DmsDocumentsManager() {
  const toast = useToast();
  const intl = useIntl();
  const dmsConfigured = useMemo(() => Boolean(getDmsApiPath()), []);

  const [tab, setTab] = useState(0);
  const [busy, setBusy] = useState(false);

  const [storageProfile, setStorageProfile] = useState("S3_PRIMARY");
  const [sensitivity, setSensitivity] = useState("GENERAL");
  const [product, setProduct] = useState("LOS");
  const [primaryEntity, setPrimaryEntity] = useState("Application");
  const [entityId, setEntityId] = useState("APP-12345");
  const [metadataJson, setMetadataJson] = useState('{"documentClassification":"Identity"}');

  const [uploadFile, setUploadFile] = useState(null);
  const [lastDocumentId, setLastDocumentId] = useState("");

  const [newVersionDocId, setNewVersionDocId] = useState("");
  const [newVersionFile, setNewVersionFile] = useState(null);

  const [searchBody, setSearchBody] = useState(
    JSON.stringify(
      {
        page: 0,
        size: 100,
        sortBy: "uploadedAt",
        sortDirection: "DESC",
      },
      null,
      2
    )
  );
  const [searchItems, setSearchItems] = useState([]);
  const [searchExpandedVersionIds, setSearchExpandedVersionIds] = useState(() => new Set());
  const [searchLastResponse, setSearchLastResponse] = useState("");
  const [searchTableSectionExpanded, setSearchTableSectionExpanded] = useState(true);
  const [searchLastResponseSectionExpanded, setSearchLastResponseSectionExpanded] = useState(true);
  const [searchTableFilter, setSearchTableFilter] = useState("");

  const filteredSearchItems = useMemo(() => {
    const q = searchTableFilter.trim().toLowerCase();
    if (!q) return searchItems;
    return searchItems.filter((item) => searchableHaystackForSearchItem(item).includes(q));
  }, [searchItems, searchTableFilter]);

  const [retrieveDocId, setRetrieveDocId] = useState("");
  const [retrieveVersion, setRetrieveVersion] = useState("latest");
  const [retrieveLastResponse, setRetrieveLastResponse] = useState("");

  const [viewerDocId, setViewerDocId] = useState("");
  const [viewerVersion, setViewerVersion] = useState("latest");
  const [viewerSession, setViewerSession] = useState(null);
  const [viewerManifest, setViewerManifest] = useState(null);
  const [viewerContextDocId, setViewerContextDocId] = useState("");
  const [viewerContextVersion, setViewerContextVersion] = useState("");
  const [viewerLoading, setViewerLoading] = useState(false);
  const [viewerObjectUrl, setViewerObjectUrl] = useState(null);
  const [viewerMime, setViewerMime] = useState("");
  const [viewerFileName, setViewerFileName] = useState("document.bin");
  const [viewerNamedAssetId, setViewerNamedAssetId] = useState("");
  const [viewerLastResponse, setViewerLastResponse] = useState("");

  const [lifecycleDocId, setLifecycleDocId] = useState("");
  const [versionsData, setVersionsData] = useState(null);
  const [versionsJson, setVersionsJson] = useState("");
  const [versionSearch, setVersionSearch] = useState("");
  const [versionsTableExpanded, setVersionsTableExpanded] = useState(true);
  const [versionsJsonExpanded, setVersionsJsonExpanded] = useState(true);
  const [retentionUntilInput, setRetentionUntilInput] = useState("");
  const [legalHoldInput, setLegalHoldInput] = useState(false);
  const [deleteVersionId, setDeleteVersionId] = useState("");
  const [deleteHard, setDeleteHard] = useState(false);
  const [auditResultJson, setAuditResultJson] = useState("");

  const filteredVersionsData = useMemo(() => {
    if (!versionsData?.versions) return [];
    const q = versionSearch.trim().toLowerCase();
    if (!q) return versionsData.versions;
    return versionsData.versions.filter((v) => {
      const matchNo = String(v.versionNo).includes(q);
      const matchId = (v.versionId ?? "").toLowerCase().includes(q);
      const matchStatus = (v.processingStatus ?? "").toLowerCase().includes(q);
      const matchVal = (v.validationStatus ?? "").toLowerCase().includes(q);
      const matchSize = formatBytes(v.sizeBytes).toLowerCase().includes(q);
      return matchNo || matchId || matchStatus || matchVal || matchSize;
    });
  }, [versionsData, versionSearch]);

  const [copyFlashKey, setCopyFlashKey] = useState(null);
  const copyFlashTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (viewerObjectUrl) URL.revokeObjectURL(viewerObjectUrl);
    };
  }, [viewerObjectUrl]);

  useEffect(() => {
    return () => {
      if (copyFlashTimeoutRef.current) clearTimeout(copyFlashTimeoutRef.current);
    };
  }, []);

  const copyDocumentId = useCallback(
    async (id, flashKey) => {
      if (copyFlashTimeoutRef.current) {
        clearTimeout(copyFlashTimeoutRef.current);
        copyFlashTimeoutRef.current = null;
      }
      try {
        await navigator.clipboard.writeText(id);
        toast.success("Document ID copied");
        setCopyFlashKey(flashKey);
        copyFlashTimeoutRef.current = setTimeout(() => {
          setCopyFlashKey(null);
          copyFlashTimeoutRef.current = null;
        }, COPY_FLASH_MS);
      } catch {
        toast.error("Could not copy to clipboard");
      }
    },
    [toast]
  );

  const copySearchLastResponse = useCallback(async () => {
    const text = searchLastResponse.trim();
    if (!text) {
      toast.warning("Nothing to copy yet. Run a search first.");
      return;
    }
    if (copyFlashTimeoutRef.current) {
      clearTimeout(copyFlashTimeoutRef.current);
      copyFlashTimeoutRef.current = null;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Last response copied to clipboard");
      setCopyFlashKey(COPY_FLASH_SEARCH_LAST_RESPONSE);
      copyFlashTimeoutRef.current = setTimeout(() => {
        setCopyFlashKey(null);
        copyFlashTimeoutRef.current = null;
      }, COPY_FLASH_MS);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }, [searchLastResponse, toast]);

  const copyVersionsJson = useCallback(async () => {
    const text = versionsJson.trim();
    if (!text) {
      toast.warning("Nothing to copy yet. Load versions first.");
      return;
    }
    if (copyFlashTimeoutRef.current) {
      clearTimeout(copyFlashTimeoutRef.current);
      copyFlashTimeoutRef.current = null;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Versions JSON copied to clipboard");
      setCopyFlashKey(COPY_FLASH_VERSIONS_JSON);
      copyFlashTimeoutRef.current = setTimeout(() => {
        setCopyFlashKey(null);
        copyFlashTimeoutRef.current = null;
      }, COPY_FLASH_MS);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }, [versionsJson, toast]);

  const initiateUploadSession = useCallback(async (body) => {
    const headers = { "Idempotency-Key": randomIdempotencyKey() };
    const res = await HAxiosService.POST(dmsAPI.documentsInitiate(), body, {}, false, headers);
    return assertDmsJsonResponse(res, "Initiate upload failed");
  }, []);

  const handleUpload = async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH (helix-dms origin).");
      return;
    }
    if (!uploadFile) {
      toast.warning("Choose a file to upload.");
      return;
    }
    let metadata = {};
    try {
      metadata = metadataJson.trim() ? JSON.parse(metadataJson) : {};
    } catch {
      toast.error("Metadata must be valid JSON object.");
      return;
    }
    setBusy(true);
    try {
      const checksum = await sha256Hex(uploadFile);
      const initiateBody = {
        fileName: uploadFile.name,
        contentType: uploadFile.type || "application/octet-stream",
        sizeBytes: uploadFile.size,
        checksumSha256: checksum,
        storageProfile,
        sensitivity,
        product,
        primaryEntity,
        entityId,
        metadata,
      };
      const initiateResp = await initiateUploadSession(initiateBody);
      const formData = new FormData();
      formData.append("file", uploadFile);
      const uploadUrl = toAbsoluteDmsUrl(initiateResp.uploadUrl);
      const up = await HAxiosService.POST(uploadUrl, formData);
      assertDmsJsonResponse(up, "File upload failed", { requireData: false });
      setLastDocumentId(initiateResp.documentId);
      setNewVersionDocId(initiateResp.documentId);
      setLifecycleDocId(initiateResp.documentId);
      setRetrieveDocId(initiateResp.documentId);
      setViewerDocId(initiateResp.documentId);
      toast.success(`Uploaded document ${initiateResp.documentId}`);
    } catch (e) {
      toast.error(getDmsCallErrorToastMessage(e, "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  const handleNewVersion = async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    if (!newVersionFile || !newVersionDocId.trim()) {
      toast.warning("Document ID and file are required.");
      return;
    }
    setBusy(true);
    try {
      const checksum = await sha256Hex(newVersionFile);
      const initiateBody = {
        fileName: newVersionFile.name,
        contentType: newVersionFile.type || "application/octet-stream",
        sizeBytes: newVersionFile.size,
        checksumSha256: checksum,
      };
      const res = await HAxiosService.POST(
        dmsAPI.versionsInitiate(newVersionDocId.trim()),
        initiateBody,
        {},
        false,
        { "Idempotency-Key": randomIdempotencyKey() }
      );
      const initiateResp = assertDmsJsonResponse(res, "Initiate new version failed");
      const formData = new FormData();
      formData.append("file", newVersionFile);
      const uploadUrl = toAbsoluteDmsUrl(initiateResp.uploadUrl);
      const up = await HAxiosService.POST(uploadUrl, formData);
      assertDmsJsonResponse(up, "File upload failed", { requireData: false });
      setLastDocumentId(initiateResp.documentId);
      setRetrieveDocId(initiateResp.documentId);
      setLifecycleDocId(initiateResp.documentId);
      setViewerDocId(initiateResp.documentId);
      toast.success(`New version for ${initiateResp.documentId}`);
    } catch (e) {
      toast.error(getDmsCallErrorToastMessage(e, "New version failed"));
    } finally {
      setBusy(false);
    }
  };

  const runSearch = async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    setBusy(true);
    try {
      let body;
      try {
        body = JSON.parse(searchBody);
      } catch {
        const msg = "Search body must be valid JSON.";
        toast.error(msg);
        setSearchLastResponse(`Search failed: ${msg}`);
        return;
      }
      const qs = toDmsSearchQuery(body).toString();
      const searchUrl = qs ? `${dmsAPI.documentsSearch()}?${qs}` : dmsAPI.documentsSearch();
      const res = await HAxiosService.GET(searchUrl, { responseType: "json" });
      const data = assertDmsJsonResponse(res, "Search failed");
      setSearchItems(data.items || []);
      setSearchExpandedVersionIds(new Set());
      setSearchLastResponse(JSON.stringify(data, null, 2));
      toast.success(`Found ${data.totalElements ?? 0} hit(s)`);
    } catch (e) {
      const msg = getDmsCallErrorMessage(e, "Search failed");
      toast.error(getDmsCallErrorToastMessage(e, "Search failed"));
      setSearchLastResponse(`Search failed: ${msg}`);
    } finally {
      setBusy(false);
    }
  };

  const loadVersionsForDoc = useCallback(async (docId) => {
    const res = await HAxiosService.GET(dmsAPI.documentVersions(docId.trim()), {
      responseType: "json",
    });
    return assertDmsJsonResponse(res, "List versions failed");
  }, []);

  const fetchDocumentVersions = useCallback(async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    const id = lifecycleDocId.trim();
    if (!id) {
      toast.warning("Document ID is required.");
      return;
    }
    setBusy(true);
    try {
      const data = await loadVersionsForDoc(id);
      setVersionsData(data);
      setVersionsJson(JSON.stringify(data, null, 2));
      setRetentionUntilInput(data.retentionUntil ?? "");
      setLegalHoldInput(Boolean(data.legalHold));
      toast.success(`Loaded ${data.versions?.length ?? 0} version(s)`);
    } catch (e) {
      const msg = getDmsCallErrorMessage(e, "List versions failed");
      toast.error(getDmsCallErrorToastMessage(e, "List versions failed"));
      setVersionsData(null);
      setVersionsJson(`List versions failed: ${msg}`);
    } finally {
      setBusy(false);
    }
  }, [dmsConfigured, lifecycleDocId, loadVersionsForDoc, toast]);

  const saveRetentionControls = useCallback(async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    const id = lifecycleDocId.trim();
    if (!id) {
      toast.warning("Document ID is required.");
      return;
    }
    setBusy(true);
    try {
      const rt = retentionUntilInput.trim();
      const body = {
        legalHold: legalHoldInput,
        retentionUntil: rt === "" ? null : rt,
      };
      const res = await HAxiosService.PUT(dmsAPI.retentionControls(id), body);
      const data = assertDmsJsonResponse(res, "Retention update failed");
      setRetentionUntilInput(data.retentionUntil ?? "");
      setLegalHoldInput(Boolean(data.legalHold));
      toast.success("Retention updated");
    } catch (e) {
      toast.error(getDmsCallErrorToastMessage(e, "Retention update failed"));
    } finally {
      setBusy(false);
    }
  }, [dmsConfigured, lifecycleDocId, legalHoldInput, retentionUntilInput, toast]);

  const removeDocumentVersion = useCallback(async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    const docId = lifecycleDocId.trim();
    const verId = deleteVersionId.trim();
    if (!docId || !verId) {
      toast.warning("Document ID and version ID are required.");
      return;
    }
    const msg = deleteHard
      ? "Hard-delete this version? This removes the row and cannot be undone."
      : "Soft-delete this version (sets deletedAt)?";
    if (!window.confirm(msg)) {
      return;
    }
    setBusy(true);
    try {
      const res = await HAxiosService.DELETE(dmsAPI.documentVersionDelete(docId, verId, deleteHard));
      if (res == null) {
        raiseDmsPlainError("Delete version failed: no response from server");
      }
      toast.success("Version deleted");
      setDeleteVersionId("");
      const data = await loadVersionsForDoc(docId);
      setVersionsData(data);
      setVersionsJson(JSON.stringify(data, null, 2));
      setRetentionUntilInput(data.retentionUntil ?? "");
      setLegalHoldInput(Boolean(data.legalHold));
    } catch (e) {
      toast.error(getDmsCallErrorToastMessage(e, "Delete version failed"));
    } finally {
      setBusy(false);
    }
  }, [dmsConfigured, lifecycleDocId, deleteVersionId, deleteHard, loadVersionsForDoc, toast]);

  const runAuditVerify = useCallback(async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    setBusy(true);
    try {
      const res = await HAxiosService.GET(dmsAPI.auditVerify(), { responseType: "json" });
      const data = assertDmsJsonResponse(res, "Audit verify failed");
      setAuditResultJson(JSON.stringify(data, null, 2));
      toast.success(data.valid ? "Audit chain valid" : "Audit chain invalid");
    } catch (e) {
      const msg = getDmsCallErrorMessage(e, "Audit verify failed");
      toast.error(getDmsCallErrorToastMessage(e, "Audit verify failed"));
      setAuditResultJson(`Audit verify failed: ${msg}`);
    } finally {
      setBusy(false);
    }
  }, [dmsConfigured, toast]);

  const downloadViewerNamedAsset = useCallback(async () => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    if (!viewerSession) {
      toast.warning("Open a viewer session first.");
      return;
    }
    const assetId = viewerNamedAssetId.trim();
    if (!assetId) {
      toast.warning("Enter a named asset id (from manifest / asset URL template).");
      return;
    }
    setBusy(true);
    try {
      const url = toAbsoluteDmsUrl(
        dmsAPI.viewerArtifactAsset(viewerSession.viewerSessionId, assetId, viewerSession.sessionToken)
      );
      const blobRes = await dmsFetchBlob(url);
      const rawBlob = await assertDmsBlobResponse(blobRes, "Named asset download failed");
      const cd = blobRes.headers["content-disposition"];
      const headerCt = blobRes.headers["content-type"] || "application/octet-stream";
      const dispositionName = parseFilenameFromContentDisposition(cd, `${assetId}.bin`);
      const effectiveMime = (await detectMimeFromBytes(rawBlob)) || inferMimeType(headerCt, dispositionName);
      const downloadName = resolveDownloadFileNameWithMime(dispositionName, assetId, undefined, effectiveMime);
      const objectUrl = window.URL.createObjectURL(new Blob([rawBlob], { type: effectiveMime }));
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = downloadName;
      a.click();
      window.URL.revokeObjectURL(objectUrl);
      toast.success("Named asset download started");
    } catch (e) {
      toast.error(getDmsCallErrorToastMessage(e, "Named asset failed"));
    } finally {
      setBusy(false);
    }
  }, [dmsConfigured, viewerSession, viewerNamedAssetId, toast]);

  const handleRetrieveDownload = async (documentId, hintFileName, version = "latest") => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    const id = documentId.trim();
    if (!id) {
      toast.warning("Document ID is required.");
      return;
    }
    const ver = version.trim() || "latest";
    setBusy(true);
    setRetrieveLastResponse("");
    try {
      const res = await dmsFetchJson(dmsAPI.documentRetrieve(id, ver));
      const retrieval = parseDmsJsonResponse(res, "Retrieve failed", validateRetrievalResponse);
      const apiHint = typeof retrieval.fileName === "string" ? retrieval.fileName : undefined;
      const hint = hintFileName?.trim() || apiHint;
      const downloadUrl = toAbsoluteDmsUrl(retrieval.downloadUrl);
      const blobRes = await dmsFetchBlob(downloadUrl);
      const rawBlob = await assertDmsBlobResponse(blobRes, "Artifact download failed");
      const cd = blobRes.headers["content-disposition"];
      const headerCt = blobRes.headers["content-type"] || "application/octet-stream";
      const dispositionName = parseFilenameFromContentDisposition(cd, hint || `${id}.bin`);
      const guessedByHeaders = inferMimeType(headerCt, hint || dispositionName);
      const guessedByBytes = await detectMimeFromBytes(rawBlob);
      const effectiveMime = guessedByBytes || guessedByHeaders;
      const downloadName = resolveDownloadFileNameWithMime(dispositionName, id, hint, effectiveMime);
      const url = window.URL.createObjectURL(rawBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadName;
      a.click();
      window.URL.revokeObjectURL(url);
      setRetrieveLastResponse(
        JSON.stringify(
          {
            retrieve: {
              documentId: retrieval.documentId,
              versionId: retrieval.versionId,
              status: retrieval.status,
              downloadUrl: retrieval.downloadUrl,
              expiresAt: retrieval.expiresAt,
              fileName: retrieval.fileName,
            },
            download: {
              fileName: downloadName,
              contentType: effectiveMime,
              sizeBytes: rawBlob.size,
            },
          },
          null,
          2
        )
      );
      toast.success("Download started");
    } catch (e) {
      const msg = getDmsCallErrorMessage(e, "Retrieve failed");
      setRetrieveLastResponse(`Retrieve failed: ${msg}`);
      toast.error(getDmsCallErrorToastMessage(e, "Retrieve failed"));
    } finally {
      setBusy(false);
    }
  };

  const loadViewerPreview = async (documentId, version = "latest") => {
    if (!dmsConfigured) {
      toast.error("Configure VITE_BASE_DMS_API_PATH.");
      return;
    }
    const id = documentId.trim();
    const ver = version.trim() || "latest";
    if (!id) {
      toast.warning("Document ID is required.");
      return;
    }
    setViewerContextDocId(id);
    setViewerContextVersion(ver);
    setViewerLoading(true);
    setViewerSession(null);
    setViewerManifest(null);
    setViewerNamedAssetId("");
    setViewerLastResponse("");
    if (viewerObjectUrl) {
      URL.revokeObjectURL(viewerObjectUrl);
      setViewerObjectUrl(null);
    }
    let createdObjectUrl = null;
    try {
      const sessionReq = {
        version: ver,
        mode: "READ_ONLY",
        watermark: true,
        requestDownload: true,
        requestPrint: false,
        requestAnnotate: false,
      };
      const sRes = await dmsFetchJson(dmsAPI.viewerSessions(id), {
        method: "POST",
        body: sessionReq,
      });
      const session = parseDmsJsonResponse(sRes, "Viewer session failed", validateViewerSessionResponse);
      setViewerSession(session);

      let manifestData = null;
      let manifestError;
      let manifestToast;
      const manifestUrl = toAbsoluteDmsUrl(session.manifestUrl);
      try {
        const mRes = await dmsFetchJson(manifestUrl);
        if (mRes.status < 200 || mRes.status >= 300) {
          manifestError = formatDmsErrorMessage(mRes.data, mRes.status);
          manifestToast = formatDmsErrorToast(mRes.data, mRes.status);
        } else if (!mRes.data) {
          manifestError = "Manifest load failed: empty response body";
          manifestToast = manifestError;
        } else {
          manifestData = mRes.data;
        }
      } catch (manifestErr) {
        manifestError = getDmsCallErrorMessage(manifestErr, "Manifest load failed");
        manifestToast = getDmsCallErrorToastMessage(manifestErr, "Manifest load failed");
      }
      setViewerManifest(manifestData);
      if (manifestToast) {
        toast.warning(manifestToast);
      }

      const artifactUrl = toAbsoluteDmsUrl(
        dmsAPI.viewerArtifactContent(session.viewerSessionId, session.sessionToken)
      );
      const blobRes = await dmsFetchBlob(artifactUrl);
      const rawBlob = await assertDmsBlobResponse(blobRes, "Viewer artifact fetch failed");
      const cd = blobRes.headers["content-disposition"];
      const dispositionName = parseFilenameFromContentDisposition(cd, `${session.viewerSessionId}.bin`);
      const headerCt = blobRes.headers["content-type"] || "application/octet-stream";
      const guessedByHeaders = inferMimeType(headerCt, dispositionName);
      const guessedByBytes = await detectMimeFromBytes(rawBlob);
      const effectiveMimeType = guessedByBytes || guessedByHeaders;
      const typedBlob = new Blob([rawBlob], { type: effectiveMimeType });
      createdObjectUrl = URL.createObjectURL(typedBlob);
      const resolvedFileName = resolveDownloadFileNameWithMime(
        dispositionName,
        session.viewerSessionId,
        undefined,
        effectiveMimeType
      );
      setViewerObjectUrl(createdObjectUrl);
      setViewerMime(effectiveMimeType);
      setViewerFileName(resolvedFileName);
      setViewerLastResponse(
        JSON.stringify(
          {
            session: {
              documentId: id,
              version: ver,
              viewerSessionId: session.viewerSessionId,
              expiresAt: session.expiresAt,
              manifestUrl: session.manifestUrl,
            },
            manifest: manifestData,
            manifestError: manifestError ?? null,
            artifact: {
              fileName: resolvedFileName,
              contentType: effectiveMimeType,
              sizeBytes: rawBlob.size,
            },
          },
          null,
          2
        )
      );
      toast.success("Viewer session ready");
    } catch (e) {
      const msg = getDmsCallErrorMessage(e, "Viewer failed");
      setViewerLastResponse(`Viewer failed: ${msg}`);
      toast.error(getDmsCallErrorToastMessage(e, "Viewer failed"));
      setViewerContextDocId("");
      setViewerContextVersion("");
      setViewerSession(null);
      setViewerManifest(null);
      setViewerNamedAssetId("");
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
      setViewerObjectUrl(null);
      setViewerMime("");
      setViewerFileName("document.bin");
    } finally {
      setViewerLoading(false);
    }
  };

  const openViewerFromTab = async () => {
    if (!viewerDocId.trim()) {
      toast.warning("Enter document ID.");
      return;
    }
    await loadViewerPreview(viewerDocId.trim(), viewerVersion.trim() || "latest");
  };

  const clearViewerPreview = () => {
    setViewerContextDocId("");
    setViewerContextVersion("");
    if (viewerObjectUrl) {
      URL.revokeObjectURL(viewerObjectUrl);
      setViewerObjectUrl(null);
    }
    setViewerMime("");
    setViewerFileName("document.bin");
    setViewerSession(null);
    setViewerManifest(null);
    setViewerNamedAssetId("");
    setViewerLastResponse("");
  };

  const handleViewerArtifactDownload = () => {
    if (!viewerObjectUrl) return;
    const a = document.createElement("a");
    a.href = viewerObjectUrl;
    a.download = viewerFileName;
    a.click();
  };

  const searchColumnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.fileName", defaultMessage: "File Name" }),
      field: "fileName",
      flex: 2,
      minWidth: 120,
      maxWidth: 280,
      cellRenderer: (params) => {
        const item = params.data;
        if (!item) return null;
        return (
          <HBox sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1, height: "100%", minWidth: 0, overflow: "hidden", width: "100%", background: "transparent" }}>
            <HLabel
              value={item.fileName}
              translate={false}
              colon={false}
              sx={{ fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}
              title={item.fileName}
            />
            {item.processingStatus ? <DmsProcessingStatusChip status={item.processingStatus} /> : null}
          </HBox>
        );
      },
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.documentId", defaultMessage: "Document ID" }),
      field: "documentId",
      flex: 2,
      minWidth: 96,
      cellStyle: { overflow: "hidden" },
      cellRenderer: (params) => (
            <HLabel
          value={params.value || "—"}
              translate={false}
              colon={false}
          sx={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", maxWidth: "100%" }}
          title={params.value}
            />
      ),
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.copy", defaultMessage: "Copy" }),
      field: "copyDocumentId",
      width: 108,
      maxWidth: 108,
      minWidth: 108,
      flex: 0,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: (params) => {
        const item = params.data;
        if (!item?.documentId) return null;
        const flashKey = `search-grid-${item.versionId}`;
        const copied = copyFlashKey === flashKey;
        return (
          <HBox sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "transparent" }}>
            <HButton
              variant="outlined"
              size="small"
              startIcon={copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              onClick={() => void copyDocumentId(item.documentId, flashKey)}
              label="utility.dms.table.copy"
              sx={{ minWidth: 0, py: 0.25, px: 0.75 }}
            />
          </HBox>
        );
      },
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.versionId", defaultMessage: "Version ID" }),
      field: "versionId",
      flex: 1.5,
      minWidth: 96,
      cellStyle: { overflow: "hidden" },
      cellRenderer: (params) => (
        <HLabel
          value={params.value || "—"}
          translate={false}
          colon={false}
          sx={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", maxWidth: "100%" }}
          title={params.value}
        />
      ),
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.size", defaultMessage: "Size" }),
      field: "sizeBytes",
      flex: 0.7,
      minWidth: 70,
      maxWidth: 100,
      valueFormatter: (params) => formatBytes(params.value),
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.actions", defaultMessage: "Actions" }),
      field: "actions",
      width: 128,
      minWidth: 128,
      maxWidth: 128,
      flex: 0,
      resizable: false,
      cellRenderer: (params) => {
        const item = params.data;
        if (!item) return null;
        return (
          <HBox sx={{ display: "flex", alignItems: "center", height: "100%", overflow: "hidden" }}>
            <HButton
              variant="contained"
              size="small"
              startIcon={<GetAppIcon />}
              disabled={!dmsConfigured || busy}
              onClick={() => handleRetrieveDownload(item.documentId, item.fileName, item.versionId)}
              label="utility.dms.btn.download"
              sx={{ py: 0.5, px: 1, fontSize: "0.75rem", whiteSpace: "nowrap" }}
            />
          </HBox>
        );
      },
    },
  ], [intl, copyFlashKey, dmsConfigured, busy, copyDocumentId, handleRetrieveDownload]);

  const versionColumnDefs = useMemo(() => [
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.versionNo", defaultMessage: "Version #" }),
      field: "versionNo",
      flex: 0.5,
      minWidth: 80,
      cellRenderer: (params) => <HLabel value={String(params.value ?? "—")} translate={false} colon={false} sx={{ fontWeight: 700 }} />,
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.versionId", defaultMessage: "Version ID" }),
      field: "versionId",
      flex: 2,
      minWidth: 220,
      cellRenderer: (params) => (
        <HLabel
          value={params.value || "—"}
          translate={false}
          colon={false}
          sx={{ fontSize: 11 }}
          title={params.value}
        />
      ),
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.status", defaultMessage: "Status" }),
      field: "processingStatus",
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params) => params.value ? <DmsProcessingStatusChip status={params.value} /> : "—",
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.validation", defaultMessage: "Validation" }),
      field: "validationStatus",
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params) => params.value ? <DmsProcessingStatusChip status={params.value} /> : "—",
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.size", defaultMessage: "Size" }),
      field: "sizeBytes",
      flex: 1,
      minWidth: 100,
      valueFormatter: (params) => formatBytes(params.value),
    },
    {
      headerName: intl.formatMessage({ id: "utility.dms.table.actions", defaultMessage: "Actions" }),
      field: "actions",
      flex: 1.2,
      minWidth: 130,
      cellRenderer: (params) => {
        const v = params.data;
        if (!v) return null;
        const isSelectedForDelete = deleteVersionId.trim() !== "" && deleteVersionId.trim() === v.versionId.trim();
        return (
          <HButton
            size="small"
            variant={isSelectedForDelete ? "contained" : "outlined"}
            onClick={() => setDeleteVersionId(v.versionId)}
            label={isSelectedForDelete ? "utility.dms.btn.selected" : "utility.dms.btn.select"}
            sx={{ py: 0.4, px: 1, fontSize: 11 }}
          />
        );
      },
    },
  ], [intl, deleteVersionId]);

  return (
    <div style={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
      <HBox
        sx={{
          boxSizing: "border-box",
          flexDirection: "column",
          alignItems: "stretch",
          mt: 2,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
            <HPaper
              elevation={0}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <HBox
                sx={{
                  px: 2.5,
                  py: 1,
                display: "flex",
                  flexShrink: 0,
                flexDirection: "column",
                  borderBottom: "1px solid var(--drs-border-divider)",
              }}
            >
                <HBreadCrumb />
                <HBox sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <TitleBar
                    title={intl.formatMessage({ id: "utility.dms.title", defaultMessage: "DMS Documents Manager" })}
              />
                </HBox>
              </HBox>

              {busy ? (
                <HLabel
                  value={intl.formatMessage({ id: "utility.dms.btn.working", defaultMessage: "Working..." })}
                  translate={false}
                  colon={false}
                  sx={{ px: 2.5, py: 0.5 }}
                />
              ) : null}

              <HTabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  px: { xs: 1.5, sm: 2.5 },
                  borderBottom: "1px solid var(--drs-border-divider)",
                }}
              >
                <HTab icon={<CloudUploadIcon fontSize="small" />} iconPosition="start" label={intl.formatMessage({ id: "utility.dms.tab.upload", defaultMessage: "Upload" })} />
                <HTab icon={<PostAddIcon fontSize="small" />} iconPosition="start" label={intl.formatMessage({ id: "utility.dms.tab.newVersion", defaultMessage: "New version" })} />
                <HTab icon={<SearchIcon fontSize="small" />} iconPosition="start" label={intl.formatMessage({ id: "utility.dms.tab.search", defaultMessage: "Search" })} />
                <HTab icon={<GetAppIcon fontSize="small" />} iconPosition="start" label={intl.formatMessage({ id: "utility.dms.tab.retrieve", defaultMessage: "Retrieve" })} />
                <HTab icon={<VisibilityIcon fontSize="small" />} iconPosition="start" label={intl.formatMessage({ id: "utility.dms.tab.viewer", defaultMessage: "Viewer" })} />
                <HTab icon={<HistoryIcon fontSize="small" />} iconPosition="start" label={intl.formatMessage({ id: "utility.dms.tab.lifecycle", defaultMessage: "Lifecycle & audit" })} />
              </HTabs>

              <HBox
                sx={{
                  p: { xs: 2, sm: 3 },
                  flex: 1,
                  width: "100%",
                  maxWidth: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                  flexDirection: "column",
                  alignItems: "stretch",
                  background: "transparent",
                  overflowX: "hidden",
                }}
              >
                {tab === 0 && (
                  <DmsTabPanel active={tab === 0}>
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", background: "transparent" }}>
                      <DmsPanel
                        overline={intl.formatMessage({ id: "utility.dms.upload.overline", defaultMessage: "Upload" })}
                        title={intl.formatMessage({ id: "utility.dms.upload.title", defaultMessage: "Upload new document" })}
                        description={intl.formatMessage({
                          id: "utility.dms.createDocumentInfo",
                          defaultMessage: "Creates a new document in two steps: POST upload:initiate (fresh Idempotency-Key, client SHA-256 checksum, classification, routing, metadata), then multipart POST to the signed upload URL. Add documentClassification in metadata when server verification is enabled. Indexing and verification run asynchronously after upload, so search may lag briefly. On success, the document ID is prefilled on New version, Retrieve, Viewer, and Versions & audit."
                        })}
                      >
                        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2.5, background: "transparent" }}>
                          <DmsFormSection
                            title={intl.formatMessage({ id: "utility.dms.upload.classification", defaultMessage: "Classification" })}
                            description={intl.formatMessage({ id: "utility.dms.upload.classificationDesc", defaultMessage: "Storage profile (e.g. standard vs archive) and sensitivity label stored on the document record." })}
                          >
                            <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, width: "100%", background: "transparent" }}>
                              <HDropdown
                                options={STORAGE_PROFILE_OPTIONS}
                                value={storageProfile}
                                onChange={(e) => setStorageProfile(e.target.value)}
                                name="storageProfile"
                                placeholder={intl.formatMessage({ id: "utility.dms.upload.storageProfile", defaultMessage: "Storage Profile" })}
                                width="100%"
                              />
                              <HDropdown
                                options={SENSITIVITY_OPTIONS.map((s) => ({ value: s, label: s }))}
                                value={sensitivity}
                                onChange={(e) => setSensitivity(e.target.value)}
                                name="sensitivity"
                                placeholder={intl.formatMessage({ id: "utility.dms.upload.sensitivity", defaultMessage: "Sensitivity" })}
                                width="100%"
                              />
                            </HBox>
                          </DmsFormSection>
                          
                          <DmsFormSection
                            title={intl.formatMessage({ id: "utility.dms.upload.routing", defaultMessage: "Routing" })}
                            description={intl.formatMessage({ id: "utility.dms.upload.routingDesc", defaultMessage: "Product, primary entity, and entity ID — copied into the search index and available as search filters." })}
                          >
                            <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, width: "100%", background: "transparent" }}>
                              <HTextField placeholder={intl.formatMessage({ id: "utility.dms.upload.product", defaultMessage: "Product" })} value={product} editable onChange={(e) => setProduct(e.target.value)} fullWidth size="small" />
                              <HTextField placeholder={intl.formatMessage({ id: "utility.dms.upload.primaryEntity", defaultMessage: "Primary Entity" })} value={primaryEntity} editable onChange={(e) => setPrimaryEntity(e.target.value)} fullWidth size="small" />
                              <HTextField placeholder={intl.formatMessage({ id: "utility.dms.upload.entityId", defaultMessage: "Entity ID" })} value={entityId} editable onChange={(e) => setEntityId(e.target.value)} fullWidth size="small" />
                            </HBox>
                          </DmsFormSection>

                          <HTextarea
                            value={metadataJson}
                            onChange={(e) => setMetadataJson(e.target.value)}
                            placeholder={intl.formatMessage({ id: "utility.dms.upload.metadataJson", defaultMessage: "Metadata JSON" })}
                            width="100%"
                            maxLines={5}
                            maxLength={250}
                          />
                          <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { sm: "stretch" }, flexWrap: "wrap", width: "100%", background: "transparent" }}>
                            <DmsFileDropZone file={uploadFile} onFileChange={setUploadFile} disabled={!dmsConfigured || busy} />
                            <HButton
                              variant="contained"
                              disabled={!dmsConfigured || !uploadFile || busy}
                              onClick={handleUpload}
                              label="utility.dms.btn.submitUpload"
                              sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
                            />
                          </HBox>
                          {lastDocumentId ? (
                            <HBox sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center", flexWrap: "wrap", maxWidth: "100%", background: "transparent" }}>
                              <HLabel
                                value={intl.formatMessage({ id: "utility.dms.upload.lastDoc", defaultMessage: "Last doc: {id}" }, { id: lastDocumentId })}
                                translate={false}
                                colon={false}
                                align="left"
                                title={lastDocumentId}
                                sx={{ maxWidth: { xs: "100%", sm: 380 }, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                              />
                              <HButton
                                variant="outlined"
                                  size="small"
                                startIcon={
                                  copyFlashKey === COPY_FLASH_UPLOAD_LAST ? (
                                    <CheckIcon fontSize="small" />
                                  ) : (
                                    <ContentCopyIcon fontSize="small" />
                                  )
                                }
                                onClick={() => void copyDocumentId(lastDocumentId, COPY_FLASH_UPLOAD_LAST)}
                                label="utility.dms.table.copy"
                              />
                            </HBox>
                          ) : null}
                        </HBox>
                      </DmsPanel>
                    </HBox>
                  </DmsTabPanel>
                )}

                {tab === 1 && (
                  <DmsTabPanel active={tab === 1}>
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", background: "transparent" }}>
                      <DmsPanel
                        overline={intl.formatMessage({ id: "utility.dms.versions.overline", defaultMessage: "Versions" })}
                        title={intl.formatMessage({ id: "utility.dms.versions.title", defaultMessage: "Upload new version" })}
                        description={intl.formatMessage({
                          id: "utility.dms.newVersionInfo",
                          defaultMessage: "Adds a version to an existing document: POST versions:initiate for the document ID (Idempotency-Key and file checksum), then multipart upload to the returned URL. Storage profile, sensitivity, routing, and metadata (including documentClassification) are inherited server-side. This form sends only the file name, content type, size, and checksum. Use Versions & audit to review processing and validation status for the version."
                        })}
                      >
                        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2.5, background: "transparent" }}>
                          <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { xs: "stretch", sm: "center" }, width: "100%", minWidth: 0, background: "transparent" }}>
                            <HBox sx={{ flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" }, background: "transparent" }}>
                            <HTextField
                              placeholder={intl.formatMessage({ id: "utility.dms.versions.documentId", defaultMessage: "Document ID" })}
                              value={newVersionDocId}
                              editable
                              onChange={(e) => setNewVersionDocId(e.target.value)}
                              size="small"
                              width="100%"
                            />
                            </HBox>
                            {newVersionDocId.trim() ? (
                              <HButton
                                variant="outlined"
                                        size="small"
                                startIcon={
                                  copyFlashKey === COPY_FLASH_NEW_VERSION ? (
                                          <CheckIcon fontSize="small" />
                                        ) : (
                                          <ContentCopyIcon fontSize="small" />
                                  )
                                }
                                onClick={() => void copyDocumentId(newVersionDocId.trim(), COPY_FLASH_NEW_VERSION)}
                                label="utility.dms.table.copy"
                                sx={{ flexShrink: 0 }}
                            />
                            ) : null}
                            <HButton
                              variant="outlined"
                              disabled={!lastDocumentId}
                              onClick={() => setNewVersionDocId(lastDocumentId)}
                              label="utility.dms.btn.useLastId"
                              sx={{ flexShrink: 0 }}
                            />
                          </HBox>
                          <DmsFileDropZone file={newVersionFile} onFileChange={setNewVersionFile} disabled={!dmsConfigured || busy} />
                          <HButton
                            variant="contained"
                            disabled={!dmsConfigured || !newVersionFile || !newVersionDocId.trim() || busy}
                            onClick={handleNewVersion}
                            label="utility.dms.btn.submitNewVersion"
                            sx={{ alignSelf: "flex-start" }}
                          />
                        </HBox>
                      </DmsPanel>
                    </HBox>
                  </DmsTabPanel>
                )}

                {tab === 2 && (
                  <DmsTabPanel active={tab === 2}>
                    <DmsTabColumn>
                      <DmsPanel
                        title={intl.formatMessage({ id: "utility.dms.search.title", defaultMessage: "Search documents" })}
                        description={intl.formatMessage({
                          id: "utility.dms.searchDocumentsInfo",
                          defaultMessage: "GET documents:search with request params for paging (page, size, sortBy, sortDirection) and filters. Free-text q matches the file name, metadata JSON, product, primary entity, and entity ID. Optional filters include content type, provider, processing status, size range, uploadedFrom/uploadedTo, and metadata key/value pairs. Set includeFacets to true for facet buckets. Each result represents one document_search_index row (indexed version). When verification is enabled, only rows with validation status PASSED or SKIPPED are returned. Newly uploaded documents may take a short time to appear."
                        })}
                      >
                        <HBox sx={{ display: "flex", flexDirection: "column", gap: 0, width: "100%", minWidth: 0, maxWidth: "100%", background: "transparent" }}>
                          <HTextarea
                            value={searchBody}
                            onChange={(e) => setSearchBody(e.target.value)}
                            placeholder={intl.formatMessage({ id: "utility.dms.search.bodyJson", defaultMessage: "Search Body JSON" })}
                            width="100%"
                            maxLines={5}
                            maxLength={250}
                          />
                          <HButton
                            variant="contained"
                            startIcon={<SearchIcon />}
                            disabled={!dmsConfigured || busy}
                            onClick={runSearch}
                            label="utility.dms.btn.search"
                            sx={{ alignSelf: "flex-start", mt: 1.5 }}
                          />
                        </HBox>
                      </DmsPanel>

                      {searchItems.length > 0 ? (
                      <DmsCollapsibleSection
                        expanded={searchTableSectionExpanded}
                        onToggle={() => setSearchTableSectionExpanded((v) => !v)}
                          title={intl.formatMessage({ id: "utility.dms.tab.search", defaultMessage: "Results" })}
                          caption={intl.formatMessage({ id: "utility.dms.search.resultsDesc", defaultMessage: "Click to show/hide the table. Filter matches across all columns." })}
                          chipLabel={
                            searchTableFilter.trim()
                              ? intl.formatMessage({ id: "utility.dms.search.resultsFilterCount", defaultMessage: "{filtered} of {total} item(s)" }, { filtered: filteredSearchItems.length, total: searchItems.length })
                              : intl.formatMessage({ id: "utility.dms.search.resultsCount", defaultMessage: "Found {count} matching item(s)" }, { count: searchItems.length })
                          }
                      >
                          <HBox sx={{ width: "100%", flexDirection: "column", minWidth: 0, maxWidth: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                            <HBox sx={{ px: 2, pt: 2, pb: 1, width: "100%", minWidth: 0, boxSizing: "border-box" }}>
                              <HTextField
                                fullWidth
                                size="small"
                                editable
                                placeholder={intl.formatMessage({ id: "utility.dms.search.filterPlaceholder", defaultMessage: "Filter all columns…" })}
                                value={searchTableFilter}
                                onChange={(e) => setSearchTableFilter(e.target.value)}
                              />
                            </HBox>
                            <DmsGridFrame>
                              <HAgGrid
                                rowData={filteredSearchItems}
                                columnDefs={searchColumnDefs}
                                defaultColDef={{ resizable: true, sortable: true, minWidth: 72 }}
                                pagination={true}
                                paginationPageSize={5}
                                domLayout="autoHeight"
                                gridStyle={{ width: "100%", maxWidth: "100%" }}
                              />
                            </DmsGridFrame>
                        </HBox>
                      </DmsCollapsibleSection>
                      ) : null}

                      <DmsCollapsibleSection
                        expanded={searchLastResponseSectionExpanded}
                        onToggle={() => setSearchLastResponseSectionExpanded((v) => !v)}
                        title={intl.formatMessage({ id: "utility.dms.search.lastResponse", defaultMessage: "Last response" })}
                        caption={
                          searchLastResponseSectionExpanded
                            ? intl.formatMessage({ id: "utility.dms.search.lastResponseDescExpanded", defaultMessage: "Full JSON from the last Search click (or an error message)." })
                            : intl.formatMessage({ id: "utility.dms.search.lastResponseDescCollapsed", defaultMessage: "Click the header to expand the raw JSON." })
                        }
                        headerActions={
                            <HButton
                              variant="outlined"
                              size="small"
                              startIcon={
                                copyFlashKey === COPY_FLASH_SEARCH_LAST_RESPONSE ? (
                                  <CheckIcon fontSize="small" />
                                ) : (
                                  <ContentCopyIcon fontSize="small" />
                                )
                              }
                              onClick={() => void copySearchLastResponse()}
                              disabled={!searchLastResponse.trim()}
                            label="utility.dms.btn.copyFullResponse"
                            />
                        }
                      >
                        <DmsJsonBody>
                              {searchLastResponse ||
                            intl.formatMessage({ id: "utility.dms.search.lastResponsePlaceholder", defaultMessage: "Run a search to see the raw API response here." })}
                        </DmsJsonBody>
                      </DmsCollapsibleSection>
                    </DmsTabColumn>
                  </DmsTabPanel>
                )}

                {tab === 3 && (
                  <DmsTabPanel active={tab === 3}>
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", background: "transparent" }}>
                      <DmsPanel
                        overline={intl.formatMessage({ id: "utility.dms.retrieve.overline", defaultMessage: "Retrieve" })}
                        title={intl.formatMessage({ id: "utility.dms.retrieve.title", defaultMessage: "Retrieve document artifact" })}
                        description={intl.formatMessage({
                          id: "utility.dms.retrieveDocumentInfo",
                          defaultMessage: "GET /documents/{documentId}?version=latest resolves the newest active version, or specify a version UUID. The API returns a time-limited signed URL for the primary artifact, and this tab downloads the file locally. Download buttons in search results automatically use that row's version ID."
                        })}
                      >
                        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2.5, background: "transparent" }}>
                          <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { xs: "stretch", sm: "center" }, width: "100%", minWidth: 0, background: "transparent" }}>
                            <HBox sx={{ flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" } }}>
                            <HTextField placeholder={intl.formatMessage({ id: "utility.dms.retrieve.documentId", defaultMessage: "Document ID" })} value={retrieveDocId} editable onChange={(e) => setRetrieveDocId(e.target.value)} size="small" width="100%" />
                            </HBox>
                            <HButton
                              variant="outlined"
                              disabled={!lastDocumentId}
                              onClick={() => setRetrieveDocId(lastDocumentId)}
                              label="utility.dms.btn.useLastId"
                              sx={{ flexShrink: 0 }}
                            />
                          </HBox>
                          <HTextField placeholder={intl.formatMessage({ id: "utility.dms.retrieve.versionSelector", defaultMessage: "Version Selector" })} value={retrieveVersion} editable onChange={(e) => setRetrieveVersion(e.target.value)} fullWidth size="small" />
                          <HButton
                            variant="contained"
                            startIcon={<GetAppIcon />}
                            disabled={!dmsConfigured || !retrieveDocId.trim() || busy}
                            onClick={() => handleRetrieveDownload(retrieveDocId, "", retrieveVersion)}
                            label="utility.dms.btn.download"
                            sx={{ alignSelf: "flex-start" }}
                          />
                          {retrieveLastResponse ? (
                            <DmsNotice>
                                {retrieveLastResponse}
                            </DmsNotice>
                          ) : null}
                        </HBox>
                      </DmsPanel>
                    </HBox>
                  </DmsTabPanel>
                )}

                {tab === 4 && (
                  <DmsTabPanel active={tab === 4}>
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", background: "transparent" }}>
                      <DmsPanel
                        overline={intl.formatMessage({ id: "utility.dms.viewer.overline", defaultMessage: "Viewer" })}
                        title={intl.formatMessage({ id: "utility.dms.viewer.title", defaultMessage: "Document viewer session" })}
                        accent="secondary"
                        description={intl.formatMessage({
                          id: "utility.dms.viewerInfo",
                          defaultMessage: "POST viewer-sessions with version set to latest (default) or a version UUID, using the same resolution rules as Retrieve. The session returns a token, manifest, and signed artifact URLs. PDFs and images are displayed inline, while other file types can be downloaded or opened in a new tab. Named manifest assets can also be downloaded separately."
                        })}
                      >
                        <HBox sx={{ display: "flex", flexDirection: "column", gap: 2.5, background: "transparent" }}>
                          <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { xs: "stretch", sm: "center" }, width: "100%", minWidth: 0, background: "transparent" }}>
                            <HBox sx={{ flex: 1, minWidth: 0, width: { xs: "100%", sm: "auto" } }}>
                            <HTextField placeholder={intl.formatMessage({ id: "utility.dms.viewer.documentId", defaultMessage: "Document ID" })} value={viewerDocId} editable onChange={(e) => setViewerDocId(e.target.value)} size="small" width="100%" />
                            </HBox>
                            <HButton
                              variant="outlined"
                              disabled={!lastDocumentId}
                              onClick={() => setViewerDocId(lastDocumentId)}
                              label="utility.dms.btn.useLastId"
                              sx={{ flexShrink: 0 }}
                            />
                          </HBox>
                          <HTextField placeholder={intl.formatMessage({ id: "utility.dms.viewer.versionSelector", defaultMessage: "Version Selector" })} value={viewerVersion} editable onChange={(e) => setViewerVersion(e.target.value)} fullWidth size="small" />
                          <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { sm: "center" }, flexWrap: "wrap", background: "transparent" }}>
                            <HButton
                              variant="contained"
                              startIcon={<VisibilityIcon />}
                              disabled={!dmsConfigured || !viewerDocId.trim() || viewerLoading}
                              onClick={openViewerFromTab}
                              label={viewerLoading ? "utility.dms.btn.working" : "utility.dms.btn.openViewer"}
                            />
                            <HButton
                              variant="outlined"
                              disabled={!viewerObjectUrl && !viewerSession}
                              onClick={clearViewerPreview}
                              label="utility.dms.btn.clearPreview"
                            />
                          </HBox>
                          
                          {viewerContextDocId || viewerSession || viewerManifest ? (
                            <HBox sx={{ display: "flex", flexDirection: "column", gap: 0.25, width: "100%" }}>
                          {viewerContextDocId ? (
                              <HLabel
                                  value={`${intl.formatMessage({ id: "utility.dms.viewer.activeDoc", defaultMessage: "Active document" })}: ${viewerContextDocId}`}
                                  translate={false}
                                colon={false}
                                align="left"
                                  width="100%"
                                  sx={{ fontWeight: 600, fontSize: 12, m: 0, lineHeight: 1.4 }}
                              />
                              ) : null}
                              {viewerContextVersion ? (
                                <HLabel
                                  value={intl.formatMessage({ id: "utility.dms.viewer.version", defaultMessage: "Version: {version}" }, { version: viewerContextVersion })}
                                  translate={false}
                                  colon={false}
                                  align="left"
                                  width="100%"
                                  sx={{ fontSize: 12, m: 0, lineHeight: 1.4 }}
                                />
                              ) : null}
                              {viewerSession ? (
                                <HLabel
                                  value={`${intl.formatMessage({ id: "utility.dms.viewer.session", defaultMessage: "Session" })}: ${viewerSession.viewerSessionId}`}
                                  translate={false}
                                  colon={false}
                                  align="left"
                                  width="100%"
                                  sx={{ fontSize: 12, m: 0, lineHeight: 1.4 }}
                                />
                          ) : null}
                              {viewerManifest ? (
                              <HLabel
                                  value={`${intl.formatMessage({ id: "utility.dms.viewer.renderMode", defaultMessage: "Render mode" })}: ${String(viewerManifest.renderMode ?? "—")}`}
                                translate={false}
                                colon={false}
                                align="left"
                                  width="100%"
                                  sx={{ fontSize: 12, m: 0, lineHeight: 1.4 }}
                                />
                              ) : null}
                              {viewerManifest ? (
                                <HLabel
                                  value={`${intl.formatMessage({ id: "utility.dms.viewer.pages", defaultMessage: "Pages" })}: ${String(viewerManifest.pageCount ?? "—")}`}
                                  translate={false}
                                  colon={false}
                                  align="left"
                                  width="100%"
                                  sx={{ fontSize: 12, m: 0, lineHeight: 1.4 }}
                                />
                              ) : null}
                              {viewerManifest?.assetUrlTemplate ? (
                                <HLabel
                                  value={`${intl.formatMessage({ id: "utility.dms.viewer.assetTemplate", defaultMessage: "Asset template" })}: ${String(viewerManifest.assetUrlTemplate)}`}
                                  translate={false}
                                  colon={false}
                                  align="left"
                                  width="100%"
                                  sx={{ fontSize: 12, m: 0, lineHeight: 1.4, wordBreak: "break-all" }}
                              />
                              ) : null}
                            </HBox>
                          ) : null}

                          {viewerSession ? (
                            <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, flexWrap: "wrap", alignItems: { xs: "stretch", sm: "flex-end" }, gap: 2, width: "100%" }}>
                              <HTextField
                                placeholder={intl.formatMessage({ id: "utility.dms.viewer.namedAssetId", defaultMessage: "Named asset id (optional)" })}
                                value={viewerNamedAssetId}
                                editable
                                onChange={(e) => setViewerNamedAssetId(e.target.value)}
                                fullWidth
                                size="small"
                              />
                              <HButton
                                variant="outlined"
                                disabled={!dmsConfigured || busy || !viewerNamedAssetId.trim()}
                                onClick={() => void downloadViewerNamedAsset()}
                                label="utility.dms.btn.downloadNamedAsset"
                                sx={{ flexShrink: 0 }}
                              />
                            </HBox>
                          ) : null}

                          {viewerLastResponse ? (
                            <DmsNotice>
                                {viewerLastResponse}
                            </DmsNotice>
                          ) : null}
                        </HBox>
                      </DmsPanel>
                      
                      <DmsViewerFrame fileName={viewerFileName} hasContent={Boolean(viewerObjectUrl)}>
                        {(() => {
                          if (!viewerObjectUrl) {
                            return (
                              <DmsEmptyState
                                icon={<VisibilityIcon sx={{ fontSize: 28 }} />}
                                title={intl.formatMessage({ id: "utility.dms.viewer.noPreviewTitle", defaultMessage: "No preview loaded" })}
                                description={intl.formatMessage({ id: "utility.dms.viewer.noPreviewDesc", defaultMessage: "Enter a document ID and version, then click Open viewer. PDFs and images render inline; other types offer download." })}
                              />
                            );
                          }
                          const isPdf = viewerMime.toLowerCase().includes("pdf");
                          const isImage = viewerMime.startsWith("image/") || isImageFileName(viewerFileName);
                          const unsupported = !isPdf && !isImage;
                          if (unsupported) {
                            return (
                              <HBox sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, py: 5, px: 3, background: "transparent" }}>
                                <HLabel
                                    value={intl.formatMessage({ id: "utility.dms.viewer.unsupported", defaultMessage: "Preview is not supported for this file type in the browser. Download the viewer artifact or open it in a new tab." })}
                                    translate={false}
                                    colon={false}
                                    align="center"
                                    sx={{ maxWidth: 440 }}
                                  />
                                <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, background: "transparent" }}>
                                  <HButton variant="contained" onClick={handleViewerArtifactDownload} label="utility.dms.btn.downloadFile" />
                                  <HButton
                                    variant="outlined"
                                    component="a"
                                    href={viewerObjectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<OpenInNewIcon />}
                                    label="utility.dms.btn.openInNewTab"
                                  />
                                </HBox>
                              </HBox>
                            );
                          }
                          if (isPdf) {
                            return (
                              <HBox sx={{ height: "min(100vh, 720px)", minHeight: 360 }}>
                                <iframe title="DMS viewer" src={viewerObjectUrl} style={{ width: "100%", height: "100%", border: "none" }} />
                              </HBox>
                            );
                          }
                          return (
                            <HBox display="flex" justifyContent="center" alignItems="center" sx={{ py: 2, px: 2 }}> 
                              <img
                                src={viewerObjectUrl}
                                alt={viewerFileName}
                                style={{ maxWidth: "100%", maxHeight: "min(100vh, 720px)", borderRadius: 12, boxShadow: "0 8px 32px rgba(15,23,42,0.12)" }}
                              />
                            </HBox>
                          );
                        })()}
                      </DmsViewerFrame>
                    </HBox>
                  </DmsTabPanel>
                )}

                {tab === 5 && (
                  <DmsTabPanel active={tab === 5}>
                    <HBox sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", background: "transparent" }}>
                      <DmsPanel
                        overline={intl.formatMessage({ id: "utility.dms.admin.overline", defaultMessage: "Administration" })}
                        title={intl.formatMessage({ id: "utility.dms.admin.title", defaultMessage: "Lifecycle & audit" })}
                        accent="accent"
                        description={intl.formatMessage({
                          id: "utility.dms.versionsAuditInfo",
                          defaultMessage: "GET list-versions for a document. Processing and validation status are taken from document_versions only. Select a version for deletion (soft delete by default, with optional hard delete). Retention until and legal hold are applied at the document level. You can also verify the tenant audit hash chain using GET /v1/api/audit/verify."
                        })}
                      >
                        <HBox sx={{ display: "flex", flexDirection: "column", gap: 3, background: "transparent" }}>
                          <HBox sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: { xs: "stretch", md: "center" }, width: "100%", minWidth: 0, background: "transparent" }}>
                            <HBox sx={{ flex: 1, minWidth: 0, width: { xs: "100%", md: "auto" } }}>
                            <HTextField
                              placeholder={intl.formatMessage({ id: "utility.dms.admin.documentId", defaultMessage: "Document ID" })}
                              editable
                              value={lifecycleDocId}
                              onChange={(e) => setLifecycleDocId(e.target.value)}
                              width="100%"
                            />
                            </HBox>
                            <HButton
                              variant="outlined"
                              disabled={!lastDocumentId}
                              onClick={() => setLifecycleDocId(lastDocumentId)}
                              label="utility.dms.btn.useLastId"
                              sx={{ flexShrink: 0 }}
                            />
                            <HButton
                              variant="contained"
                              startIcon={<HistoryIcon />}
                              disabled={!dmsConfigured || !lifecycleDocId.trim() || busy}
                              onClick={fetchDocumentVersions}
                              label="utility.dms.btn.loadVersions"
                              sx={{ flexShrink: 0 }}
                            />
                          </HBox>

                          {versionsData && versionsData.versions?.length ? (
                            <DmsCollapsibleSection
                              expanded={versionsTableExpanded}
                              onToggle={() => setVersionsTableExpanded((v) => !v)}
                              title={intl.formatMessage({ id: "utility.dms.admin.versionsTitle", defaultMessage: "Document versions" })}
                              caption={intl.formatMessage({ id: "utility.dms.admin.versionsDesc", defaultMessage: "Click to show/hide the table. Status pairs version and index processing; validation is from the search index. Use Select for delete." })}
                              chipLabel={
                                        versionSearch.trim()
                                  ? intl.formatMessage({ id: "utility.dms.admin.versionsFilterCount", defaultMessage: "{filtered} of {total} version(s)" }, { filtered: filteredVersionsData.length, total: versionsData.versions.length })
                                  : intl.formatMessage({ id: "utility.dms.admin.versionsTotalCount", defaultMessage: "{total} version(s)" }, { total: versionsData.versions.length })
                                      }
                            >
                              <HBox sx={{ width: "100%", flexDirection: "column", minWidth: 0, maxWidth: "100%" }}>
                                <HBox sx={{ px: 2, pt: 2, pb: 1 }}>
                                    <HTextField
                                      fullWidth
                                      editable
                                      size="small"
                                    placeholder={intl.formatMessage({ id: "utility.dms.version.filterPlaceholder", defaultMessage: "Filter versions…" })}
                                      value={versionSearch}
                                      onChange={(e) => setVersionSearch(e.target.value)}
                                    />
                                  </HBox>
                                <HBox sx={{ width: "100%", minWidth: 0, maxWidth: "100%" }}>
                                    <HAgGrid
                                      rowData={filteredVersionsData}
                                      columnDefs={versionColumnDefs}
                                      pagination={true}
                                      paginationPageSize={5}
                                      domLayout="autoHeight"
                                    />
                                  </HBox>
                                </HBox>
                            </DmsCollapsibleSection>
                          ) : null}

                          <DmsSubSectionHeading title={intl.formatMessage({ id: "utility.dms.retention.title", defaultMessage: "Retention and legal hold" })} />
                          <HBox sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", background: "transparent" }}>
                            <HTextField
                              placeholder={intl.formatMessage({ id: "utility.dms.retention.until", defaultMessage: "Retention until (ISO-8601 instant; leave empty to clear)" })}
                              value={retentionUntilInput}
                              editable
                              onChange={(e) => setRetentionUntilInput(e.target.value)}
                              fullWidth
                            />
                            <HBox sx={{mt: 3, background: "transparent"}}>
                              <HToggle
                                size="small"
                                checked={legalHoldInput}
                                onChange={(e) => {
                                  setLegalHoldInput(e.target.checked)
                                }}
                                label={intl.formatMessage({ id: "utility.dms.retention.legalHold", defaultMessage: "Legal hold" })}
                              />
                            </HBox>
                            <HButton
                              variant="contained"
                              disabled={!dmsConfigured || !lifecycleDocId.trim() || busy}
                              onClick={() => void saveRetentionControls()}
                              label="utility.dms.retention.save"
                              sx={{ alignSelf: "flex-start" }}
                            />
                          </HBox>

                          <DmsSubSectionHeading title={intl.formatMessage({ id: "utility.dms.delete.title", defaultMessage: "Delete version" })} accent="accent" />
                          <HBox sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, alignItems: { sm: "center" }, flexWrap: "wrap", width: "100%", background: "transparent" }}>
                            <HTextField
                              placeholder={intl.formatMessage({ id: "utility.dms.delete.versionId", defaultMessage: "Version ID to delete" })}
                              value={deleteVersionId}
                              editable
                              onChange={(e) => setDeleteVersionId(e.target.value)}
                              sx={{ flex: 1, minWidth: 220 }}
                            />
                            <HBox sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center", flexShrink: 0, background: "transparent" }}>
                              <HToggle
                                size="small"
                                checked={deleteHard}
                                onChange={(e) => {
                                  setDeleteHard(e.target.checked)
                                }}
                                label={intl.formatMessage({ id: "utility.dms.delete.hard", defaultMessage: "Hard delete" })}
                              />
                              <HButton
                                variant="outlined"
                                size="small"
                                startIcon={<DeleteOutlineIcon />}
                                disabled={!dmsConfigured || busy}
                                onClick={() => void removeDocumentVersion()}
                                label="utility.dms.delete.btn"
                                sx={{ whiteSpace: "nowrap" }}
                              />
                                  </HBox>
                                </HBox>

                          <DmsCollapsibleSection
                            expanded={versionsJsonExpanded}
                            onToggle={() => setVersionsJsonExpanded((v) => !v)}
                            title={intl.formatMessage({ id: "utility.dms.json.title", defaultMessage: "Last versions API JSON" })}
                            caption={
                              versionsJsonExpanded
                                ? intl.formatMessage({ id: "utility.dms.json.descExpanded", defaultMessage: "Full JSON from the last load versions request." })
                                : intl.formatMessage({ id: "utility.dms.json.descCollapsed", defaultMessage: "Click the header to expand the raw JSON." })
                            }
                            headerActions={
                                    <HButton
                                      variant="outlined"
                                      size="small"
                                      startIcon={
                                        copyFlashKey === COPY_FLASH_VERSIONS_JSON ? (
                                          <CheckIcon fontSize="small" />
                                        ) : (
                                          <ContentCopyIcon fontSize="small" />
                                        )
                                      }
                                      onClick={() => void copyVersionsJson()}
                                      disabled={!versionsJson.trim()}
                                label="utility.dms.json.copy"
                                    />
                            }
                                  >
                            <DmsJsonBody>
                              {versionsJson ||
                                intl.formatMessage({ id: "utility.dms.json.placeholder", defaultMessage: "Load versions to see the API JSON here." })}
                            </DmsJsonBody>
                          </DmsCollapsibleSection>

                          <HBox sx={{ width: "100%", borderTop: "1px solid var(--drs-border-divider)", my: 1, background: "transparent" }} />

                          <HLabel
                            value={intl.formatMessage({ id: "utility.dms.audit.title", defaultMessage: "Audit verification" })}
                            translate={false}
                            colon={false}
                            sx={{
                              fontWeight: 800,
                              display: "block",
                            }}
                          />
                          <HButton
                            variant="contained"
                            color="secondary"
                            startIcon={<FactCheckIcon />}
                            disabled={!dmsConfigured || busy}
                            onClick={() => void runAuditVerify()}
                            label="utility.dms.audit.verifyBtn"
                            sx={{ alignSelf: "flex-start" }}
                          />
                          {auditResultJson ? (
                            <HPaper variant="outlined" sx={{ p: 2, maxHeight: 240, overflow: "auto" }}>
                              <pre style={{ margin: 0, fontFamily: "inherit", fontSize: 12, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                {auditResultJson}
                              </pre>
                            </HPaper>
                          ) : null}
                        </HBox>
                      </DmsPanel>
                    </HBox>
                  </DmsTabPanel>
                )}
              </HBox>
            </HPaper>
      </HBox>
    </div>
  );
}
